# 🧪 Testing DaisyPaste

Comprehensive testing guide to ensure DaisyPaste works perfectly.

## Pre-Deployment Testing (Local)

### 1. Static File Serving

```bash
# Install and run local server
npm run serve

# Or use Python
python -m http.server 3000

# Visit http://localhost:3000
```

### 2. Manual Testing Checklist

#### ✅ Core Functionality

- [ ] Page loads without errors
- [ ] Create new paste (Ctrl+N)
- [ ] Type text in editor
- [ ] Save paste (Ctrl+S)
- [ ] Document gets unique URL
- [ ] Loading indicator shows during save
- [ ] Success message appears
- [ ] Document can be loaded via URL
- [ ] Syntax highlighting works
- [ ] Line numbers display correctly
- [ ] Duplicate document works (Ctrl+D)
- [ ] Raw view accessible
- [ ] Twitter share button works

#### ✅ UI/UX

- [ ] Pink/purple gradient theme visible
- [ ] All buttons respond to hover
- [ ] Tooltips show on button hover
- [ ] Keyboard shortcuts work
- [ ] Help panel toggles with `?` key
- [ ] Loading spinner shows/hides properly
- [ ] Toast notifications appear and dismiss
- [ ] Responsive design works on mobile
- [ ] Smooth animations on transitions

#### ✅ Accessibility

- [ ] Tab navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Screen reader compatible
- [ ] Keyboard-only navigation possible
- [ ] Color contrast sufficient

#### ✅ Performance

- [ ] Page loads in < 2 seconds
- [ ] Syntax highlighting is fast
- [ ] No console errors
- [ ] No layout shifts
- [ ] Smooth scrolling

## Browser Testing

Test in multiple browsers:

### Desktop

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Opera (latest)

### Mobile

- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Samsung Internet

### Testing Checklist per Browser

1. Basic functionality works
2. Layout displays correctly
3. Animations are smooth
4. No console errors
5. Service worker registers
6. PWA installable

## API Endpoint Testing

### Using cURL

#### 1. Health Check

```bash
curl https://your-site.pages.dev/health
```

Expected: JSON with status "ok"

#### 2. Create Document

```bash
curl -X POST https://your-site.pages.dev/documents \
  -H "Content-Type: application/json" \
  -d "console.log('Hello, DaisyPaste!');"
```

Expected: JSON with document key

#### 3. Get Document

```bash
curl https://your-site.pages.dev/documents/{document-key}
```

Expected: JSON with document data

#### 4. Get Raw Document

```bash
curl https://your-site.pages.dev/raw/{document-key}
```

Expected: Plain text content

### Using JavaScript (Browser Console)

#### Create Document

```javascript
fetch('/documents', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: 'const x = 42;',
})
  .then(r => r.json())
  .then(console.log);
```

#### Get Document

```javascript
fetch('/documents/abc123def456')
  .then(r => r.json())
  .then(console.log);
```

## Edge Cases Testing

### Document Content

- [ ] Empty document (should show error)
- [ ] Very large document (1MB limit)
- [ ] Special characters: `<>&"'`
- [ ] Unicode characters: 你好, مرحبا, Привет
- [ ] Code with syntax errors
- [ ] Mixed languages in one paste
- [ ] Line breaks: `\n`, `\r\n`
- [ ] Tabs vs spaces
- [ ] Very long lines (>1000 chars)
- [ ] Many lines (>10,000)

### Network Conditions

- [ ] Slow 3G simulation
- [ ] Offline mode
- [ ] Network timeout
- [ ] Server error response

### Security Testing

- [ ] XSS attempts: `<script>alert('XSS')</script>`
- [ ] HTML injection: `<img src=x onerror=alert(1)>`
- [ ] SQL injection patterns (should be harmless)
- [ ] Very long URLs
- [ ] Invalid document IDs

## Performance Testing

### Lighthouse Audit

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://your-site.pages.dev --output html --output-path ./lighthouse-report.html
```

Target scores:

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

### Core Web Vitals

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Load Testing

```bash
# Using Apache Bench
ab -n 100 -c 10 https://your-site.pages.dev/

# Using wrk
wrk -t4 -c100 -d30s https://your-site.pages.dev/
```

## Post-Deployment Testing

### 1. Production Health Check

```bash
curl https://your-domain.com/health
```

### 2. SSL Certificate

```bash
curl -vI https://your-domain.com 2>&1 | grep -i ssl
```

### 3. DNS Propagation

```bash
nslookup your-domain.com
```

### 4. CDN Caching

```bash
curl -I https://your-domain.com/application.css
# Look for: cf-cache-status: HIT
```

### 5. Service Worker

```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(registrations => console.log(registrations));
```

## Automated Testing (Future Enhancement)

### Unit Tests (Example)

```javascript
// tests/utils.test.js
import { Utils } from '../application.js';

describe('Utils.formatFileSize', () => {
  it('formats bytes correctly', () => {
    expect(Utils.formatFileSize(0)).toBe('0 Bytes');
    expect(Utils.formatFileSize(1024)).toBe('1 KB');
    expect(Utils.formatFileSize(1048576)).toBe('1 MB');
  });
});
```

### E2E Tests (Example using Playwright)

```javascript
// tests/e2e/paste.spec.js
test('create and load paste', async ({ page }) => {
  await page.goto('/');
  await page.fill('#editor', 'console.log("test");');
  await page.click('.save');
  await expect(page).toHaveURL(/\/[a-z0-9]{12}/);
  await expect(page.locator('.code-display')).toContainText('console.log');
});
```

## Issue Reporting

If you find bugs during testing:

1. **Document the issue**:
   - Browser and version
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable
   - Console errors

2. **Check existing issues** on GitHub

3. **Create detailed bug report**

## Testing Tools

### Recommended Tools

- **Browser DevTools**: Built-in debugging
- **Lighthouse**: Performance auditing
- **WAVE**: Accessibility testing
- **BrowserStack**: Cross-browser testing
- **Postman**: API testing
- **curl**: Command-line testing
- **Charles Proxy**: Network debugging

### Browser Extensions

- **React DevTools**: Component inspection
- **Axe DevTools**: Accessibility testing
- **Lighthouse**: Performance audits
- **Web Vitals**: Real-time metrics

## Success Criteria

✅ All core functionality works
✅ No console errors
✅ 95+ Lighthouse scores
✅ Works in all major browsers
✅ Responsive on all devices
✅ Accessible via keyboard
✅ Fast load times (< 2s)
✅ Service worker functions
✅ PWA installable
✅ API endpoints respond correctly

---

**Keep testing to keep DaisyPaste perfect! 💜**
