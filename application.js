/**
 * DaisyPaste - Modern Pastebin Application
 * Refactored for ES6+, performance, and clean architecture
 */

// Utility functions
const Utils = {
  // Escapes HTML tag characters
  htmlEscape(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/>/g, "&gt;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  },

  // Debounce function for performance optimization
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Generate random ID
  generateId() {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  },

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};

// Document class representing a single paste
class DaisyDocument {
  constructor() {
    this.locked = false;
    this.key = null;
    this.data = null;
    this.language = null;
    this.createdAt = null;
  }

  // Load document from server
  async load(key, lang = null) {
    try {
      const response = await fetch(`/documents/${key}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      this.locked = true;
      this.key = key;
      this.data = data.data;
      this.createdAt = new Date();

      let highlighted;
      try {
        if (lang === 'txt') {
          highlighted = { value: Utils.htmlEscape(data.data) };
        } else if (lang) {
          highlighted = hljs.highlight(data.data, { language: lang });
        } else {
          highlighted = hljs.highlightAuto(data.data);
        }
      } catch (err) {
        console.warn('Syntax highlighting failed, falling back to auto:', err);
        highlighted = hljs.highlightAuto(data.data);
      }

      return {
        value: highlighted.value,
        key: key,
        language: highlighted.language || lang,
        lineCount: data.data.split('\n').length,
        size: new Blob([data.data]).size
      };
    } catch (error) {
      console.error('Failed to load document:', error);
      throw error;
    }
  }

  // Save document to server
  async save(data) {
    if (this.locked) {
      throw new Error('Document is already locked');
    }

    try {
      this.data = data;
      
      const response = await fetch('/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: data
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      this.locked = true;
      this.key = result.key;
      this.createdAt = new Date();
      
      const highlighted = hljs.highlightAuto(data);
      
      return {
        value: highlighted.value,
        key: result.key,
        language: highlighted.language,
        lineCount: data.split('\n').length,
        size: new Blob([data]).size
      };
    } catch (error) {
      console.error('Failed to save document:', error);
      throw error;
    }
  }
}



// Main DaisyPaste application class
class DaisyPaste {
  constructor(appName, options = {}) {
    this.appName = appName;
    this.options = {
      twitter: true,
      theme: 'gradient-purple-pink',
      autoSave: true,
      autoSaveDelay: 2000,
      ...options
    };
    
    // DOM elements
    this.elements = {
      textarea: document.getElementById('editor'),
      codeDisplay: document.getElementById('box'),
      codeContent: document.querySelector('#box code'),
      lineNumbers: document.getElementById('linenos'),
      messages: document.getElementById('messages'),
      loading: document.getElementById('loading'),
      tooltip: document.getElementById('tooltip'),
      shortcutsPanel: document.getElementById('shortcuts-help')
    };
    
    this.doc = null;
    this.autoSaveTimer = null;
    
    this.init();
  }

  // Initialize the application
  init() {
    this.configureElements();
    this.configureShortcuts();
    this.configureButtons();
    this.setupAutoSave();
    this.setupAccessibility();
    
    // Hide Twitter button if disabled
    if (!this.options.twitter) {
      const twitterBtn = document.querySelector('.twitter');
      if (twitterBtn) twitterBtn.style.display = 'none';
    }
    
    console.log(`${this.appName} initialized successfully`);
  }

  // Configure DOM elements
  configureElements() {
    // Add classes for theme
    document.body.classList.add(`theme-${this.options.theme}`);
    
    // Setup textarea placeholder and attributes
    if (this.elements.textarea) {
      this.elements.textarea.addEventListener('input', this.handleTextareaInput.bind(this));
      this.elements.textarea.addEventListener('keydown', this.handleTabKey.bind(this));
    }
  }

  // Setup auto-save functionality
  setupAutoSave() {
    if (!this.options.autoSave) return;
    
    let autoSaveTimeout;
    const autoSaveDelay = this.options.autoSaveDelay || 2000;
    
    if (this.elements.textarea) {
      this.elements.textarea.addEventListener('input', () => {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
          if (this.currentDocument && this.elements.textarea.value.trim()) {
            this.handleAction('save');
          }
        }, autoSaveDelay);
      });
    }
  }

  // Setup accessibility features
  setupAccessibility() {
    // Add ARIA labels and roles
    if (this.elements.textarea) {
      this.elements.textarea.setAttribute('role', 'textbox');
      this.elements.textarea.setAttribute('aria-multiline', 'true');
    }
    
    // Setup keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        this.toggleShortcutsPanel();
      }
    });
  }

  // Set the page title
  setTitle(ext = null) {
    const title = ext ? `${this.appName} - ${ext}` : this.appName;
    document.title = title;
  }

  // Show a toast message
  showMessage(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    
    this.elements.messages.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 4000);
  }

  // Show loading state
  showLoading() {
    if (this.elements.loading) {
      this.elements.loading.classList.add('active');
    }
  }

  // Hide loading state
  hideLoading() {
    if (this.elements.loading) {
      this.elements.loading.classList.remove('active');
    }
  }

  // Configure which buttons are enabled for editing
  lightKey() {
    this.configureKey(['new', 'save']);
  }

  // Configure which buttons are enabled for viewing
  fullKey() {
    this.configureKey(['new', 'duplicate', 'twitter', 'raw']);
  }

  // Enable/disable buttons based on current state
  configureKey(enabledActions) {
    const buttons = document.querySelectorAll('.function');
    buttons.forEach(button => {
      const hasEnabledAction = enabledActions.some(action => 
        button.classList.contains(action)
      );
      
      if (hasEnabledAction) {
        button.classList.add('enabled');
        button.disabled = false;
      } else {
        button.classList.remove('enabled');
        button.disabled = true;
      }
    });
  }

  // Create a new document
  async newDocument(hideHistory = false) {
    this.hideCodeDisplay();
    this.doc = new DaisyDocument();
    
    if (!hideHistory) {
      window.history.pushState(null, this.appName, '/');
    }
    
    this.setTitle();
    this.lightKey();
    this.showTextarea();
    this.removeLineNumbers();
    this.clearAutoSave();
  }

  // Show textarea for editing
  showTextarea() {
    if (this.elements.textarea) {
      this.elements.textarea.value = '';
      this.elements.textarea.style.display = 'block';
      this.elements.textarea.focus();
    }
  }

  // Hide textarea
  hideTextarea() {
    if (this.elements.textarea) {
      this.elements.textarea.style.display = 'none';
    }
  }

  // Show code display
  showCodeDisplay() {
    if (this.elements.codeDisplay) {
      this.elements.codeDisplay.style.display = 'block';
    }
  }

  // Hide code display
  hideCodeDisplay() {
    if (this.elements.codeDisplay) {
      this.elements.codeDisplay.style.display = 'none';
    }
  }

  // Map of common file extensions to language identifiers
  static get extensionMap() {
    return {
      rb: 'ruby',
      py: 'python',
      pl: 'perl',
      php: 'php',
      scala: 'scala',
      go: 'go',
      xml: 'xml',
      html: 'xml',
      htm: 'xml',
      css: 'css',
      js: 'javascript',
      ts: 'typescript',
      jsx: 'javascript',
      tsx: 'typescript',
      vbs: 'vbscript',
      lua: 'lua',
      pas: 'delphi',
      java: 'java',
      cpp: 'cpp',
      cc: 'cpp',
      c: 'c',
      h: 'c',
      hpp: 'cpp',
      m: 'objectivec',
      vala: 'vala',
      sql: 'sql',
      sm: 'smalltalk',
      lisp: 'lisp',
      ini: 'ini',
      diff: 'diff',
      bash: 'bash',
      sh: 'bash',
      tex: 'tex',
      erl: 'erlang',
      hs: 'haskell',
      md: 'markdown',
      txt: '',
      coffee: 'coffeescript',
      json: 'json',
      swift: 'swift',
      rs: 'rust',
      kt: 'kotlin',
      dart: 'dart',
      vue: 'vue',
      yml: 'yaml',
      yaml: 'yaml',
      toml: 'toml'
    };
  }

  // Look up file extension for a given language
  lookupExtensionByType(type) {
    const extensionMap = DaisyPaste.extensionMap;
    for (const [key, value] of Object.entries(extensionMap)) {
      if (value === type) return key;
    }
    return type;
  }

  // Look up language for a given file extension
  lookupTypeByExtension(ext) {
    return DaisyPaste.extensionMap[ext] || ext;
  }

  // Add line numbers to the display
  addLineNumbers(lineCount) {
    if (!this.elements.lineNumbers) return;
    
    let html = '';
    for (let i = 1; i <= lineCount; i++) {
      html += `${i}<br/>`;
    }
    this.elements.lineNumbers.innerHTML = html;
  }

  // Remove line numbers (show prompt)
  removeLineNumbers() {
    if (this.elements.lineNumbers) {
      this.elements.lineNumbers.innerHTML = '&gt;';
    }
  }

  // Load and display a document
  async loadDocument(key) {
    try {
      this.showLoading();
      
      // Split key to get extension
      const parts = key.split('.', 2);
      const documentKey = parts[0];
      const extension = parts[1] || null;
      
      this.doc = new DaisyDocument();
      const result = await this.doc.load(documentKey, this.lookupTypeByExtension(extension));
      
      if (result) {
        this.elements.codeContent.innerHTML = result.value;
        this.setTitle(result.key);
        this.fullKey();
        this.hideTextarea();
        this.showCodeDisplay();
        this.elements.codeDisplay.focus();
        this.addLineNumbers(result.lineCount);
        
        // Show document info
        this.showMessage(
          `Loaded ${result.language || 'text'} document (${Utils.formatFileSize(result.size)})`,
          'success'
        );
      } else {
        throw new Error('Document not found');
      }
    } catch (error) {
      console.error('Failed to load document:', error);
      this.showMessage('Document not found or failed to load', 'error');
      this.newDocument();
    } finally {
      this.hideLoading();
    }
  }

  // Duplicate current document for editing
  async duplicateDocument() {
    if (this.doc && this.doc.locked && this.doc.data) {
      await this.newDocument();
      if (this.elements.textarea) {
        this.elements.textarea.value = this.doc.data;
        this.elements.textarea.focus();
      }
      this.showMessage('Document duplicated for editing', 'info');
    }
  }

  // Save and lock the current document
  async lockDocument() {
    if (!this.elements.textarea || !this.doc) return;
    
    const content = this.elements.textarea.value.trim();
    if (!content) {
      this.showMessage('Cannot save empty document', 'error');
      return;
    }

    try {
      this.showLoading();
      
      const result = await this.doc.save(content);
      
      if (result) {
        this.elements.codeContent.innerHTML = result.value;
        this.setTitle(result.key);
        
        // Update URL
        let url = `/${result.key}`;
        if (result.language) {
          url += `.${this.lookupExtensionByType(result.language)}`;
        }
        
        window.history.pushState(null, `${this.appName} - ${result.key}`, url);
        
        this.fullKey();
        this.hideTextarea();
        this.showCodeDisplay();
        this.elements.codeDisplay.focus();
        this.addLineNumbers(result.lineCount);
        
        this.showMessage(
          `Saved as ${result.language || 'text'} document (${Utils.formatFileSize(result.size)})`,
          'success'
        );
        
        this.clearAutoSave();
      }
    } catch (error) {
      console.error('Failed to save document:', error);
      this.showMessage(error.message || 'Failed to save document', 'error');
    } finally {
      this.hideLoading();
    }
  }

  // Configure button event listeners and shortcuts
  configureButtons() {
    this.buttons = [
      {
        selector: '.save',
        label: 'Save',
        shortcutDescription: 'Ctrl + S',
        shortcut: (evt) => evt.ctrlKey && evt.key === 's',
        action: () => {
          if (this.elements.textarea?.value.trim()) {
            this.lockDocument();
          }
        }
      },
      {
        selector: '.new',
        label: 'New',
        shortcutDescription: 'Ctrl + N',
        shortcut: (evt) => evt.ctrlKey && evt.key === 'n',
        action: () => {
          this.newDocument(!this.doc?.key);
        }
      },
      {
        selector: '.duplicate',
        label: 'Duplicate & Edit',
        shortcutDescription: 'Ctrl + D',
        shortcut: (evt) => this.doc?.locked && evt.ctrlKey && evt.key === 'd',
        action: () => {
          this.duplicateDocument();
        }
      },
      {
        selector: '.raw',
        label: 'View Raw',
        shortcutDescription: 'Ctrl + Shift + R',
        shortcut: (evt) => evt.ctrlKey && evt.shiftKey && evt.key === 'R',
        action: () => {
          if (this.doc?.key) {
            window.location.href = `/raw/${this.doc.key}`;
          }
        }
      },
      {
        selector: '.twitter',
        label: 'Share',
        shortcutDescription: 'Ctrl + Shift + T',
        shortcut: (evt) => this.options.twitter && this.doc?.locked && evt.ctrlKey && evt.shiftKey && evt.key === 'T',
        action: () => {
          const url = encodeURIComponent(window.location.href);
          const text = encodeURIComponent(`Check out this code on ${this.appName}`);
          window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
        }
      }
    ];

    this.buttons.forEach(button => this.configureButton(button));
  }

  // Configure individual button
  configureButton(buttonConfig) {
    const element = document.querySelector(buttonConfig.selector);
    if (!element) return;

    // Click handler
    element.addEventListener('click', (evt) => {
      evt.preventDefault();
      if (element.classList.contains('enabled') && !element.disabled) {
        buttonConfig.action();
      }
    });

    // Tooltip handlers
    element.addEventListener('mouseenter', (evt) => {
      this.showTooltip(evt.target, buttonConfig.label, buttonConfig.shortcutDescription);
    });

    element.addEventListener('mouseleave', () => {
      this.hideTooltip();
    });
  }

  // Show tooltip
  showTooltip(target, label, shortcut) {
    if (!this.elements.tooltip) return;

    const tooltip = this.elements.tooltip;
    const labelEl = tooltip.querySelector('.tooltip-label');
    const shortcutEl = tooltip.querySelector('.tooltip-shortcut');

    if (labelEl) labelEl.textContent = label;
    if (shortcutEl) shortcutEl.textContent = shortcut || '';

    const rect = target.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.bottom + 8}px`;
    tooltip.classList.add('show');
  }

  // Hide tooltip
  hideTooltip() {
    if (this.elements.tooltip) {
      this.elements.tooltip.classList.remove('show');
    }
  }

  // Configure keyboard shortcuts
  configureShortcuts() {
    document.addEventListener('keydown', (evt) => {
      // Prevent shortcuts when typing in inputs
      if (evt.target.tagName === 'INPUT' || evt.target.tagName === 'TEXTAREA') {
        return;
      }

      for (const button of this.buttons) {
        if (button.shortcut && button.shortcut(evt)) {
          evt.preventDefault();
          button.action();
          return;
        }
      }
    });
  }

  // Handle textarea input with debounced auto-save
  handleTextareaInput(evt) {
    if (this.options.autoSave) {
      this.scheduleAutoSave();
    }
  }

  // Handle tab key in textarea (insert 2 spaces)
  handleTabKey(evt) {
    if (evt.key === 'Tab') {
      evt.preventDefault();
      
      const textarea = evt.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = '  ';
      
      textarea.value = textarea.value.substring(0, start) + spaces + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
    }
  }

  // Auto-save functionality
  scheduleAutoSave() {
    this.clearAutoSave();
    this.autoSaveTimer = setTimeout(() => {
      this.performAutoSave();
    }, this.options.autoSaveDelay);
  }

  clearAutoSave() {
    if (this.autoSaveTimer) {
      clearTimeout(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  async performAutoSave() {
    if (!this.elements.textarea || !this.elements.textarea.value.trim()) return;
    
    try {
      // Create a temporary document for auto-save
      const tempDoc = new DaisyDocument();
      await tempDoc.save(this.elements.textarea.value);
      
      // Update current document but don't change UI state
      this.doc = tempDoc;
      console.log('Auto-saved document:', tempDoc.key);
    } catch (error) {
      console.warn('Auto-save failed:', error);
    }
  }

  // Toggle shortcuts panel
  toggleShortcutsPanel() {
    if (!this.elements.shortcutsPanel) return;
    
    this.elements.shortcutsPanel.classList.toggle('show');
  }
}

// Make DaisyPaste globally available for backward compatibility
window.DaisyPaste = DaisyPaste;
