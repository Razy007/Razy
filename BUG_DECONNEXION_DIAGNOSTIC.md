# DIAGNOSTIC BUG DÉCONNEXION

## Bug Description
User gets disconnected 3 seconds after closing Privacy/Terms pages.

## Tests Performed

### 1. Code Changes
- ✅ Changed `navigate(-1)` to `navigate('/')` in PrivacyPolicyPage.tsx
- ✅ Changed `navigate(-1)` to `navigate('/')` in TermsOfServicePage.tsx  
- ✅ Rebuilt application (new bundle: index-BBigojlt.js)
- ✅ Deployed to production

### 2. Potential Causes

#### A. Cache Issue (Most Likely)
- Browser still using old JS bundle (index-KB8M5wq8.js)
- Solution: Hard refresh (CTRL+SHIFT+R)

#### B. React StrictMode Remounting
- StrictMode can cause double-mount in development
- Not an issue in production build

#### C. State Loss on Navigation
- If user state is not properly persisted
- Check: Does localStorage have data after logout?

#### D. Timeout/Session Logic
- Check for any session timeout logic
- Searched: No setTimeout/setInterval that calls setUser(null)

### 3. Debugging Steps

**Test 1: Check LocalStorage**
```javascript
// In browser console after "disconnect"
console.log(localStorage.getItem('pi_academy_data_' + userId));
```

**Test 2: Check Network**
```javascript
// In Dev Tools > Network tab
// Filter: JS
// Check: Is index-BBigojlt.js loading or index-KB8M5wq8.js?
```

**Test 3: Console Logs**
```javascript
// Add this to PrivacyPolicyPage handleClose
const handleClose = () => {
  console.log('[DEBUG] Privacy closing, navigating to /');
  console.log('[DEBUG] Current user:', user);
  navigate('/');
};
```

### 4. Next Steps

**If cache is the issue:**
1. Add cache-busting meta tags
2. Update service worker (if any)
3. Force browser refresh with query params

**If state is lost:**
1. Check if navigate('/') remounts App component
2. Add state persistence in sessionStorage as backup  
3. Use React Context to prevent remount

**If timeout exists:**
1. Search for all setTimeout/setInterval
2. Check for activity tracking
3. Verify no logout triggers from external libs

### 5. Recommended Fix

Add debugging and cache-busting:

```typescript
// src/pages/PrivacyPolicyPage.tsx
const handleClose = () => {
  console.log('[Privacy] Closing, user state:', !!user);
  // Force cache bust
  const timestamp = Date.now();
  navigate(`/?t=${timestamp}`);
};
```

Or better, use location state:

```typescript
const handleClose = () => {
  navigate('/', { replace: true });
};
```

### 6. Production Verification

Check deployed file:
```bash
curl -I https://www.pioneeracademy.academy/assets/index-BBigojlt.js
# Should return 200 OK

# Check if old file still exists
curl -I https://www.pioneeracademy.academy/assets/index-KB8M5wq8.js  
# Should return 404 Not Found
```

---

## STATUS: AWAITING USER FEEDBACK

Please test:
1. Hard refresh browser (CTRL+SHIFT+R)
2. Check in Private/Incognito mode
3. Check browser console for errors
4. Report findings
