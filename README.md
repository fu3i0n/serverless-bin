# 🌸 DaisyPaste

**DaisyPaste** - A modern, fast, and beautiful pastebin service powered by [Cloudflare Workers](https://workers.cloudflare.com) with a stunning pink/purple gradient theme.

## ✨ Features

- **🎨 Beautiful UI**: Modern pink/purple gradient theme with smooth animations
- **⚡ Super Fast**: Optimized for performance with modern web technologies
- **🚀 Serverless**: Powered by Cloudflare Workers for global edge performance
- **🎯 Syntax Highlighting**: Support for 100+ programming languages
- **📱 Responsive**: Perfect experience on desktop, tablet, and mobile
- **♿ Accessible**: Full keyboard navigation and screen reader support
- **💾 Auto-save**: Automatic saving while you type (optional)
- **🔒 Secure**: Modern security practices and data validation
- **📊 Performance Monitoring**: Built-in performance tracking

## 🚀 Modern Architecture

- **Frontend**: Modern ES6+ JavaScript with zero dependencies
- **Styling**: CSS Custom Properties with modern layouts
- **Backend**: Optimized Cloudflare Workers functions
- **Storage**: Cloudflare KV for global content delivery
- **Performance**: Smart caching and content optimization

## 🎨 Design Philosophy

DaisyPaste combines the simplicity of traditional pastebins with modern design principles:

- **Gradient-first design** with pink/purple color scheme
- **Typography-focused** with premium font stacks
- **Animation-enhanced** interactions for delightful UX
- **Mobile-optimized** responsive layouts
- **Accessibility-driven** inclusive design

## 🛠️ Technologies

- **Runtime**: Cloudflare Workers
- **Storage**: Cloudflare KV
- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: Modern CSS with custom properties
- **Syntax Highlighting**: Highlight.js
- **Build**: Zero-build modern web standards

## 📦 Deployment

### Cloudflare Pages + Workers

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd serverless-bin
   ```

2. **Create KV Namespace**
   - Go to Cloudflare Dashboard > Workers > KV
   - Create a new namespace called `FILES_KV`

3. **Deploy to Cloudflare Pages**
   - Connect your GitHub repository to Cloudflare Pages
   - Set build command: (none - static files)
   - Set output directory: `/`

4. **Configure KV Binding**
   - Go to Pages > Your Site > Settings > Functions
   - Add KV binding: `FILES_KV` → Your KV Namespace

5. **Custom Domain** (optional)
   - Configure your custom domain in Pages settings

## 🎯 API Endpoints

### Create Document
```http
POST /documents
Content-Type: application/json

{raw text content}
```

**Response:**
```json
{
  "success": true,
  "key": "abc123def456",
  "size": 1024,
  "created": "2025-11-01T12:00:00.000Z"
}
```

### Get Document
```http
GET /documents/{id}
```

**Response:**
```json
{
  "id": "abc123def456",
  "data": "document content",
  "metadata": {
    "size": 1024,
    "created": "2025-11-01T12:00:00.000Z",
    "version": "2.0"
  }
}
```

### Get Raw Document
```http
GET /raw/{id}
```

Returns plain text content with appropriate `Content-Type` headers.

## ⌨️ Keyboard Shortcuts

- **Ctrl + S**: Save document
- **Ctrl + N**: New document
- **Ctrl + D**: Duplicate & edit
- **Ctrl + Shift + R**: View raw
- **Ctrl + Shift + T**: Share on Twitter
- **?**: Show/hide shortcuts panel

## 🎨 Customization

### Theme Colors
Edit CSS custom properties in `application.css`:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #e879f9 0%, #f472b6 50%, #8b5cf6 100%);
  --accent-pink: #f472b6;
  --accent-purple: #8b5cf6;
  /* ... more variables */
}
```

### Syntax Theme
Customize syntax highlighting in `syntax-theme.css` to match your brand colors.

## 🔧 Configuration

### Application Options
```javascript
const app = new DaisyPaste("DaisyPaste", {
  twitter: true,           // Enable Twitter sharing
  theme: 'gradient-purple-pink',  // Theme identifier
  autoSave: true,          // Enable auto-save
  autoSaveDelay: 2000      // Auto-save delay (ms)
});
```

## 📈 Performance

- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Lighthouse Score**: 95+
- **Global CDN**: Cloudflare Edge Network
- **Cache Strategy**: Smart caching with 24h TTL

## 🔒 Security Features

- Input validation and sanitization
- XSS protection with CSP headers
- Rate limiting (Cloudflare built-in)
- Secure document ID generation
- Content-Type validation

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Original inspiration from [Hastebin](https://hastebin.com)
- Built with love using Cloudflare's amazing platform
- Design inspired by modern gradient aesthetics

---

**Made with 💜 for developers who appreciate beautiful tools**
