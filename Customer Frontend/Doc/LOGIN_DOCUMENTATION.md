# Login & Authentication System Documentation

## Overview
This document provides a comprehensive guide for the new unified login and signup system for Policy Bridge, supporting both Customer and Agent user types.

## Features Implemented

### 1. **Backend APIs**

#### Agent Endpoints
- **Signup**: `POST /api/agent/signup/`
- **Login**: `POST /api/agent/login/`

#### Customer Endpoints
- **Signup**: `POST /api/customer/signup/`
- **Login**: `POST /api/customer/login/`

### 2. **Frontend - AngularJS Based Login Page**
- Location: `/Frontend/Customer Frontend/login.html`
- Unified login page with toggle between Customer and Agent
- Responsive design using Bootstrap 5
- Form validation with error messages
- Success notifications

### 3. **Key Features**
✅ Role-based login (Customer/Agent)
✅ User signup with password hashing
✅ Email validation
✅ Password confirmation
✅ Terms & conditions acceptance
✅ Session management via localStorage
✅ Automatic redirect to home page after login
✅ Bootstrap responsive design
✅ AngularJS form validation
✅ CORS enabled for cross-origin requests
✅ No Telegram OTP in Customer frontend (as requested)

## API Documentation

### 1. Customer Signup
**Endpoint**: `POST http://localhost:8000/api/customer/signup/`

**Request Body**:
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "phone_number": "9876543210",
    "password": "securepassword123"
}
```

**Response (201 Created)**:
```json
{
    "message": "Customer registered successfully",
    "data": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone_number": "9876543210"
    }
}
```

### 2. Customer Login
**Endpoint**: `POST http://localhost:8000/api/customer/login/`

**Request Body**:
```json
{
    "email": "john@example.com",
    "password": "securepassword123"
}
```

**Response (200 OK)**:
```json
{
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone_number": "9876543210",
    "message": "Login successful"
}
```

### 3. Agent Signup
**Endpoint**: `POST http://localhost:8000/api/agent/signup/`

**Request Body**:
```json
{
    "name": "Agent Smith",
    "email": "agent@example.com",
    "phone_number": "9876543211",
    "password": "agentpass123"
}
```

**Response (201 Created)**:
```json
{
    "message": "Agent registered successfully",
    "data": {
        "name": "Agent Smith",
        "email": "agent@example.com",
        "phone_number": "9876543211"
    }
}
```

### 4. Agent Login
**Endpoint**: `POST http://localhost:8000/api/agent/login/`

**Request Body**:
```json
{
    "email": "agent@example.com",
    "password": "agentpass123"
}
```

**Response (200 OK)**:
```json
{
    "id": 1,
    "name": "Agent Smith",
    "email": "agent@example.com",
    "phone_number": "9876543211",
    "referral_code": "REF_CODE",
    "message": "Login successful"
}
```

## Error Handling

### Common Error Responses

**400 Bad Request** - Invalid input:
```json
{
    "email": ["This field is required."],
    "password": ["This field is required."]
}
```

**401 Unauthorized** - Invalid credentials:
```json
{
    "message": "Invalid email or password"
}
```

**409 Conflict** - Email already exists:
```json
{
    "email": ["Email address already in use."]
}
```

## Frontend Usage

### 1. Opening Login Page
Navigate to: `http://localhost:3000/login.html` (or your frontend URL)

### 2. Features on Login Page

**User Type Toggle**:
- Switch between "Customer" and "Agent" using the top toggle buttons

**Mode Toggle**:
- Switch between "Login" and "Sign Up" modes

**Login Form** (in Login mode):
- Email address (required, must be valid email)
- Password (required)

**Signup Form** (in Sign Up mode):
- Full Name (required)
- Email Address (required, valid email)
- Phone Number (required)
- Password (required, min 6 characters)
- Confirm Password (required, must match password)
- Terms & Conditions (checkbox, required)

### 3. Form Validation
- Real-time validation with error messages
- Prevents form submission with invalid data
- Displays field-specific error messages

### 4. Post-Login Behavior
- User data is stored in `localStorage` as `currentUser`
- Automatically redirects to `index.html`
- Session persists across page refreshes

### 5. Logout (Implementation in your app)
```javascript
// Clear stored user data
localStorage.removeItem('currentUser');
// Redirect to login page
window.location.href = 'login.html';
```

## Database Models

### Agent Model
```python
class Agent(models.Model):
    name = CharField(max_length=255)
    email = EmailField(unique=True)
    password = CharField(max_length=255)
    phone_number = CharField(max_length=15, unique=True)
    referral_code = CharField(max_length=255, unique=True)
    commission_percentage = DecimalField(max_digits=5, decimal_places=2)
    created_at = DateTimeField(auto_now_add=True)
```

### Customer Model
```python
class Customer(models.Model):
    name = CharField(max_length=255)
    email = EmailField(unique=True)
    password = CharField(max_length=255)
    phone_number = CharField(max_length=15, unique=True)
    created_at = DateTimeField(auto_now_add=True)
```

## Security Features

✅ **Password Hashing**: Uses Django's `make_password()` and `check_password()`
✅ **CORS Enabled**: Configured in `settings.py`
✅ **Email Validation**: Built-in Django email field validation
✅ **Session Management**: localStorage-based session storage
✅ **Password Confirmation**: Frontend validation for matching passwords

## Configuration

### Backend Settings
Edit `/Backend/restapi/restapi/settings.py`:
```python
# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # Add your frontend URLs here
]
```

### Frontend Configuration
Edit `/Frontend/Customer Frontend/app.js`:
```javascript
// API Base URL
const API_BASE_URL = 'http://localhost:8000/api';
```

## Running the Application

### Backend
```bash
cd Backend/restapi
python manage.py runserver
```

### Frontend
```bash
cd Frontend/Customer\ Frontend
python -m http.server 3000
# or use any other local server
```

## File Structure

```
Frontend/Customer Frontend/
├── login.html          # Main login/signup page with AngularJS
├── app.js             # AngularJS controller and business logic
├── index.html         # Home page (redirected after login)
├── script.js          # Additional frontend scripts
└── style.css          # Styling

Backend/restapi/
├── agent/
│   ├── models.py      # Agent model with password field
│   ├── views.py       # AgentSignupAPI, AgentLoginAPI
│   ├── serializers.py # AgentSignupSerializer, AgentLoginSerializer
│   └── urls.py        # Agent endpoints
├── customer/
│   ├── models.py      # Customer model with password field
│   ├── views.py       # CustomerSignupAPI, CustomerLoginAPI
│   ├── serializers.py # CustomerSignupSerializer, CustomerLoginSerializer
│   └── urls.py        # Customer endpoints
└── restapi/
    └── settings.py    # CORS and app configuration
```

## Troubleshooting

### Issue: CORS errors in console
**Solution**: Ensure backend CORS_ALLOWED_ORIGINS includes your frontend URL

### Issue: "Unable to connect to server"
**Solution**: Verify backend is running on http://localhost:8000

### Issue: "Invalid email or password" after signup
**Solution**: Check that you used the same credentials during login

### Issue: Not redirected to home after login
**Solution**: Ensure `index.html` exists in the same directory as `login.html`

## Next Steps

1. **Update Home Page Navigation**:
   - Add logout button with current user display
   - Check `localStorage.currentUser` on page load
   - Display user-specific content based on user type (customer/agent)

2. **Add Profile Management**:
   - Create endpoints for user profile updates
   - Implement profile page

3. **Add Password Reset**:
   - Implement forgot password functionality (without Telegram OTP for customers)
   - Use email-based password reset

4. **Implement Session Management**:
   - Add session timeout
   - Refresh token mechanism
   - Activity tracking

## Support

For API-related issues, check the backend logs:
```bash
cd Backend/restapi
python manage.py runserver --verbosity 2
```

For frontend issues, check browser console for JavaScript errors and network tab for API calls.
