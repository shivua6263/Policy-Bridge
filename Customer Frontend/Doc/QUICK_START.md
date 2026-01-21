# Quick Start Guide - Login System Implementation

## 🎯 What Was Implemented

### ✅ Backend APIs
1. **Customer Endpoints**
   - `POST /api/customer/signup/` - Register new customer
   - `POST /api/customer/login/` - Customer login

2. **Agent Endpoints**
   - `POST /api/agent/signup/` - Register new agent
   - `POST /api/agent/login/` - Agent login

### ✅ Frontend Components
1. **login.html** - Unified login/signup page
   - Toggle between Customer and Agent modes
   - Toggle between Login and Signup modes
   - Bootstrap responsive design
   - Form validation with error messages
   - Success notifications

2. **app.js** - AngularJS application
   - Login controller
   - Form validation
   - API integration
   - Session management
   - Error handling

3. **auth-manager.js** - Authentication utilities
   - Session management
   - User info retrieval
   - Logout functionality
   - Page protection utilities

4. **Documentation**
   - LOGIN_DOCUMENTATION.md - Complete API and feature docs
   - INTEGRATION_GUIDE.md - Step-by-step integration guide

## 🚀 Getting Started

### 1. Start Backend Server
```bash
cd Backend/restapi
python manage.py runserver
```

### 2. Start Frontend Server
```bash
cd Frontend/Customer\ Frontend
python -m http.server 3000
# or use: python -m http.server 8080
```

### 3. Access Login Page
Open your browser: `http://localhost:3000/login.html`

## 📝 API Endpoints

### Customer Login
```
POST http://localhost:8000/api/customer/login/
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

### Customer Signup
```
POST http://localhost:8000/api/customer/signup/
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "phone_number": "9876543210",
    "password": "securepass123"
}
```

### Agent Login
```
POST http://localhost:8000/api/agent/login/
Content-Type: application/json

{
    "email": "agent@example.com",
    "password": "agentpass123"
}
```

### Agent Signup
```
POST http://localhost:8000/api/agent/signup/
Content-Type: application/json

{
    "name": "Agent Smith",
    "email": "agent@example.com",
    "phone_number": "9876543211",
    "password": "agentpass123"
}
```

## 🎨 Features

### Login Page Features
- ✅ Role-based login (Customer/Agent)
- ✅ Unified signup form
- ✅ Email validation
- ✅ Password confirmation
- ✅ Terms & conditions checkbox
- ✅ Real-time form validation
- ✅ Error messages
- ✅ Success notifications
- ✅ Loading states
- ✅ Bootstrap responsive design
- ✅ Password hashing
- ✅ Session persistence

### User Session
- Stored in `localStorage.currentUser`
- Persists across browser refresh
- Contains: id, name, email, phone_number, userType
- Auto redirect to home page after login

## 📁 File Structure

```
Frontend/Customer Frontend/
├── login.html                 # Main login page (NEW)
├── app.js                    # AngularJS app (NEW)
├── auth-manager.js           # Auth utilities (NEW)
├── LOGIN_DOCUMENTATION.md    # API docs (NEW)
├── INTEGRATION_GUIDE.md      # Integration steps (NEW)
├── index.html                # Home page (UPDATE NEEDED)
├── script.js                 # Existing JS
└── style.css                 # Existing styles

Backend/restapi/
├── agent/
│   ├── models.py             # Updated with password
│   ├── views.py              # Added Login/Signup APIs
│   ├── serializers.py        # Added serializers
│   └── urls.py               # Added endpoints
├── customer/
│   ├── models.py             # Has password
│   ├── views.py              # Added Login/Signup APIs
│   ├── serializers.py        # Added serializers
│   └── urls.py               # Added endpoints
├── user/
│   └── password_reset.py     # Fixed import error
└── restapi/
    └── settings.py           # CORS already configured
```

## 🔧 Configuration

### API Base URL
Edit in `Frontend/Customer Frontend/app.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

### CORS Settings
Already configured in `Backend/restapi/restapi/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8080",
    # Add more as needed
]
```

## 🧪 Testing

### Manual Testing Steps

1. **Test Customer Signup**
   - Go to `login.html`
   - Select "Customer" mode
   - Click "Sign Up"
   - Fill form with unique email and phone
   - Click "Sign Up" button
   - Should see success message

2. **Test Customer Login**
   - Switch to "Login" tab
   - Enter customer email and password
   - Click "Login"
   - Should redirect to `index.html`

3. **Test Agent Signup**
   - Select "Agent" mode
   - Click "Sign Up"
   - Fill form with unique email and phone
   - Click "Sign Up"
   - Should see success message

4. **Test Agent Login**
   - Switch to "Login" tab
   - Enter agent email and password
   - Click "Login"
   - Should redirect to `index.html`

5. **Test Session Persistence**
   - After login, open DevTools → Application → Local Storage
   - Should see `currentUser` with user data
   - Refresh page - should still be logged in
   - Clear localStorage and refresh - should be logged in
   - Close and reopen page - should still be logged in

### cURL Testing

```bash
# Test Customer Login
curl -X POST http://localhost:8000/api/customer/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "test123"}'

# Test Customer Signup
curl -X POST http://localhost:8000/api/customer/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone_number": "1234567890",
    "password": "test123"
  }'

# Test Agent Login
curl -X POST http://localhost:8000/api/agent/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "agent@example.com", "password": "agent123"}'

# Test Agent Signup
curl -X POST http://localhost:8000/api/agent/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Agent",
    "email": "agent@example.com",
    "phone_number": "9876543210",
    "password": "agent123"
  }'
```

## 🔐 Security Features

- ✅ Password hashing with Django's `make_password()`
- ✅ Password verification with `check_password()`
- ✅ Email field validation
- ✅ CORS enabled for secure cross-origin requests
- ✅ Client-side form validation
- ✅ Server-side validation
- ✅ Error message that doesn't reveal if email exists
- ✅ Terms & conditions requirement for signup

## 📋 Checklist for Integration

- [ ] Backend running on `http://localhost:8000`
- [ ] Frontend running on `http://localhost:3000` or similar
- [ ] Can access `login.html` without errors
- [ ] Can create customer account
- [ ] Can login with customer account
- [ ] Can create agent account
- [ ] Can login with agent account
- [ ] Session persists after page refresh
- [ ] Redirects to `index.html` after login
- [ ] User info displays in navbar (after index.html update)
- [ ] Logout functionality works (after index.html update)

## 📱 Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers
- ✅ IE11+ (with polyfills)

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS error | Check API_BASE_URL in app.js matches backend URL |
| Can't connect to server | Ensure backend is running with `python manage.py runserver` |
| Form validation not showing | Clear browser cache and refresh |
| Session not persisting | Check if localStorage is enabled in browser |
| Login keeps failing | Verify email exists and password is correct |
| Redirect not working | Check if index.html exists in same directory |

## 📞 Support Resources

- Backend logs: `python manage.py runserver --verbosity 2`
- Frontend console: F12 → Console tab
- Network tab: F12 → Network tab (check API requests)
- Django admin: `http://localhost:8000/admin`
  - Username: admin (if created)
  - Access user data directly

## 🎓 Next Steps

1. **Update index.html**
   - Add auth-manager.js script
   - Update navbar with user info
   - Add logout functionality

2. **Implement Protected Routes**
   - Check if user is logged in
   - Redirect to login if not authenticated
   - Show user-specific content

3. **Add Profile Management**
   - Create `/api/customer/<id>/profile/` endpoint
   - Create `/api/agent/<id>/profile/` endpoint
   - Display/edit user profile

4. **Implement Password Reset**
   - Email-based reset (recommended for customers)
   - Phone-based reset (for agents)

5. **Add JWT Tokens** (future)
   - Replace localStorage with token-based auth
   - Implement token refresh
   - Add Authorization header to API calls

## 📚 Documentation Files

- **LOGIN_DOCUMENTATION.md** - Complete API reference
- **INTEGRATION_GUIDE.md** - Step-by-step integration
- **QUICK_START.md** - This file!

---

**Created**: January 2026
**Version**: 1.0
**Status**: Ready for Integration ✅
