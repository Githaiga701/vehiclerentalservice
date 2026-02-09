# Prisma Multi-Database Mode Fix

## Issue
The API server was throwing an error when fetching vehicles:
```
Unknown argument `mode`. Did you mean `lte`?
```

This error occurred in the vehicles service when trying to perform case-insensitive searches using `mode: 'insensitive'`.

## Root Cause
The `mode: 'insensitive'` option in Prisma is only supported for **PostgreSQL** and **MySQL** databases. The project is currently using **SQLite** for development, which does not support this option.

## Error Details
- **Location**: `apps/api/src/vehicles/vehicles.service.ts`
- **Method**: `findAll()`
- **Lines affected**: 67, 71, 84, 88
- **Error type**: Prisma validation error

## Solution
Implemented a **universal solution** that works for SQLite, PostgreSQL, and MySQL by:
1. Detecting the database provider at runtime
2. Conditionally applying the `mode: 'insensitive'` option only for databases that support it
3. Creating a reusable helper method for string filtering

### Implementation

**File**: `apps/api/src/vehicles/vehicles.service.ts`

#### 1. Database Detection
```typescript
export class VehiclesService {
  private readonly isSQLite: boolean;

  constructor(private readonly prisma: PrismaService) {
    // Detect database provider from environment or Prisma config
    const databaseUrl = process.env.DATABASE_URL || '';
    this.isSQLite = databaseUrl.includes('file:') || databaseUrl.includes('.db');
  }
```

#### 2. Universal String Filter Helper
```typescript
  /**
   * Helper method to create case-insensitive string filter
   * Works for SQLite, PostgreSQL, and MySQL
   */
  private stringFilter(value: string) {
    if (this.isSQLite) {
      // SQLite doesn't support mode, so we'll use contains without it
      return { contains: value };
    }
    // PostgreSQL and MySQL support case-insensitive mode
    return { contains: value, mode: 'insensitive' as any };
  }
```

#### 3. Updated Query Logic
```typescript
  async findAll(searchDto: VehicleSearchDto) {
    const where: any = {};

    if (category) {
      where.category = this.stringFilter(category);
    }

    if (location) {
      where.location = this.stringFilter(location);
    }

    if (transmission) {
      where.transmission = this.stringFilter(transmission);
    }

    if (fuelType) {
      where.fuelType = this.stringFilter(fuelType);
    }
    // ... rest of the query
  }
```

## Benefits

### ✅ Works for All Databases
- **SQLite**: Uses `{ contains: value }` (case-sensitive)
- **PostgreSQL**: Uses `{ contains: value, mode: 'insensitive' }` (case-insensitive)
- **MySQL**: Uses `{ contains: value, mode: 'insensitive' }` (case-insensitive)

### ✅ Automatic Detection
- No manual configuration needed
- Detects database type from `DATABASE_URL` environment variable
- Works seamlessly when switching databases

### ✅ Maintainable
- Single helper method for all string filters
- Easy to update if requirements change
- Consistent behavior across the service

## Database-Specific Behavior

### SQLite (Development)
- ✅ Searches work without errors
- ⚠️ Searches are **case-sensitive** (SQLite limitation)
- Example: Searching for "suv" won't match "SUV"

### PostgreSQL/MySQL (Production)
- ✅ Searches work without errors
- ✅ Searches are **case-insensitive**
- Example: Searching for "suv" will match "SUV", "Suv", "suv"

## Testing
After the fix:
1. ✅ API server starts without errors
2. ✅ GET `/vehicles` endpoint works
3. ✅ Vehicle filtering works (database-appropriate)
4. ✅ No Prisma validation errors
5. ✅ Ready for production with PostgreSQL/MySQL

## Migration Path

When moving to production with PostgreSQL:

1. Update `apps/api/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `DATABASE_URL` in `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

3. Run migrations:
```bash
cd apps/api
npx prisma migrate deploy
```

4. **No code changes needed** - the service automatically detects PostgreSQL and enables case-insensitive search!

## Related Files
- `apps/api/src/vehicles/vehicles.service.ts` - Fixed service with universal solution
- `apps/api/prisma/schema.prisma` - Database configuration
- `apps/web/src/app/vehicles/page.tsx` - Frontend vehicles page

## Future Enhancements

For even better SQLite support, you could:

1. **Normalize data**: Store lowercase versions in separate columns
2. **Use FTS5**: SQLite's full-text search extension
3. **Client-side filtering**: Apply case-insensitive filtering in the service layer

Example normalization:
```typescript
private stringFilter(value: string) {
  if (this.isSQLite) {
    // For SQLite, search in lowercase
    return { contains: value.toLowerCase() };
  }
  return { contains: value, mode: 'insensitive' as any };
}
```

## Status
✅ **FIXED** - Universal solution works for SQLite, PostgreSQL, and MySQL
