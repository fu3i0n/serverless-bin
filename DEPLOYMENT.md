# 🚀 DaisyPaste Deployment Guide

Complete guide to deploying DaisyPaste to Cloudflare Pages with Workers.

## Prerequisites

- GitHub account
- Cloudflare account (free tier works!)
- Git installed locally
- Node.js 18+ (optional, for local development)

## 📦 Step 1: Prepare Your Repository

1. **Fork or clone this repository**

   ```bash
   git clone https://github.com/your-username/daisypaste.git
   cd daisypaste
   ```

2. **Push to your GitHub repository**
   ```bash
   git remote add origin https://github.com/your-username/daisypaste.git
   git branch -M main
   git push -u origin main
   ```

## ☁️ Step 2: Set Up Cloudflare KV

1. **Log in to Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)

2. **Create KV Namespace**
   - Navigate to **Workers & Pages** → **KV**
   - Click **Create a namespace**
   - Name it: `daisypaste-documents` (or your preferred name)
   - Click **Add**
   - **Copy the Namespace ID** (you'll need this later)

3. **Create Preview Namespace** (optional but recommended)
   - Create another namespace: `daisypaste-documents-preview`
   - Copy its ID as well

## 🌐 Step 3: Deploy to Cloudflare Pages

### Option A: Via Cloudflare Dashboard (Recommended)

1. **Go to Pages**
   - In Cloudflare Dashboard, navigate to **Workers & Pages**
   - Click **Create application**
   - Select **Pages** tab
   - Click **Connect to Git**

2. **Connect Repository**
   - Authorize GitHub if needed
   - Select your `daisypaste` repository
   - Click **Begin setup**

3. **Configure Build Settings**

   ```
   Project name: daisypaste (or your preferred name)
   Production branch: main
   Build command: (leave empty)
   Build output directory: /
   ```

4. **Environment Variables** (if needed)
   - Click **Add variable** if you need any
   - For now, leave empty (we'll configure KV next)

5. **Click Save and Deploy**

### Option B: Via Wrangler CLI

1. **Install Wrangler**

   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**

   ```bash
   wrangler login
   ```

3. **Copy and configure wrangler.toml**

   ```bash
   cp wrangler.toml.example wrangler.toml
   ```

   Edit `wrangler.toml` with your KV namespace IDs:

   ```toml
   [[kv_namespaces]]
   binding = "FILES_KV"
   id = "your-kv-namespace-id-here"
   ```

4. **Deploy**
   ```bash
   wrangler pages deploy .
   ```

## 🔗 Step 4: Configure KV Binding

1. **In Cloudflare Dashboard**
   - Go to **Workers & Pages**
   - Select your `daisypaste` project
   - Go to **Settings** → **Functions**

2. **Add KV Binding**
   - Scroll to **KV namespace bindings**
   - Click **Add binding**
   - Variable name: `FILES_KV`
   - KV namespace: Select `daisypaste-documents`
   - Click **Save**

3. **Redeploy** (if needed)
   - Go to **Deployments** tab
   - Click **Retry deployment** on the latest deployment
   - Or push a new commit to trigger redeployment

## ✅ Step 5: Verify Deployment

1. **Access Your Site**
   - Your site will be available at: `https://daisypaste.pages.dev`
   - (Or your custom domain if configured)

2. **Test Functionality**
   - Create a new paste by typing some text
   - Click **Save** (Ctrl+S)
   - Verify you get a URL
   - Try loading the document
   - Test raw view

3. **Check Health Endpoint**
   - Visit: `https://your-site.pages.dev/health`
   - Should return JSON with status "ok"

## 🌍 Step 6: Add Custom Domain (Optional)

1. **In Cloudflare Dashboard**
   - Go to your Pages project
   - Click **Custom domains**
   - Click **Set up a custom domain**

2. **Add Your Domain**
   - Enter your domain (e.g., `paste.yourdomain.com`)
   - Follow DNS configuration instructions
   - Wait for SSL certificate (usually < 5 minutes)

3. **DNS Configuration**
   - Add CNAME record pointing to your Pages project
   - Example:
     ```
     Type: CNAME
     Name: paste
     Target: daisypaste.pages.dev
     Proxy: Enabled (orange cloud)
     ```

## 🔧 Advanced Configuration

### Environment Variables

Add in **Settings** → **Environment variables**:

```
NODE_ENV=production
MAX_DOCUMENT_SIZE=1048576  # 1MB in bytes
```

### Custom Response Headers

In **Settings** → **Functions** → **Custom Headers**:

```
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Rate Limiting

Consider using Cloudflare's built-in rate limiting:

- Go to **Security** → **WAF** → **Rate limiting rules**
- Create rule for `/documents` endpoint
- Limit: 100 requests per minute per IP

## 🔍 Troubleshooting

### "KV namespace not found" Error

- Verify KV binding in Settings → Functions
- Check binding name is exactly `FILES_KV`
- Redeploy after adding binding

### Documents Not Saving

- Check browser console for errors
- Verify KV namespace has write permissions
- Check health endpoint: `/health`

### Syntax Highlighting Not Working

- Ensure CDN URL for Highlight.js is accessible
- Check browser console for loading errors
- Verify Content Security Policy settings

### CSS Not Loading

- Check file paths in index.html
- Verify files are in repository root
- Clear browser cache and hard refresh

## 📊 Monitoring

### Cloudflare Analytics

- View in Dashboard → Analytics
- Monitor requests, bandwidth, errors
- Set up alerts for anomalies

### KV Usage

- Check in Workers & Pages → KV
- Monitor storage usage
- Plan: Free tier = 100,000 reads/day, 1,000 writes/day

## 🔄 Updating

### Automatic Updates (via Git)

1. Push changes to your repository
2. Cloudflare automatically rebuilds and deploys
3. Check Deployments tab for status

### Manual Update

```bash
git pull origin main
wrangler pages deploy .
```

## 🎉 Success!

Your DaisyPaste instance should now be live!

**Test URLs:**

- Main app: `https://your-site.pages.dev/`
- Health check: `https://your-site.pages.dev/health`
- Sample document: `https://your-site.pages.dev/abc123def456`

## 📚 Additional Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [KV Documentation](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

## 💬 Need Help?

- Check [GitHub Issues](https://github.com/your-username/daisypaste/issues)
- Read [CONTRIBUTING.md](./CONTRIBUTING.md)
- Join discussions in GitHub Discussions

---

**Happy pasting! 💜**
