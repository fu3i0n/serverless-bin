# Contributing to DaisyPaste

Thank you for your interest in contributing to DaisyPaste! We welcome contributions from everyone.

## 🌸 Code of Conduct

Be respectful, inclusive, and professional. We're all here to make DaisyPaste better.

## 🚀 How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Use the bug report template** if available
3. **Include details**:
   - Browser and version
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Console errors

### Suggesting Features

1. **Check existing feature requests**
2. **Explain the use case** clearly
3. **Describe the expected behavior**
4. **Consider the impact** on existing functionality

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Follow code style** (see below)
5. **Test thoroughly**
6. **Commit with clear messages**:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
7. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

## 💻 Development Setup

### Prerequisites

- Node.js 18+ (for development tools)
- Git
- Code editor (VSCode recommended)

### Initial Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/daisypaste.git
cd daisypaste

# Install dependencies (optional, for linting/formatting)
npm install

# Start local server
npm run serve
```

### Project Structure

```
daisypaste/
├── index.html              # Main HTML file
├── application.css         # Main styles
├── application.js          # Main JavaScript
├── syntax-theme.css        # Syntax highlighting theme
├── sw.js                   # Service worker
├── manifest.json           # PWA manifest
├── functions/              # Cloudflare Workers functions
│   ├── documents.js        # Create document endpoint
│   ├── documents/[id].js   # Get document endpoint
│   └── raw/[id].js         # Get raw document endpoint
└── .vscode/                # VSCode configuration
```

## 📋 Code Style Guidelines

### JavaScript

- Use ES6+ features (classes, arrow functions, async/await)
- No jQuery or heavy frameworks
- Use `const` over `let`, avoid `var`
- Meaningful variable names
- Add JSDoc comments for functions
- Keep functions small and focused

**Example:**

```javascript
/**
 * Formats bytes into human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
```

### CSS

- Use CSS custom properties for theming
- Mobile-first responsive design
- BEM-like naming for complex components
- Group related properties
- Comment complex layouts

**Example:**

```css
/* Component: Toast Notification */
.toast {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 16px 20px;
  transition: var(--transition);
}

.toast.success {
  border-color: var(--color-success);
}
```

### HTML

- Semantic HTML5 elements
- Accessibility attributes (ARIA labels, roles)
- Proper heading hierarchy
- Alt text for images

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**

```bash
feat: add keyboard shortcut panel
fix: resolve document loading race condition
docs: update deployment instructions
style: format CSS with Prettier
refactor: extract document class to separate file
perf: optimize syntax highlighting performance
```

## 🎨 Design Guidelines

### Color Palette

- **Primary**: Pink/Purple gradient (`#e879f9` to `#8b5cf6`)
- **Accent Pink**: `#f472b6`
- **Accent Purple**: `#8b5cf6`
- **Background**: Dark gradients (`#0f0a14` to `#1a0d1f`)
- **Text**: Light shades (`#f8fafc` to `#94a3b8`)

### Typography

- **Headers**: Bold, gradient text effect
- **Body**: Clean, readable sans-serif
- **Code**: Monospace with ligatures

### Spacing

- Use 8px base grid (8, 16, 24, 32, etc.)
- Consistent padding and margins

### Animations

- Smooth transitions (0.3s cubic-bezier)
- Subtle hover effects
- Meaningful motion

## 🧪 Testing

Before submitting:

1. **Test in multiple browsers** (Chrome, Firefox, Safari, Edge)
2. **Test responsive design** (mobile, tablet, desktop)
3. **Test keyboard navigation**
4. **Check console for errors**
5. **Verify accessibility** with screen readers if possible

## 📚 Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Web Accessibility](https://www.w3.org/WAI/)
- [CSS-Tricks](https://css-tricks.com/)

## 💬 Questions?

- Open a [GitHub Discussion](https://github.com/your-username/daisypaste/discussions)
- Check existing issues and discussions
- Be specific and provide context

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making DaisyPaste better! 💜**
