# 🚨 DaisyPaste - Troubleshooting Guide

## The #1 Problem: KV Binding Not Set Up

**90% of deployment issues are caused by missing KV binding configuration in Cloudflare Pages.**

---

## 🔥 Quick Fix (Most Common Issue)

### Problem: Buttons don't work, can't save documents

**Solution - Add KV Binding:**

1. **Go to Cloudflare Dashboard** → Workers & Pages → Your Project
2. Click **Settings** tab
3. Scroll to **Functions** section
4. Find **KV namespace bindings**
5. Click **Add binding**
6. Enter:
   - Variable name: `FILES_KV` (MUST be exactly this!)
   - KV namespace: Select from dropdown (or create new)
7. Click **Save**
8. Go to **Deployments** tab
9. Click **Retry deployment** (or push a new commit)

**✅ This fixes 90% of issues!**

---

## 🐛 Debug Steps

### Step 1: Check Browser Console

**Press F12** → **Console** tab

**Look for these errors:**

```javascript
// ❌ BAD - KV not bound
"Cannot read properties of undefined (reading 'FILES_KV')"
→ Solution: Add KV binding in Cloudflare dashboard

// ❌ BAD - App not initialized
"DaisyPaste is not defined"
→ Solution: Check if application.js loads (Network tab)

// ❌ BAD - Highlight.js not loaded
"hljs is not defined"
→ Solution: Check internet connection, CDN blocked?

// ✅ GOOD - Service worker registered
"Service Worker registered: ServiceWorkerRegistration {...}"
```

### Step 2: Test in Console

**Press F12** → **Console** tab, run these:

```javascript
// Test 1: Check if DaisyPaste loaded
typeof DaisyPaste;
// Expected: "function"
// If "undefined": application.js didn't load

// Test 2: Check if app initialized
app;
// Expected: DaisyPaste {appName: "DaisyPaste", ...}
// If "null": App failed to initialize

// Test 3: Check if highlight.js loaded
typeof hljs;
// Expected: "object"
// If "undefined": CDN blocked or slow connection

// Test 4: Check button configuration
app && app.buttons;
// Expected: Array of button objects
// If error: App not initialized

// Test 5: Manual save test (type something in editor first!)
app && app.handleAction('save');
// Expected: Should show save process
// If error: Shows what went wrong
```

### Step 3: Check Network

**Press F12** → **Network** tab → Reload page

**All these should be 200 or 304:**

- `index.html` → 200
- `application.css` → 200 or 304
- `syntax-theme.css` → 200 or 304
- `application.js` → 200 or 304
- `highlight.min.js` (from CDN) → 200

**If any is 404:**

- File missing from deployment
- Check if file exists in GitHub repo
- Redeploy

### Step 4: Test Endpoints

**Open these URLs in browser:**

```
https://your-site.pages.dev/health
→ Expected: {"status":"healthy","timestamp":"..."}
→ If error: KV binding issue

https://your-site.pages.dev/documents/abc123
→ Expected: 404 (if document doesn't exist) or document data
→ If 500 error: KV binding issue
```

---

## 🔍 Specific Error Solutions

### Error: "Cannot read properties of undefined (reading 'FILES_KV')"

**Cause:** KV namespace binding not configured in Cloudflare Pages

**Fix:**

1. Cloudflare Dashboard → Your Project → Settings → Functions
2. Add KV binding named `FILES_KV`
3. Redeploy

### Error: "DaisyPaste is not defined"

**Cause:** `application.js` failed to load or execute

**Check:**

- F12 → Network tab → Is `application.js` loading?
- F12 → Console tab → Any syntax errors?
- Browser cache → Try hard refresh (Ctrl+Shift+R)

**Fix:**

- Clear browser cache
- Check if file exists in deployment
- Redeploy if file missing

### Error: "hljs is not defined"

**Cause:** Highlight.js CDN not loading

**Check:**

- Internet connection
- F12 → Network tab → Is highlight CDN blocked?
- Corporate firewall blocking CDN?

**Fix:**

- Wait a few seconds and reload
- Check network connectivity
- Try different network if corporate firewall

### Error: Buttons appear but don't respond

**Cause:** Event listeners not attached

**Check Console:**

```javascript
// Check if app is initialized
app;
// Should show DaisyPaste instance

// Check if buttons are configured
app.buttons;
// Should show array

// Try manual action
app.handleAction('new');
// Should trigger new document
```

**Fix:**

- Hard refresh (Ctrl+Shift+R)
- Clear cache and reload
- Check console for initialization errors

### Error: Can't type in editor

**Cause:** Editor is hidden or not focused (should be fixed now!)

**Check:**

```javascript
// Check if editor exists
document.getElementById('code-editor');
// Should return textarea element

// Check if visible
getComputedStyle(document.getElementById('code-editor')).display;
// Should be "block", not "none"
```

**Fix:**

- Already fixed in latest code!
- If still happening, hard refresh

### Error: Syntax highlighting doesn't work

**Cause:** hljs not initialized or content not highlighted

**Check:**

```javascript
// Check hljs loaded
typeof hljs;
// Should be "object"

// Check if languages loaded
hljs.listLanguages();
// Should show array of languages
```

**Test manually:**

```javascript
// Highlight code manually
var code = document.querySelector('code');
if (code) {
  hljs.highlightElement(code);
}
```

---

## 🧪 Local Testing with KV

### Option 1: Using npm serve (No KV)

```powershell
npm run serve
```

**Limitations:**

- ✅ UI works
- ✅ Buttons work
- ✅ Highlighting works
- ❌ Can't save documents (no KV)
- ❌ Can't load documents

**Use for:** Testing UI, buttons, styling

### Option 2: Using Wrangler (With KV)

**Setup:**

```powershell
# Install Wrangler
npm install -g wrangler

# Create KV namespace
wrangler kv:namespace create "FILES_KV"
# Copy the ID it gives you

# Edit wrangler.toml
# Replace preview_id_placeholder with your KV ID

# Run dev server
wrangler pages dev . --kv FILES_KV
```

**Full features:**

- ✅ UI works
- ✅ Buttons work
- ✅ Can save documents
- ✅ Can load documents
- ✅ Full production experience

---

## 📊 Health Check

**Run these checks in order:**

### ✅ Checklist

```
□ Can you see the page?
□ Can you see the "DaisyPaste" logo?
□ Can you see the code editor textarea?
□ Can you type in the editor?
□ Can you see the toolbar buttons?
□ Does Ctrl+N clear the editor?
□ Does Ctrl+S attempt to save?
□ Does syntax highlighting work after typing code?
□ Can you save a document?
□ Does it redirect to /documentID?
□ Can you load that document in a new tab?
□ Does the raw view work (/raw/documentID)?
```

**If ALL checked:** ✅ Everything works!

**If any unchecked:** See error solutions above

---

## 🚀 Deployment Checklist

**Before deploying:**

- [ ] Git repo connected to Cloudflare Pages
- [ ] Build command: (empty)
- [ ] Build output directory: `/`
- [ ] KV namespace created
- [ ] KV binding added (named `FILES_KV`)
- [ ] Environment: Production selected
- [ ] Branch: main (or your default branch)

**After deploying:**

- [ ] Deployment shows "Success"
- [ ] Visit site URL
- [ ] Check browser console (F12) for errors
- [ ] Test typing in editor
- [ ] Test saving a document
- [ ] Test loading a saved document
- [ ] Test raw view

---

## 🆘 Still Broken?

### Collect This Info:

1. **Your site URL**
2. **Browser console errors** (F12 → Console → screenshot)
3. **Network tab** (F12 → Network → show failed requests)
4. **Results of console tests** (see Step 2 above)
5. **KV binding confirmation** (screenshot of Settings → Functions)
6. **Latest deployment status** (success or failure)

### Share These Commands' Output:

```javascript
// Run in browser console (F12)
console.log({
  DaisyPasteLoaded: typeof DaisyPaste,
  hljsLoaded: typeof hljs,
  appInitialized: app !== null,
  editor: document.getElementById('code-editor') !== null,
  buttons: document.querySelectorAll('.toolbar button').length,
});
```

---

**With this guide, 99% of issues should be solved! 🎉**
