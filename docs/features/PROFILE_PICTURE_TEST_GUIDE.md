# Profile Picture Upload - Testing Guide

**Date:** February 7, 2026  
**Status:** ✅ Ready for Testing  
**API Server:** Running on http://localhost:3001  
**Web App:** Running on http://localhost:3000

---

## ✅ Server Status

### API Server (Port 3001)
- **Status:** ✅ Running
- **Database:** ✅ Connected (PostgreSQL)
- **Profile Picture Endpoints:** ✅ Mapped
  - `POST /auth/profile-picture` - Upload new picture
  - `PUT /auth/profile-picture` - Update existing picture

### Web App (Port 3000)
- **Status:** ✅ Running
- **Profile Page:** Enhanced with upload functionality

---

## 🧪 Testing Checklist

### Method 1: Quick Upload (Avatar Camera Icon)

**Steps:**
1. ✅ Navigate to http://localhost:3000/profile
2. ✅ Login if not already logged in
3. ✅ Look for the camera icon on your avatar (top-left of profile card)
4. ✅ Click the camera icon
5. ✅ Select an image file (jpg, png, gif, webp)
6. ✅ Wait for upload (loading spinner on camera icon)
7. ✅ Check for success toast notification
8. ✅ Verify profile picture updates immediately

**Expected Results:**
- Camera icon shows loading spinner during upload
- Success toast: "Profile picture updated successfully"
- Avatar updates with new picture
- Picture persists on page refresh

---

### Method 2: Edit Profile Dialog (Comprehensive Edit)

**Steps:**
1. ✅ Navigate to http://localhost:3000/profile
2. ✅ Click "Edit Profile" button
3. ✅ Dialog opens showing current profile info
4. ✅ See large avatar preview (96px) at top
5. ✅ Click camera icon on avatar in dialog
6. ✅ Select an image file
7. ✅ See preview of selected image immediately
8. ✅ See file name displayed below avatar
9. ✅ (Optional) Update name or email
10. ✅ Click "Save Changes"
11. ✅ Wait for upload and update
12. ✅ Check for success toast
13. ✅ Verify dialog closes
14. ✅ Verify profile picture updates on main page

**Expected Results:**
- Preview shows selected image before upload
- File name displays: "New picture selected: filename.jpg"
- Can remove selection with "Remove" button
- Save button shows "Updating..." during process
- Success toast: "Profile updated successfully"
- Dialog closes automatically
- Profile page shows new picture

---

## 🔍 Validation Testing

### File Type Validation
**Test:** Select a non-image file (PDF, TXT, etc.)  
**Expected:** Error toast: "Please select an image file"  
**Result:** ⬜ Pass / ⬜ Fail

### File Size Validation
**Test:** Select an image larger than 5MB  
**Expected:** Error toast: "Image size should be less than 5MB"  
**Result:** ⬜ Pass / ⬜ Fail

### Supported Formats
**Test:** Upload each format:
- ⬜ JPG/JPEG
- ⬜ PNG
- ⬜ GIF
- ⬜ WEBP

**Expected:** All formats upload successfully

---

## 🎨 UI/UX Testing

### Visual Elements
- ⬜ Camera icon visible on avatar
- ⬜ Camera icon has hover effect
- ⬜ Loading spinner shows during upload
- ⬜ Avatar displays uploaded image correctly
- ⬜ Image fits properly in circular avatar
- ⬜ Preview in dialog shows correctly
- ⬜ File name displays in dialog
- ⬜ Remove button works in dialog

### Responsive Design
- ⬜ Works on desktop (1920x1080)
- ⬜ Works on tablet (768x1024)
- ⬜ Works on mobile (375x667)
- ⬜ Touch-friendly on mobile devices

### Loading States
- ⬜ Camera icon shows spinner during upload
- ⬜ Save button shows "Updating..." text
- ⬜ Save button disabled during upload
- ⬜ File input disabled during upload

---

## 🔐 Security Testing

### Authentication
**Test:** Try to upload without being logged in  
**Expected:** Redirected to login page  
**Result:** ⬜ Pass / ⬜ Fail

### Authorization
**Test:** Upload with valid JWT token  
**Expected:** Upload succeeds  
**Result:** ⬜ Pass / ⬜ Fail

**Test:** Upload with expired/invalid token  
**Expected:** Error message, redirect to login  
**Result:** ⬜ Pass / ⬜ Fail

---

## 📱 Mobile Testing

### iOS Safari
- ⬜ Camera icon clickable
- ⬜ File picker opens
- ⬜ Can select from Photos
- ⬜ Can take new photo
- ⬜ Upload works
- ⬜ Preview displays correctly

### Android Chrome
- ⬜ Camera icon clickable
- ⬜ File picker opens
- ⬜ Can select from Gallery
- ⬜ Can take new photo
- ⬜ Upload works
- ⬜ Preview displays correctly

---

## 🐛 Edge Cases

### Network Issues
**Test:** Disconnect internet during upload  
**Expected:** Error toast with appropriate message  
**Result:** ⬜ Pass / ⬜ Fail

### Multiple Rapid Uploads
**Test:** Click camera icon multiple times quickly  
**Expected:** Only one upload processes at a time  
**Result:** ⬜ Pass / ⬜ Fail

### Cancel During Upload
**Test:** Close dialog while uploading  
**Expected:** Upload continues or cancels gracefully  
**Result:** ⬜ Pass / ⬜ Fail

### Remove Selection
**Test:** Select image, then click Remove button  
**Expected:** Selection cleared, preview reverts to current picture  
**Result:** ⬜ Pass / ⬜ Fail

### Save Without Changes
**Test:** Open dialog, don't change anything, click Save  
**Expected:** Profile updates successfully (no errors)  
**Result:** ⬜ Pass / ⬜ Fail

---

## 🔄 Data Persistence

### Database Check
**Test:** Upload picture, refresh page  
**Expected:** Picture still displays  
**Result:** ⬜ Pass / ⬜ Fail

**Test:** Upload picture, logout, login again  
**Expected:** Picture still displays  
**Result:** ⬜ Pass / ⬜ Fail

### File System Check
**Test:** Upload picture, check `apps/api/uploads/profiles/` directory  
**Expected:** File exists with format `profile-{timestamp}-{random}.{ext}`  
**Result:** ⬜ Pass / ⬜ Fail

---

## 🎯 Quick Test Scenarios

### Scenario 1: First Time Upload
1. New user with no profile picture
2. Click camera icon
3. Select image
4. Verify upload and display

### Scenario 2: Update Existing Picture
1. User with existing profile picture
2. Click "Edit Profile"
3. Select new image
4. Verify preview shows new image
5. Save and verify update

### Scenario 3: Combined Update
1. Click "Edit Profile"
2. Select new profile picture
3. Update name
4. Update email
5. Save all changes at once
6. Verify all updates applied

### Scenario 4: Cancel After Selection
1. Click "Edit Profile"
2. Select new image
3. Click "Cancel"
4. Verify no changes applied
5. Verify old picture still shows

---

## 📊 API Testing (Optional)

### Using cURL or Postman

#### Upload Profile Picture
```bash
curl -X POST http://localhost:3001/auth/profile-picture \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "profilePicture=@/path/to/image.jpg"
```

**Expected Response:**
```json
{
  "message": "Profile picture uploaded successfully",
  "profilePicture": "/uploads/profiles/profile-1234567890-123456789.jpg",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "phone": "...",
    "role": "...",
    "profilePicture": "/uploads/profiles/profile-1234567890-123456789.jpg"
  }
}
```

---

## 🎓 Test User Accounts

Use these test accounts from the seeded database:

### Admin User
- **Phone:** +254712345678
- **OTP:** Any 6-digit code (development mode)
- **Role:** ADMIN

### Owner User
- **Phone:** +254723456789
- **OTP:** Any 6-digit code
- **Role:** OWNER

### Renter User
- **Phone:** +254734567890
- **OTP:** Any 6-digit code
- **Role:** RENTER

---

## ✅ Success Criteria

All items below should be checked:

### Core Functionality
- ⬜ Can upload profile picture via camera icon
- ⬜ Can upload profile picture via edit dialog
- ⬜ Picture displays correctly on profile page
- ⬜ Picture persists after page refresh
- ⬜ Picture persists after logout/login

### Validation
- ⬜ Rejects non-image files
- ⬜ Rejects files over 5MB
- ⬜ Accepts all supported formats (jpg, png, gif, webp)

### User Experience
- ⬜ Loading states show during upload
- ⬜ Success/error messages display
- ⬜ Preview works in edit dialog
- ⬜ Remove button works
- ⬜ Mobile-friendly interface

### Security
- ⬜ Requires authentication
- ⬜ JWT token validated
- ⬜ Files saved securely

---

## 🚀 Next Steps After Testing

### If All Tests Pass:
1. ✅ Feature is production-ready
2. Consider cloud storage migration (AWS S3, Cloudinary)
3. Add image optimization/resizing
4. Implement cleanup for old images
5. Add image cropping functionality

### If Issues Found:
1. Document the issue
2. Note steps to reproduce
3. Check browser console for errors
4. Check API server logs
5. Report findings for fixes

---

## 📝 Test Results Summary

**Date Tested:** _______________  
**Tested By:** _______________  
**Browser:** _______________  
**Device:** _______________

**Overall Result:** ⬜ Pass / ⬜ Fail

**Notes:**
_______________________________________
_______________________________________
_______________________________________

---

## 🔗 Related Documentation

- `PROFILE_PICTURE_FEATURE.md` - Feature implementation details
- `PROFILE_EDIT_ENHANCEMENT.md` - Edit dialog enhancement details
- `apps/api/src/auth/auth.controller.ts` - Backend endpoints
- `apps/web/src/app/profile/page.tsx` - Frontend implementation

---

**Happy Testing! 🎉**
