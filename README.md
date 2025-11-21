# DaisyPaste 🌸

DaisyPaste is a modern, beautiful, and secure pastebin application powered by [Cloudflare Workers](https://workers.cloudflare.com).
It features a stunning pink/purple gradient theme, glassmorphism UI, and syntax highlighting for code snippets.

Based on the original `serverless-bin` project, DaisyPaste has been completely revamped with:

- **Modern UI:** A fresh, cute, and responsive design using CSS Variables and Flexbox.
- **Modern Tech:** ES6+ JavaScript, FontAwesome icons, and Google Fonts (Inter & Fira Code).
- **Secure:** Uses `crypto.randomUUID()` for secure document ID generation.
- **Fast:** Lightweight and optimized for Cloudflare Pages & Workers.

## Features

- ✨ Beautiful Pink/Purple Gradient Theme
- 🌙 Custom "Daisy Theme" Syntax Highlighting (Dracula-inspired)
- 📱 Fully Responsive Design
- 🔒 Secure Backend
- ⚡ Serverless Architecture

## Deployment

To deploy it to your own instance, do the following:

1. Clone the repository
2. Create a KV Namespace inside your Cloudflare Workers dashboard
3. Deploy the project to Cloudflare Pages
4. Inside **Pages > Your Project > Settings > Functions**, add a KV binding:
   - Variable Name: `FILES_KV`
   - Value: Select your created KV Namespace

## Credits

Original serverless-bin logic by [codebam](https://github.com/codebam/serverless-bin).
UI & UX overhaul by DaisyPaste Team.
