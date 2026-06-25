# Therapist Profile System - Code Reference

## Backend Implementation

### 1. Updated User Model (`backend/app.py`)

```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    # NEW FIELDS FOR THERAPIST PROFILE
    experience = db.Column(db.String(120), nullable=True)
    specialization = db.Column(db.String(120), nullable=True)
    shiftTiming = db.Column(db.String(120), nullable=True)
    qualification = db.Column(db.String(120), nullable=True)
    bio = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id, 
            "email": self.email, 
            "role": self.role, 
            "name": self.name,
            "experience": self.experience,
            "specialization": self.specialization,
            "shiftTiming": self.shiftTiming,
            "qualification": self.qualification,
            "bio": self.bio
        }
```

### 2. GET Therapist Profile Route

```python
@app.route('/api/therapist/profile/', methods=['GET'])
def get_therapist_profile():
    """Get therapist profile details"""
    try:
        # Get the therapist ID from query parameter
        therapist_id = request.args.get('id')
        
        if not therapist_id:
            return jsonify({"error": "Therapist ID is required"}), 400
        
        user = User.query.get(int(therapist_id))
        if not user:
            return jsonify({"error": "Therapist not found"}), 404
        
        # Validate user is a therapist
        if user.role != 'therapist':
            return jsonify({"error": "User is not a therapist"}), 403
        
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
```

**Usage:**
```
GET /api/therapist/profile/?id=2
Response: 200 OK
{
  "id": 2,
  "email": "therapist@ayur.com",
  "role": "therapist",
  "name": "Dr. Priya Sharma",
  "experience": "8 years",
  "specialization": "Panchakarma",
  "shiftTiming": "09:00 - 17:00",
  "qualification": "B.A.M.S.",
  "bio": "Expert therapist..."
}
```

### 3. PUT Therapist Profile Route

```python
@app.route('/api/therapist/profile/', methods=['PUT'])
def update_therapist_profile():
    """Update therapist profile details"""
    try:
        data = request.json
        therapist_id = data.get('id')
        
        if not therapist_id:
            return jsonify({"error": "Therapist ID is required"}), 400
        
        user = User.query.get(int(therapist_id))
        if not user:
            return jsonify({"error": "Therapist not found"}), 404
        
        # Validate user is a therapist
        if user.role != 'therapist':
            return jsonify({"error": "User is not a therapist"}), 403
        
        # Update allowed fields
        if 'name' in data:
            user.name = data.get('name')
        if 'experience' in data:
            user.experience = data.get('experience')
        if 'specialization' in data:
            user.specialization = data.get('specialization')
        if 'shiftTiming' in data:
            user.shiftTiming = data.get('shiftTiming')
        if 'qualification' in data:
            user.qualification = data.get('qualification')
        if 'bio' in data:
            user.bio = data.get('bio')
        
        # Save to database
        db.session.commit()
        return jsonify(user.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
```

**Usage:**
```
PUT /api/therapist/profile/
Content-Type: application/json

{
  "id": 2,
  "name": "Dr. Priya Sharma",
  "experience": "10 years in Ayurvedic therapy",
  "specialization": "Panchakarma & Rejuvenation",
  "shiftTiming": "10:00 AM - 06:00 PM",
  "qualification": "B.A.M.S., Certified Specialist",
  "bio": "An experienced Ayurvedic therapist..."
}

Response: 200 OK
(Same JSON with updated values)
```

---

## Frontend Implementation

### 1. React Component Structure

```javascript
const TherapistProfile = () => {
  // STATE MANAGEMENT
  const [profile, setProfile] = useState(null);           // Current saved data
  const [loading, setLoading] = useState(true);           // Initial load state
  const [isEditing, setIsEditing] = useState(false);      // View/Edit toggle
  const [isSaving, setIsSaving] = useState(false);        // Save operation state
  const [formData, setFormData] = useState({});           // Form working data
  const { showToast } = useToast();                       // Toast notifications
  
  // Load profile on component mount
  useEffect(() => { ... }, [showToast]);
  
  // Handle form field changes
  const handleInputChange = (e) => { ... }
  
  // Save profile to backend
  const handleSaveProfile = async () => { ... }
  
  // Cancel editing and revert changes
  const handleCancel = () => { ... }
  
  // Render appropriate UI based on state
  return ( ... )
}
```

### 2. Profile Loading

```javascript
useEffect(() => {
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const user = getUser();
      if (user) {
        setProfile(user);
        setFormData(user);
      }
    } catch (err) {
      showToast("Failed to load profile", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchProfile();
}, [showToast]);
```

### 3. Form Handling

```javascript
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};
```

### 4. Save Profile Function

```javascript
const handleSaveProfile = async () => {
  try {
    setIsSaving(true);
    
    // Prepare data for backend
    const updateData = {
      id: profile.id,
      name: formData.name,
      experience: formData.experience,
      specialization: formData.specialization,
      shiftTiming: formData.shiftTiming,
      qualification: formData.qualification,
      bio: formData.bio
    };

    // Call backend API
    const response = await fetch('http://localhost:5000/api/therapist/profile/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    // Update local state with backend response
    const updatedData = await response.json();
    setProfile(updatedData);
    setFormData(updatedData);
    saveUser(updatedData);  // Update localStorage
    setIsEditing(false);
    showToast("Profile Updated Successfully", "success");
  } catch (err) {
    showToast("Failed to save profile", "error");
    console.error(err);
  } finally {
    setIsSaving(false);
  }
};
```

### 5. View Mode UI

```jsx
{!isEditing ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
        <Mail size={12} /> Email Address
      </label>
      <p className="text-gray-700 dark:text-gray-200 font-medium">
        {profile?.email}
      </p>
    </div>

    <div className="space-y-1">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
        <Award size={12} /> Experience
      </label>
      <p className="text-gray-700 dark:text-gray-200 font-medium">
        {profile?.experience || "Not listed"}
      </p>
    </div>

    {/* Similar for Specialization, Shift Timing, Qualification, Bio */}
  </div>
) : (
  // Edit mode...
)}
```

### 6. Edit Mode UI - Form Fields

```jsx
{isEditing ? (
  <div className="space-y-5">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-ayur-primary"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
          Experience
        </label>
        <input
          type="text"
          name="experience"
          value={formData.experience || ''}
          onChange={handleInputChange}
          placeholder="e.g., 5 years"
        />
      </div>

      {/* Similar for other fields */}
    </div>

    {/* Bio - Textarea */}
    <div>
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
        About / Bio
      </label>
      <textarea
        name="bio"
        value={formData.bio || ''}
        onChange={handleInputChange}
        placeholder="Tell us about yourself..."
        rows="4"
      />
    </div>

    {/* Action Buttons */}
    <div className="flex gap-3 pt-4">
      <button onClick={handleSaveProfile} disabled={isSaving}>
        <Save size={16} />
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
      <button onClick={handleCancel} disabled={isSaving}>
        <X size={16} />
        Cancel
      </button>
    </div>
  </div>
) : null}
```

---

## Data Flow Diagram

```
User Login
    ↓
getUser() from localStorage
    ↓
TherapistProfile Component Mounts
    ↓
Load profile from localStorage
    ↓
Display in View Mode
    ↓
User clicks "Edit Profile"
    ↓
Switch to Edit Mode
    ↓
User fills form fields
    ↓
User clicks "Save Changes"
    ↓
PUT /api/therapist/profile/ → Backend
    ↓
Backend validates & updates database
    ↓
Response with updated data
    ↓
Update state (profile & formData)
    ↓
Save to localStorage with saveUser()
    ↓
Show success toast
    ↓
Switch to View Mode
    ↓
Display updated profile
```

## State Transitions

```
LOADING
    ↓
[Profile loads] →→ VIEW MODE
                        ↓
                   [Click Edit] → EDITING
                        ↑            ↓
                   [Click Cancel] [Click Save]
                        ↑            ↓
                   [Discard changes] ↓
                        ↑ [Save to DB]
                        ↓
                   VIEW MODE (updated)
```

## Component Props & Dependencies

```javascript
// Imports required:
import { useState, useEffect } from 'react';
import Card from '../shared/Card';
import { getUser, saveUser } from '../../utils/storage';
import { User, Mail, Award, BookOpen, Calendar, Clock, Loader2, Edit2, Save, X } from 'lucide-react';
import { useToast } from '../shared/ToastProvider';

// Icons used:
- User           - Profile icon
- Mail           - Email icon
- Award          - Experience/Qualification icon
- BookOpen       - Specialization/Bio icon
- Calendar       - Date icon
- Clock          - Timing icon
- Loader2        - Loading spinner
- Edit2          - Edit button icon
- Save           - Save button icon
- X              - Cancel button icon

// Storage functions:
getUser()        - Get current user from localStorage
saveUser(user)   - Save user to localStorage

// Toast:
showToast(message, type)  - Show notification messages
```

## Responsive Breakpoints

```css
Mobile (< 768px):
- 1 column layout
- Full width forms
- Stacked buttons

Tablet/Desktop (≥ 768px):
- 3 column grid (1-col avatar, 2-col details)
- 2-column form fields
- Side-by-side buttons
```

## Error Handling

```javascript
// API Errors
try {
  const response = await fetch(...)
  if (!response.ok) {
    throw new Error('Failed to update profile')
  }
} catch (err) {
  showToast("Failed to save profile", "error")
  console.error(err)
}

// Database Errors (Backend)
except Exception as e:
    db.session.rollback()
    return jsonify({"error": str(e)}), 500
```

## Class Names Reference

```css
/* Component Container */
max-w-4xl mx-auto space-y-6

/* Header */
text-3xl font-serif font-bold text-ayur-dark

/* Card Styles */
border-none shadow-xl p-8
bg-gradient-to-b from-ayur-primary/5 to-white

/* Avatar */
w-24 h-24 rounded-full bg-ayur-primary text-white
flex items-center justify-center text-3xl font-bold

/* Form Input */
w-full px-3 py-2 border border-gray-300
dark:border-gray-600 rounded-lg
dark:bg-gray-700 dark:text-white
focus:outline-none focus:ring-2 focus:ring-ayur-primary

/* Buttons */
px-4 py-2 bg-ayur-primary text-white rounded-lg
hover:bg-ayur-primary/90 transition-colors
disabled:opacity-50 shadow-md
```

---

## Testing the Implementation

### Minimal Test Suite

```javascript
// Test 1: Component Renders
render(<TherapistProfile />);
expect(screen.getByText('Therapist Profile')).toBeInTheDocument();

// Test 2: Edit Mode Toggle
const editButton = screen.getByText('Edit Profile');
fireEvent.click(editButton);
expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();

// Test 3: Form Update
const nameInput = screen.getByDisplayValue('Dr. Priya Sharma');
fireEvent.change(nameInput, { target: { value: 'New Name' } });
expect(nameInput.value).toBe('New Name');

// Test 4: Save Profile
fireEvent.click(screen.getByText('Save Changes'));
await waitFor(() => {
  expect(screen.getByText('Profile Updated Successfully')).toBeInTheDocument();
});
```

---

## Future Enhancement Ideas

1. **Profile Picture Upload**
   - Add image upload field
   - Store in backend
   - Display in avatar

2. **Certifications**
   - List multiple certifications
   - Add/remove functionality
   - Document upload

3. **Availability**
   - Visual calendar
   - Set working hours
   - Days off

4. **Ratings & Reviews**
   - Display therapist ratings
   - Show patient reviews
   - Average rating badge

5. **Form Validation**
   - Required field validation
   - Email validation
   - Phone number format
   - Character limits

6. **Password Management**
   - Change password form
   - Current password verification
   - Password strength indicator

7. **Two-Factor Authentication**
   - Enable/disable 2FA
   - Setup authenticator
   - Backup codes
