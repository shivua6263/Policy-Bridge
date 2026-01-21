# Quick Reference - User Authentication System

## What Was Changed

### Frontend Pages Updated
- ✅ `index.html` - Added user dropdown, removed login/signup buttons
- ✅ `account.html` - Updated navbar with user dropdown
- ✅ `policies.html` - Updated navbar with user dropdown
- ✅ `claims.html` - Updated navbar with user dropdown
- ✅ `agents.html` - Updated navbar with user dropdown
- ✅ `script.js` - Added authentication check
- ✅ Created `login.html` - New login/signup page
- ✅ Created `app.js` - AngularJS login controller

### Backend APIs Created
- ✅ POST `/api/customer/login/` - Customer login
- ✅ POST `/api/customer/signup/` - Customer signup
- ✅ POST `/api/agent/login/` - Agent login
- ✅ POST `/api/agent/signup/` - Agent signup

---

## User Experience Flow

### First Time User (Not Logged In)
1. Opens any page → Redirected to `login.html`
2. Selects Customer or Agent
3. Fills signup form → Account created
4. Automatically switches to login tab
5. Logs in with credentials
6. Redirected to `index.html`
7. Sees username in navbar dropdown

### Existing User (Already Logged In)
1. Opens any page → Directly loads page
2. Sees "User" button in navbar (if localStorage empty)
3. Actually sees their name in button
4. Can access: Profile, Policies, Claims, Logout

### Logging Out
1. Click on username in navbar
2. Click "Logout"
3. Confirm deletion
4. Redirected to `login.html`
5. All user data cleared from browser

---

## Key Features Implemented

✅ **Authentication Check**
- Every protected page checks if user is logged in
- Redirects to login if not authenticated

✅ **Session Management**
- User data stored in browser's localStorage
- Persists across page refreshes
- Can be cleared by logout

✅ **User Dropdown Menu**
- Shows user's first name
- Quick access to Profile, Policies, Claims
- One-click logout with confirmation

✅ **Login Page (AngularJS)**
- Toggle between Customer/Agent
- Toggle between Login/Signup modes
- Form validation with error messages
- Bootstrap responsive design

✅ **Password Security**
- Passwords hashed on backend (Django)
- Minimum 6 characters required
- Confirmation password in signup

---

## Testing Checklist

### Login Functionality
- [ ] Can login as customer
- [ ] Can login as agent
- [ ] Invalid credentials show error
- [ ] After login, redirected to home page
- [ ] User name appears in navbar

### Signup Functionality
- [ ] Can signup as customer
- [ ] Can signup as agent
- [ ] Duplicate email shows error
- [ ] Password mismatch shows error
- [ ] After signup, can login with new account

### Authentication Check
- [ ] Visiting pages directly without login → redirects to login
- [ ] After logout → cannot access protected pages
- [ ] Closing browser → session persists (localStorage)
- [ ] Clearing localStorage → redirected to login

### Logout Functionality
- [ ] Logout button is visible in dropdown
- [ ] Confirmation dialog appears
- [ ] After confirming → redirected to login
- [ ] All user data cleared
- [ ] Can login again

### User Dropdown Menu
- [ ] Dropdown opens correctly
- [ ] All menu items visible
- [ ] Links navigate to correct pages
- [ ] Logout link works

---

## API Response Examples

### Login Success (200 OK)
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone_number": "9876543210",
  "message": "Login successful"
}
```

### Login Failure (401 Unauthorized)
```json
{
  "message": "Invalid email or password"
}
```

### Signup Success (201 Created)
```json
{
  "message": "Customer registered successfully",
  "data": {
    "id": 2,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone_number": "9876543211"
  }
}
```

---

## File Locations

**Frontend Files:**
- `/home/labuser/Desktop/Policy/Frontend/Customer Frontend/login.html`
- `/home/labuser/Desktop/Policy/Frontend/Customer Frontend/app.js`
- `/home/labuser/Desktop/Policy/Frontend/Customer Frontend/auth-manager.js`
- `/home/labuser/Desktop/Policy/Frontend/Customer Frontend/index.html` (modified)
- `/home/labuser/Desktop/Policy/Frontend/Customer Frontend/account.html` (modified)
- `/home/labuser/Desktop/Policy/Frontend/Customer Frontend/policies.html` (modified)
- `/home/labuser/Desktop/Policy/Frontend/Customer Frontend/claims.html` (modified)
- `/home/labuser/Desktop/Policy/Frontend/Customer Frontend/agents.html` (modified)
- `/home/labuser/Desktop/Policy/Frontend/Customer Frontend/script.js` (modified)

**Backend Files:**
- `/home/labuser/Desktop/Policy/Backend/restapi/agent/models.py` (modified)
- `/home/labuser/Desktop/Policy/Backend/restapi/agent/serializers.py` (modified)
- `/home/labuser/Desktop/Policy/Backend/restapi/agent/views.py` (modified)
- `/home/labuser/Desktop/Policy/Backend/restapi/agent/urls.py` (modified)
- `/home/labuser/Desktop/Policy/Backend/restapi/customer/serializers.py` (modified)
- `/home/labuser/Desktop/Policy/Backend/restapi/customer/views.py` (modified)
- `/home/labuser/Desktop/Policy/Backend/restapi/customer/urls.py` (modified)

---

## Troubleshooting

**Issue:** Getting 404 errors on API calls
- **Fix:** Ensure backend server is running on `http://localhost:8000`
- **Fix:** Check API_BASE_URL in `app.js` matches your backend

**Issue:** Redirected to login even after login
- **Fix:** Check browser console for localStorage errors
- **Fix:** Verify user data is being saved (DevTools → Application → localStorage)

**Issue:** Logout not working
- **Fix:** Check browser console for JavaScript errors
- **Fix:** Ensure `auth-manager.js` is loaded before using it

**Issue:** "Cannot read property of undefined" errors
- **Fix:** Make sure AngularJS is loaded before `app.js`
- **Fix:** Verify all script tags are in correct order

---

## Configuration

### Update Backend URL
If your backend runs on a different port, update `app.js`:

```javascript
// Line 16 in app.js
const API_BASE_URL = 'http://your-backend-url:port/api';
```

### Update Frontend URL (if applicable)
If your frontend runs on a different port, ensure CORS is configured in Django settings.

---

## Support

For detailed information, see:
- `AUTHENTICATION_SETUP.md` - Complete implementation details
- `LOGIN_DOCUMENTATION.md` - Login page features and API details
- `INTEGRATION_GUIDE.md` - Integration with existing code
