# Admin View Button Fix

## Issue
The "View" button in the admin vehicles management page (`/admin/vehicles`) had no functionality - clicking it did nothing.

## Solution Implemented
Added an `onClick` handler to the View button that navigates to the vehicle detail page.

### Code Changes

**File**: `apps/web/src/app/admin/vehicles/page.tsx`

**Line 408**: Added navigation handler to View button:
```typescript
<Button size="sm" variant="outline" onClick={() => router.push(`/vehicles/${vehicle.id}`)}>
  <Eye className="w-3 h-3 mr-1" />
  View
</Button>
```

## How It Works

1. When admin clicks "View" button on any vehicle in the admin vehicles list
2. The app navigates to `/vehicles/[vehicleId]` using Next.js router
3. The vehicle detail page (`apps/web/src/app/vehicles/[slug]/page.tsx`) loads
4. The page fetches vehicle data using `apiClient.getVehicle(id)`
5. Full vehicle details are displayed including:
   - Image gallery with carousel
   - Vehicle specifications (seats, transmission, fuel type, year)
   - Features list
   - Owner information
   - Booking form
   - Similar vehicles

## Integration Points

### Admin Vehicles Page
- Uses mock vehicle data with IDs: "v1", "v2", "v3", "v4"
- Each vehicle card has three action buttons:
  - **Approve** (for pending vehicles)
  - **Enable/Disable** (toggle availability)
  - **View** (navigate to detail page) ✅ NOW WORKING

### Vehicle Detail Page
- Accepts vehicle ID via URL parameter (`/vehicles/[slug]`)
- Fetches vehicle data from API using `apiClient.getVehicle(id)`
- Currently uses mock data but has API integration ready
- Displays comprehensive vehicle information
- Includes booking functionality

### API Client
- `getVehicle(id: string)` method available in `apps/web/src/lib/api-client.ts`
- Endpoint: `GET /vehicles/:id`
- Includes caching (10 minutes TTL)
- Stale-while-revalidate enabled for better UX

## Testing Checklist

To verify the fix works correctly:

1. ✅ Navigate to `/admin/vehicles` (requires admin login)
2. ✅ Click "View" button on any vehicle
3. ✅ Verify navigation to `/vehicles/[vehicleId]`
4. ✅ Verify vehicle detail page loads
5. ✅ Verify vehicle information displays correctly
6. ✅ Verify back navigation works

## Related Files

- `apps/web/src/app/admin/vehicles/page.tsx` - Admin vehicles management
- `apps/web/src/app/vehicles/[slug]/page.tsx` - Vehicle detail page
- `apps/web/src/lib/api-client.ts` - API integration
- `apps/web/src/components/VehicleCard.tsx` - Vehicle card component

## Status
✅ **COMPLETE** - View button now navigates to vehicle detail page

## Notes

- The vehicle detail page currently uses mock data but has API integration ready
- When backend API is fully integrated, the page will automatically fetch real vehicle data
- The ID format from admin page matches the expected parameter in detail page
- Navigation uses Next.js router for client-side routing (fast, no page reload)
