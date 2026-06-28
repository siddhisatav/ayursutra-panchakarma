# Therapist Profile System - Testing Guide

## Quick Start

### 1. Backend Startup
```bash
cd backend
python app.py
```
- Flask server should start on `https://ayursutra-panchakarma-f8cg.onrender.com`
- SQLite database will be automatically created/updated with new columns
- Existing data is preserved

### 2. Frontend Startup
```bash
npm run dev
```
- React app should start on `http://localhost:5173` (or similar)

## Testing Steps

### Step 1: Login as Therapist
1. Go to login page
2. Enter credentials:
   - **Email**: `therapist@ayur.com`
   - **Password**: `therapist123`
3. Click Login
4. You should see the dashboard

### Step 2: Navigate to Therapist Profile
1. From therapist dashboard, click on "Profile" or "Therapist Profile"
2. You should see the profile page with:
   - Avatar circle with therapist's first initial
   - Professional details section
   - "Edit Profile" button

### Step 3: Test View Mode
Verify the following fields display correctly (with "Not listed" if empty):
- [ ] Email Address (should show: therapist@ayur.com)
- [ ] Experience
- [ ] Specialization
- [ ] Shift Timing
- [ ] Qualification
- [ ] Bio/About

### Step 4: Test Edit Mode
1. Click "Edit Profile" button
2. Form fields should appear for:
   - [ ] Full Name (text input)
   - [ ] Experience (text input)
   - [ ] Specialization (text input)
   - [ ] Shift Timing (text input)
   - [ ] Qualification (text input)
   - [ ] Bio/About (textarea)
3. You should see:
   - [ ] "Save Changes" button
   - [ ] "Cancel" button
   - [ ] Avatar updates with first initial

### Step 5: Test Form Editing
1. Edit each field with test data:
   ```
   Name: Dr. Priya Sharma
   Experience: 8 years in Ayurvedic Therapy
   Specialization: Panchakarma & Detoxification
   Shift Timing: 09:00 AM - 05:00 PM
   Qualification: B.A.M.S., Certified Panchakarma Specialist
   Bio: Experienced Ayurvedic therapist specializing in detoxification and rejuvenation therapies...
   ```
2. Verify:
   - [ ] Fields update as you type
   - [ ] Avatar updates with name change
   - [ ] Specialization shows in subtitle

### Step 6: Test Save Functionality
1. Click "Save Changes" button
2. Verify:
   - [ ] Button shows "Saving..." state with loader
   - [ ] Success message appears: "Profile Updated Successfully"
   - [ ] Component returns to view mode
   - [ ] All edited data is displayed in view mode

### Step 7: Test Data Persistence
1. Refresh the page (F5)
2. Navigate back to Therapist Profile
3. Verify:
   - [ ] All changes are still there (synced from backend)
   - [ ] Data loaded from database correctly

### Step 8: Test Cancel Functionality
1. Click "Edit Profile" button
2. Change some fields
3. Click "Cancel" button
4. Verify:
   - [ ] Changes are discarded
   - [ ] Returns to view mode
   - [ ] Original data is displayed

### Step 9: Test Empty Fields
1. Clear all optional fields
2. Click "Save Changes"
3. Refresh page
4. Verify:
   - [ ] Fields show "Not listed" in view mode
   - [ ] Empty fields can still be edited

### Step 10: Test Dark Mode (if available)
1. Toggle dark mode in settings
2. Verify:
   - [ ] Form inputs have proper dark styling
   - [ ] Text is readable
   - [ ] Buttons show correctly

## API Testing (Optional - using Postman or curl)

### Get Therapist Profile
```bash
curl https://ayursutra-panchakarma-f8cg.onrender.com/api/therapist/profile/?id=2
```
Expected response:
```json
{
  "id": 2,
  "email": "therapist@ayur.com",
  "role": "therapist",
  "name": "Dr. Priya Sharma",
  "experience": "8 years...",
  "specialization": "Panchakarma...",
  "shiftTiming": "09:00 AM - 05:00 PM",
  "qualification": "B.A.M.S...",
  "bio": "Experienced Ayurvedic therapist..."
}
```

### Update Therapist Profile
```bash
curl -X PUT https://ayursutra-panchakarma-f8cg.onrender.com/api/therapist/profile/ \
  -H "Content-Type: application/json" \
  -d '{
    "id": 2,
    "name": "Dr. Priya Sharma",
    "experience": "10 years",
    "specialization": "Panchakarma",
    "shiftTiming": "10:00 - 18:00",
    "qualification": "B.A.M.S.",
    "bio": "Expert therapist"
  }'
```

## Troubleshooting

### Issue: "Profile Updated Successfully" but changes don't persist
- **Solution**: Ensure Flask backend is running on port 5000
- Check browser console for API errors
- Verify database file exists: `backend/ayursutra.db`

### Issue: Form fields are empty on load
- **Solution**: Make sure therapist is logged in
- Check localStorage in browser DevTools > Application
- Verify user ID matches therapist ID (2 for test data)

### Issue: API returns 403 error
- **Solution**: User must have role=therapist
- Check database for user role
- Re-login if needed

### Issue: API returns 404 error
- **Solution**: Check therapist ID is correct
- Test with ID=2 (the seeded therapist)

### Issue: Database migration errors
- **Solution**: SQLAlchemy automatically handles schema changes
- If issues persist, try removing `backend/ayursutra.db` and restarting
- New database will be created with all columns

## Success Criteria

All of the following should work:
- ✅ View therapist profile with all fields displayed
- ✅ Edit profile with real-time form updates
- ✅ Save changes successfully
- ✅ See success message after save
- ✅ Data persists after refresh
- ✅ Cancel reverts unsaved changes
- ✅ Proper error handling on failures
- ✅ Responsive design on mobile and desktop
- ✅ Dark mode support (if enabled)

## Notes

- Test user ID for therapist: 2
- The profile uses localStorage for caching and backend database for persistence
- All changes are synced between localStorage and backend
- The component handles network errors gracefully
- Form validation is handled by the API (could be enhanced on frontend)
