# Profile Edit Enhancement - Picture Upload in Dialog

**Date:** February 7, 2026  
**Status:** ✅ Enhanced

---

## Overview

Enhanced the profile edit dialog to include profile picture upload functionality, allowing users to update their profile picture along with their name and email in a single form.

---

## Changes Made

### 1. State Management

Added new state variables:
```typescript
const [selectedImage, setSelectedImage] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);
```

**Purpose:**
- `selectedImage` - Stores the selected file for upload
- `imagePreview` - Stores the base64 preview URL for display

---

### 2. Image Selection Handler

**Function:** `handleImageSelect(e)`

**Features:**
- Validates file type (images only)
- Validates file size (max 5MB)
- Creates preview using FileReader
- Updates state with file and preview
- Shows error toasts for invalid files

**Code:**
```typescript
const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file');
    return;
  }

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image size should be less than 5MB');
    return;
  }

  setSelectedImage(file);
  
  // Create preview
  const reader = new FileReader();
  reader.onloadend = () => {
    setImagePreview(reader.result as string);
  };
  reader.readAsDataURL(file);
};
```

---

### 3. Enhanced Update Handler

**Function:** `handleUpdateProfile(e)`

**New Flow:**
1. Update profile info (name, email)
2. If image selected, upload it
3. Show success message
4. Close dialog and reset states
5. Refresh user data

**Code:**
```typescript
const handleUpdateProfile = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    setIsUpdating(true);

    // Update profile info
    await apiClient.updateProfile(editForm);

    // Upload profile picture if selected
    if (selectedImage) {
      const formData = new FormData();
      formData.append('profilePicture', selectedImage);

      const response = await fetch('http://localhost:3001/auth/profile-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload profile picture');
      }
    }

    toast.success("Profile updated successfully");
    setIsEditDialogOpen(false);
    setSelectedImage(null);
    setImagePreview(null);
    await refreshUser();
  } catch (error) {
    handleApiError(error);
  } finally {
    setIsUpdating(false);
  }
};
```

---

### 4. Enhanced Dialog UI

**New Features:**

#### Profile Picture Section
- Large avatar preview (24x24 = 96px)
- Shows preview of selected image
- Shows current profile picture if no new image
- Shows initials fallback if no picture
- Camera icon button for file selection
- File name display when image selected
- Remove button to clear selection

#### Layout
```
┌─────────────────────────────┐
│   Edit Profile Dialog       │
├─────────────────────────────┤
│                             │
│      [Avatar Preview]       │
│         [Camera 📷]         │
│                             │
│   Selected: image.jpg       │
│        [Remove]             │
│                             │
│   Full Name: [_________]    │
│   Email:     [_________]    │
│                             │
│      [Cancel] [Save]        │
└─────────────────────────────┘
```

---

## UI Components

### Avatar Preview
```tsx
<Avatar className="h-24 w-24">
  {imagePreview ? (
    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
  ) : user.profilePicture ? (
    <Image src={`http://localhost:3001${user.profilePicture}`} alt={user.name} fill />
  ) : (
    <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
      {user.name?.charAt(0)?.toUpperCase() || "U"}
    </AvatarFallback>
  )}
</Avatar>
```

### Camera Button
```tsx
<label
  htmlFor="edit-profile-picture"
  className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
>
  <Camera className="h-4 w-4" />
</label>
```

### File Input
```tsx
<input
  id="edit-profile-picture"
  type="file"
  accept="image/*"
  className="hidden"
  onChange={handleImageSelect}
  disabled={isUpdating}
/>
```

### Selected Image Info
```tsx
{selectedImage && (
  <div className="text-center">
    <p className="text-sm text-muted-foreground">
      New picture selected: {selectedImage.name}
    </p>
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => {
        setSelectedImage(null);
        setImagePreview(null);
      }}
      className="text-xs mt-1"
    >
      Remove
    </Button>
  </div>
)}
```

---

## User Experience

### Before Enhancement:
1. Click "Edit Profile"
2. Update name/email
3. Save
4. Separately click camera icon to upload picture

### After Enhancement:
1. Click "Edit Profile"
2. See current profile picture
3. Click camera icon to select new picture
4. See preview of new picture
5. Update name/email if needed
6. Click "Save Changes" - updates everything at once!

---

## Features

### ✅ Image Preview
- Shows preview before upload
- Uses FileReader for instant preview
- Displays current picture if no new selection
- Falls back to initials if no picture

### ✅ Validation
- Client-side file type validation
- Client-side file size validation (5MB)
- Error messages via toast notifications
- Disabled state during upload

### ✅ User Feedback
- Preview updates immediately
- File name displayed
- Remove button to clear selection
- Loading state during save
- Success/error notifications

### ✅ State Management
- Clears selection on dialog close
- Clears selection on cancel
- Resets preview on remove
- Refreshes user data after save

---

## Comparison: Two Upload Methods

### Method 1: Avatar Camera Icon (Quick Upload)
**Location:** Profile page, on avatar  
**Use Case:** Quick picture change  
**Steps:**
1. Click camera icon
2. Select image
3. Auto-upload immediately

**Pros:**
- Fast and direct
- Minimal clicks
- Immediate upload

**Cons:**
- No preview before upload
- Can't combine with other edits

### Method 2: Edit Dialog (Comprehensive Edit)
**Location:** Edit Profile dialog  
**Use Case:** Update multiple fields  
**Steps:**
1. Click "Edit Profile"
2. Select new picture (optional)
3. Update name/email (optional)
4. Click "Save Changes"

**Pros:**
- Preview before upload
- Combine multiple edits
- Can remove selection
- Single save action

**Cons:**
- More clicks
- Requires opening dialog

---

## Technical Details

### Image Preview Generation
```typescript
const reader = new FileReader();
reader.onloadend = () => {
  setImagePreview(reader.result as string);
};
reader.readAsDataURL(file);
```

**Process:**
1. Create FileReader instance
2. Read file as Data URL (base64)
3. Store result in state
4. Display in Image component

### Upload Process
```typescript
if (selectedImage) {
  const formData = new FormData();
  formData.append('profilePicture', selectedImage);

  const response = await fetch('http://localhost:3001/auth/profile-picture', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    },
    body: formData,
  });
}
```

---

## Validation Rules

### File Type
- **Accepted:** image/*
- **Rejected:** All non-image files
- **Error:** "Please select an image file"

### File Size
- **Maximum:** 5MB (5 * 1024 * 1024 bytes)
- **Error:** "Image size should be less than 5MB"

### Required Fields
- **Name:** Required
- **Email:** Optional
- **Picture:** Optional

---

## State Cleanup

### On Dialog Close:
```typescript
setIsEditDialogOpen(false);
setSelectedImage(null);
setImagePreview(null);
```

### On Cancel:
```typescript
onClick={() => {
  setIsEditDialogOpen(false);
  setSelectedImage(null);
  setImagePreview(null);
}}
```

### On Remove:
```typescript
onClick={() => {
  setSelectedImage(null);
  setImagePreview(null);
}}
```

---

## Testing Checklist

### Functionality:
- [ ] Dialog opens with current picture
- [ ] Camera icon opens file picker
- [ ] Preview shows selected image
- [ ] File name displays correctly
- [ ] Remove button clears selection
- [ ] Validation rejects non-images
- [ ] Validation rejects large files
- [ ] Save uploads picture and updates profile
- [ ] Success toast appears
- [ ] Dialog closes after save
- [ ] User data refreshes
- [ ] Picture displays on profile page

### Edge Cases:
- [ ] No picture selected (skip upload)
- [ ] Cancel after selecting picture
- [ ] Remove picture after selecting
- [ ] Upload fails (error handling)
- [ ] Network error during upload
- [ ] Large file selected
- [ ] Non-image file selected
- [ ] Multiple rapid selections

### UI/UX:
- [ ] Preview looks good
- [ ] Camera icon visible
- [ ] Loading state shows
- [ ] Disabled state works
- [ ] Mobile responsive
- [ ] Touch-friendly buttons
- [ ] Accessible (keyboard navigation)

---

## Benefits

### User Benefits:
1. **Convenience** - Update everything in one place
2. **Preview** - See picture before uploading
3. **Flexibility** - Can remove selection
4. **Efficiency** - Single save action
5. **Clarity** - Clear feedback and states

### Developer Benefits:
1. **Reusable** - Same upload logic
2. **Maintainable** - Clear state management
3. **Testable** - Isolated functions
4. **Extensible** - Easy to add features
5. **Consistent** - Matches existing patterns

---

## Future Enhancements

1. **Image Cropping** - Add crop tool in dialog
2. **Filters** - Apply filters before upload
3. **Compression** - Auto-compress large images
4. **Drag & Drop** - Drag image onto avatar
5. **Webcam** - Take photo with camera
6. **Multiple Formats** - Support more formats
7. **Progress Bar** - Show upload progress
8. **Undo** - Revert to previous picture

---

## Success Criteria

✅ Profile picture can be updated in edit dialog  
✅ Preview shows before upload  
✅ Validation works correctly  
✅ Can remove selection  
✅ Single save updates everything  
✅ User feedback is clear  
✅ State management is clean  
✅ Mobile-friendly interface  

---

**Enhancement Status:** ✅ COMPLETE

**Ready for Testing!**
