# Integration Guide for Login System

## Step-by-Step Integration

### 1. Update Navbar in index.html

Add this code to your navbar (usually near the login button area):

```html
<!-- Replace existing login button with this -->
<div id="navbar-auth">
    <!-- This will be populated by auth-manager.js -->
</div>

<!-- User info display (add to navbar right side) -->
<div class="d-flex align-items-center gap-3" id="user-navbar">
    <span id="user-info" style="display:none;">
        <i class="fas fa-user-circle"></i>
        <span id="user-name"></span>
        <small class="badge" id="user-type"></small>
    </span>
</div>
```

### 2. Add Scripts to index.html

Add these script tags before closing `</body>` tag:

```html
<!-- Authentication Manager -->
<script src="auth-manager.js"></script>

<!-- Initialize Auth -->
<script>
    // Check if user is logged in on page load
    if (!authManager.isLoggedIn()) {
        // Optionally redirect to login or show message
        console.log('User not logged in');
    } else {
        console.log('Welcome back, ' + authManager.getUserName());
    }
</script>
```

### 3. Create Login Button Handler

Add this to your existing script.js or create a new section:

```javascript
// Handle login button click
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.querySelector('[data-action="login"]');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            // Check if already logged in
            if (authManager.isLoggedIn()) {
                // Show user menu or logout option
                showUserMenu();
            } else {
                // Redirect to login page
                window.location.href = 'login.html';
            }
        });
    }
});

function showUserMenu() {
    const user = authManager.showUserProfile();
    alert(`Welcome ${user.name}! You are logged in as a ${user.type}.`);
    // Or show a dropdown menu with profile/logout options
}
```

### 4. Update index.html Head

Add auth-manager.js reference:

```html
<head>
    <!-- ... existing head content ... -->
    <script src="auth-manager.js" defer></script>
</head>
```

### 5. Protect Protected Pages

For pages that require authentication, add this at the top of the script:

```javascript
// Require authentication before showing page
document.addEventListener('DOMContentLoaded', function() {
    authManager.requireAuth(); // Redirects to login if not authenticated
    
    // Show user-specific content
    if (authManager.isLoggedIn()) {
        const user = authManager.getCurrentUser();
        console.log('Page loaded for:', user.name);
    }
});
```

### 6. Update Navigation Links

Add login link to navbar:

```html
<ul class="navbar-nav ms-auto">
    <!-- ... other nav items ... -->
    <li class="nav-item">
        <a class="nav-link" href="login.html" id="auth-nav-link">
            <i class="fas fa-sign-in-alt"></i>
            <span id="auth-nav-text">Login</span>
        </a>
    </li>
</ul>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        if (authManager.isLoggedIn()) {
            const link = document.getElementById('auth-nav-link');
            const text = document.getElementById('auth-nav-text');
            
            link.href = '#';
            link.setAttribute('onclick', 'authManager.logout(); return false;');
            text.textContent = `Logout (${authManager.getUserName()})`;
        }
    });
</script>
```

## Complete Navbar Example

Here's a complete example of an updated navbar:

```html
<nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
    <div class="container">
        <!-- Logo -->
        <a class="navbar-brand" href="index.html">
            <i class="fas fa-shield-alt"></i>
            <span class="brand-text ms-2">Policy Bridge</span>
        </a>

        <!-- Navbar Toggle -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
                data-bs-target="#navbarContent" aria-controls="navbarContent" 
                aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar Content -->
        <div class="collapse navbar-collapse" id="navbarContent">
            <!-- Left Links -->
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link" href="index.html">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="policies.html">Policies</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="agents.html">Agents</a>
                </li>
            </ul>

            <!-- Right Links (Auth) -->
            <ul class="navbar-nav ms-auto align-items-center gap-2">
                <!-- User Info (when logged in) -->
                <li class="nav-item" id="user-info-navbar" style="display:none;">
                    <span class="navbar-text">
                        <i class="fas fa-user-circle text-primary"></i>
                        <span id="nav-user-name"></span>
                        <small class="badge bg-primary" id="nav-user-type"></small>
                    </span>
                </li>

                <!-- Auth Button -->
                <li class="nav-item">
                    <a class="nav-link btn btn-sm" id="auth-btn" href="login.html">
                        <i class="fas fa-sign-in-alt"></i>
                        <span id="auth-btn-text">Login / Signup</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const authBtn = document.getElementById('auth-btn');
    const authBtnText = document.getElementById('auth-btn-text');
    const userInfoNavbar = document.getElementById('user-info-navbar');
    const navUserName = document.getElementById('nav-user-name');
    const navUserType = document.getElementById('nav-user-type');

    if (authManager.isLoggedIn()) {
        // Hide login button, show user info
        authBtn.style.display = 'none';
        userInfoNavbar.style.display = 'block';

        // Populate user info
        const user = authManager.showUserProfile();
        navUserName.textContent = user.name;
        navUserType.textContent = user.type.toUpperCase();

        // Add logout option via long press or right-click
        userInfoNavbar.addEventListener('click', function() {
            if (confirm(`Logout ${user.name}?`)) {
                authManager.logout();
            }
        });
    } else {
        // Show login button
        authBtn.href = 'login.html';
        authBtnText.textContent = 'Login / Signup';
    }
});
</script>
```

## Features Available Through auth-manager.js

### Check Authentication
```javascript
if (authManager.isLoggedIn()) {
    // User is logged in
}
```

### Get User Info
```javascript
const user = authManager.getCurrentUser();
const name = authManager.getUserName();
const email = authManager.getUserEmail();
const type = authManager.getUserType(); // 'customer' or 'agent'
```

### Check User Type
```javascript
if (authManager.isCustomer()) {
    // Show customer-specific features
}

if (authManager.isAgent()) {
    // Show agent-specific features
}
```

### Logout
```javascript
authManager.logout(); // Clears session and redirects to login
```

### Require Authentication
```javascript
authManager.requireAuth(); // Redirects to login if not authenticated
```

## API Calls With Authentication

Here's how to make API calls with user context:

```javascript
function fetchUserPolicies() {
    const user = authManager.getCurrentUser();
    
    if (!user) {
        console.error('User not logged in');
        return;
    }

    const endpoint = authManager.isCustomer() 
        ? `/api/customer/${user.id}/policies/`
        : `/api/agent/${user.id}/policies/`;

    fetch(endpoint, {
        headers: {
            'Authorization': `Bearer ${user.token}`, // if you implement token auth later
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => console.log('Policies:', data))
    .catch(error => console.error('Error:', error));
}
```

## Styling Classes

Add these CSS classes for styling auth elements:

```css
/* User info in navbar */
#user-info-navbar {
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 5px;
    transition: background 0.3s;
}

#user-info-navbar:hover {
    background: rgba(102, 126, 234, 0.1);
}

/* Auth button styling */
#auth-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white !important;
    border-radius: 25px;
    padding: 8px 20px !important;
    transition: transform 0.2s;
}

#auth-btn:hover:not([href="login.html"]) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}
```

## Testing the Integration

1. **Open login.html** and create a test account
2. **Login** with the credentials
3. **Check localStorage** in browser DevTools:
   ```javascript
   JSON.parse(localStorage.getItem('currentUser'))
   ```
4. **Navigate to index.html** - should show user info
5. **Refresh page** - user info should persist
6. **Click logout** - should redirect to login.html

## Troubleshooting

### User data not showing in navbar
- Check if `auth-manager.js` is loaded
- Open console and type `authManager.isLoggedIn()`
- Verify localStorage has `currentUser` key

### Login redirects but info doesn't show
- Check browser console for JavaScript errors
- Verify HTML elements have correct IDs
- Clear browser cache and reload

### CORS errors when loading from file://
- Use a local server:
  ```bash
  python -m http.server 3000
  ```
- Or use a VS Code extension like "Live Server"

## Next Steps

1. **Token-based Authentication**: Implement JWT tokens from backend
2. **Session Timeout**: Add automatic logout after inactivity
3. **Profile Page**: Create user profile management page
4. **Role-based Access**: Show/hide features based on user type
5. **Activity Logging**: Track user actions and login history
