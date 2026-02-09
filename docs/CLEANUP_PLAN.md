# Repository Cleanup Plan

## 🗑️ Items to Remove

### 1. Duplicate Folder (CRITICAL)
- `vehiclerentalservice/` - Complete duplicate of the project (causing repo bloat)

### 2. Temporary Files
- `.temp_delete`

### 3. Documentation Consolidation
Move all documentation to `docs/` folder:

#### Keep in Root (Essential)
- README.md
- SETUP_GUIDE.md
- render.yaml
- package.json
- pnpm-lock.yaml
- pnpm-workspace.yaml
- tsconfig.base.json
- turbo.json
- .gitignore
- .eslintrc.cjs
- .npmrc
- .prettierrc

#### Move to docs/ (All MD files)
- All other .md files (70+ files)
- All .ps1 test scripts
- All .sh scripts
- test-integration.html

### 4. Create docs/ Subdirectories
```
docs/
├── setup/          # Setup and deployment guides
├── testing/        # Testing guides and scripts
├── features/       # Feature documentation
├── fixes/          # Bug fix documentation
└── admin/          # Admin guides
```

## 🎯 Benefits

1. **Smaller Repository**: Remove duplicate folder (~50% size reduction)
2. **Better Organization**: All docs in proper folders
3. **Faster Cloning**: Render will clone faster
4. **Cleaner Root**: Only essential files visible
5. **Easier Navigation**: Organized documentation

## ⚠️ Render Clone Issue

The GitHub 500 error is likely caused by:
1. **Large repository size** (duplicate folder)
2. **Too many files** in root directory
3. **Network timeout** during clone

**Solution**: Clean up repo, then Render should clone successfully.
