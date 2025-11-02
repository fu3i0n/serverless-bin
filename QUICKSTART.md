# 🚀 Quick Start Guide

Get DaisyPaste running in 5 minutes!

## Option 1: Cloudflare Pages (Recommended)

### 1️⃣ Create KV Namespace

```bash
# Login to Cloudflare Dashboard
→ Workers & Pages → KV → Create namespace
→ Name: "daisypaste-documents"
→ Copy the Namespace ID
```

### 2️⃣ Deploy to Pages

```bash
# Push this repo to GitHub, then:
→ Cloudflare Dashboard → Workers & Pages
→ Create application → Pages → Connect to Git
→ Select repository → Begin setup
→ Build command: (leave empty)
→ Build output: /
→ Save and Deploy
```

### 3️⃣ Configure KV Binding

```bash
→ Your Pages project → Settings → Functions
→ KV namespace bindings → Add binding
→ Variable name: FILES_KV
→ KV namespace: Select your namespace
→ Save → Redeploy
```

### 4️⃣ Test It!

```bash
→ Visit your-site.pages.dev
→ Type some code
→ Press Ctrl+S to save
→ Share the URL! 🎉
```

## Option 2: Local Development

### 1️⃣ Clone and Serve

```bash
git clone https://github.com/your-username/daisypaste.git
cd daisypaste

# Option A: Using npm
npm run serve

# Option B: Using Python
python -m http.server 3000

# Option C: Using any static server
npx serve -s . -p 3000
```

### 2️⃣ Open Browser

```bash
→ Visit http://localhost:3000
→ Test the UI (functions won't work locally without Workers)
```

## Option 3: Deploy with Wrangler

### 1️⃣ Install Wrangler

```bash
npm install -g wrangler
```

### 2️⃣ Login

```bash
wrangler login
```

### 3️⃣ Create KV

```bash
wrangler kv:namespace create "FILES_KV"
# Copy the ID

wrangler kv:namespace create "FILES_KV" --preview
# Copy the preview ID
```

### 4️⃣ Configure

```bash
cp wrangler.toml.example wrangler.toml
# Edit wrangler.toml with your KV IDs
```

### 5️⃣ Deploy

```bash
wrangler pages deploy .
```

## 📋 Checklist

After deployment, verify:

- ✅ Site loads without errors
- ✅ Can create a new paste
- ✅ Save works (Ctrl+S)
- ✅ Document loads from URL
- ✅ Syntax highlighting works
- ✅ Health endpoint responds: `/health`
- ✅ Raw view works: `/raw/{id}`

## 🎯 Key URLs

After deployment:

```
Main site: https://your-site.pages.dev
Health: https://your-site.pages.dev/health
Document: https://your-site.pages.dev/{document-id}
Raw: https://your-site.pages.dev/raw/{document-id}
```

## ⌨️ Keyboard Shortcuts

```
Ctrl + S    →  Save
Ctrl + N    →  New
Ctrl + D    →  Duplicate
Ctrl + Shift + R  →  Raw view
?           →  Help
```

## 🐛 Troubleshooting

### "KV namespace not found"

→ Add KV binding in Settings → Functions

### Documents not saving

→ Check KV binding name is exactly `FILES_KV`

### CSS not loading

→ Hard refresh (Ctrl+Shift+R) or check file paths

### Functions not working locally

→ Use Wrangler dev or deploy to Cloudflare

## 📚 Next Steps

1. ✅ Read [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup
2. ✅ Check [TESTING.md](./TESTING.md) for testing guide
3. ✅ Read [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute
4. ✅ Customize colors in `application.css`
5. ✅ Add your custom domain

## 🎨 Quick Customization

### Change Theme Colors

Edit `application.css`:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #YOUR_COLOR1, #YOUR_COLOR2);
  --accent-pink: #YOUR_PINK;
  --accent-purple: #YOUR_PURPLE;
}
```

### Change App Name

Edit `index.html`:

```html
<title>YourName</title> <span class="logo-text">YourName</span>
```

Edit `application.js`:

```javascript
app = new DaisyPaste("YourName", { ...
```

## 💬 Need Help?

- 📖 Read the [README.md](./README.md)
- 🐛 Check [GitHub Issues](https://github.com/your-username/daisypaste/issues)
- 💬 Join GitHub Discussions
- 📧 Contact: your@email.com

## 🎉 Success!

You're all set! Start pasting beautiful code! 💜

---

**DaisyPaste - Modern, Fast, Beautiful** ✨
