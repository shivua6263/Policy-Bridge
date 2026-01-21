# 🚀 Quick Start Guide - Testing the Authentication System

## Prerequisites
- Django server running on `http://localhost:8000`
- Frontend accessible (usually on `http://localhost:3000` or similar)
- Modern web browser (Chrome, Firefox, Edge, Safari)

---

## Step 1: Start the Backend

```bash
cd /home/labuser/Desktop/Policy/Backend/restapi
python manage.py runserver
```

Expected output:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

---

## Step 2: Open Frontend in Browser

Navigate to your frontend URL. You will be **automatically redirected to login.html**.

---

## Step 3: Test Signup (Customer)

### Click "Sign Up" Tab

1. Select **Customer** (should be default)
2. Make sure you're on **Sign Up** tab
3. Fill in the form:
   - **Name:** John Doe
   - **Email:** john@example.com
   - **Phone:** 9876543210
   - **Password:** password123
   - **Confirm Password:** password123
   - **Check:** "I agree to terms"

4. Click **"Sign Up"** button

Expected result:
- ✅ Success message appears
- ✅ After 2 seconds, switches to Login tab
- ✅ Can now login with these credentials

---

## Step 4: Test Login (Customer)

### You should already be on Login tab

1. **Email:** john@example.com
2. **Password:** password123
3. Click **"Login"** button

Expected result:
- ✅ Success message: "Login successful!"
- ✅ After 1.5 seconds, redirected to **index.html** (home page)
- ✅ **User dropdown button shows "John"** instead of "User"

---

## Step 5: Test Navbar Dropdown

1. **Click on "John"** button in navbar
2. You should see dropdown menu:
   - My Profile
   - My Policies
   - My Claims
   - ------
   - Logout

3. **Click "My Profile"** → Should open account.html
4. Go back to home (click logo)

---

## Step 6: Test Logout

1. **Click on "John"** button in navbar
2. **Click "Logout"**
3. Confirmation dialog appears
4. **Click "OK"** to confirm

Expected result:
- ✅ localStorage cleared
- ✅ Redirected to login.html
- ✅ Cannot access other pages (would redirect to login)

---

## Step 7: Test Agent Signup

1. On login page, click **"Agent"** tab
2. Click **"Sign Up"** button
3. Fill in:
   - **Name:** Jane Agent
   - **Email:** jane@agent.com
   - **Phone:** 9876543211
   - **Password:** password456
   - **Confirm:** password456
   - **Agree:** Check the box

4. Click **"Sign Up"**

Expected result:
- ✅ Success message
- ✅ Switches to Login tab
- ✅ Can login as agent

---

## Step 8: Test Agent Login

1. Make sure **"Agent"** tab is selected
2. **Email:** jane@agent.com
3. **Password:** password456
4. Click **"Login"**

Expected result:
- ✅ Redirected to index.html
- ✅ Shows "Jane" in navbar (first name)
- ✅ All features work as expected

---

## Step 9: Test Authentication Protection

1. Login as customer (John)
2. Click on "John" dropdown
3. Click **"My Policies"** → Should load policies.html
4. Open developer console (F12)
5. Go to **Application tab** → **localStorage**
6. **Delete the "currentUser" entry**
7. **Refresh the page** (F5)

Expected result:
- ✅ Immediately redirected to login.html
- ✅ Cannot access the page without logging in

---

## Step 10: Test Error Messages

### Invalid Login
1. On login page
2. Enter **wrong email** or **wrong password**
3. Click Login

Expected result:
- ✅ Red error message: "Invalid email or password"
- ✅ Stay on login page

### Duplicate Email Signup
1. Try to signup with email: john@example.com
2. (This email should already exist from Step 3)

Expected result:
- ✅ Red error message about duplicate email
- ✅ Cannot proceed with signup

### Password Mismatch
1. On signup page
2. Password: password123
3. Confirm: password456
4. Try to click Sign Up

Expected result:
- ✅ Form disabled (Sign Up button greyed out)
- ✅ Shows error: "Passwords do not match"

---

## Step 11: Test Form Validation

### Required Fields
1. On login page
2. Leave **Email** empty
3. Try to click Login

Expected result:
- ✅ Login button should be disabled
- ✅ Error message: "Email is required"

### Minimum Password Length
1. On signup page
2. Password: abc (less than 6 chars)
3. Try to proceed

Expected result:
- ✅ Error message: "Password must be at least 6 characters"

---

## Step 12: Test Responsive Design

1. Login as customer
2. Open browser DevTools (F12)
3. Click **Device Toggle** (phone icon)
4. Select **Mobile device** (e.g., iPhone 12)
5. View should be mobile-friendly
6. Dropdown should work on mobile

Expected result:
- ✅ Layout adjusts to mobile size
- ✅ All buttons are accessible
- ✅ Form is still usable

---

## Troubleshooting

### Issue: "Cannot connect to server"
**Solution:** Check if Django is running on http://localhost:8000

### Issue: CORS error in console
**Solution:** Check CORS_ALLOWED_ORIGINS in Django settings.py

### Issue: Login doesn't work even with correct credentials
**Solution:** 
1. Check if user was created successfully
2. Clear browser cache (Ctrl+Shift+Delete)
3. Restart both frontend and backend

### Issue: User data not showing in navbar
**Solution:**
1. Open DevTools (F12)
2. Check Application → localStorage
3. Look for "currentUser" key
4. Verify data is valid JSON

### Issue: Can't logout
**Solution:**
1. Check browser console for errors
2. Try clearing cache and cookies
3. Restart browser

---

## Success Criteria Checklist

- [ ] Can signup as customer
- [ ] Can login as customer
- [ ] Can signup as agent
- [ ] Can login as agent
- [ ] User name displays in navbar
- [ ] Dropdown menu works
- [ ] Logout works with confirmation
- [ ] Authentication check redirects to login
- [ ] localStorage persists login
- [ ] Error messages display correctly
- [ ] Form validation works
- [ ] Mobile responsive design works
- [ ] API calls visible in DevTools Network
- [ ] No console errors

---

## Next Steps After Testing

1. ✅ Verify all tests pass
2. ✅ Check API responses in Network tab
3. ✅ Test with different browsers
4. ✅ Test on mobile devices
5. ✅ Check database for created users
6. ✅ Review API endpoint documentation
7. ✅ Plan for additional features if needed

---

## API Endpoint URLs

If you need to test APIs directly (using Postman or curl):

```
POST /api/customer/login/
POST /api/customer/signup/
POST /api/agent/login/
POST /api/agent/signup/
```

Base URL: `http://localhost:8000/api`

---

## Document References

- **AUTHENTICATION_SETUP.md** - Complete technical details
- **QUICK_REFERENCE.md** - API and feature reference
- **IMPLEMENTATION_COMPLETE.md** - Feature list and file locations

---

## Support

If you encounter any issues:
1. Check the browser console (F12) for errors
2. Review the documentation files
3. Verify backend is running
4. Check CORS configuration
5. Clear browser cache and try again

---

**Happy Testing! 🎉**

*All features should work as expected after following these steps.*
