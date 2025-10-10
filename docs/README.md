# React Flow Rule Engine Documentation

This documentation is built with [Nextra](https://nextra.site/), a powerful documentation framework built on top of Next.js.

## 🚀 Features

- **Modern Design**: Clean, responsive design with dark/light mode
- **Interactive Navigation**: Collapsible sidebar with search functionality
- **MDX Support**: Write documentation in Markdown with React components
- **SEO Optimized**: Built-in SEO features and meta tags
- **Fast Performance**: Optimized for speed and performance

## 📁 Structure

```
docs/
├── pages/                 # Documentation pages
│   ├── index.mdx         # Home page
│   ├── getting-started.mdx
│   ├── sidebar-controls.mdx
│   ├── node-types.mdx
│   ├── validation-system.mdx
│   ├── minimap-controls.mdx
│   ├── json-export.mdx
│   ├── workflow-guide.mdx
│   ├── troubleshooting.mdx
│   ├── _meta.json        # Navigation configuration
│   ├── _app.tsx         # App wrapper
│   ├── 404.tsx          # Custom 404 page
│   ├── 500.tsx          # Custom 500 page
│   └── _error.tsx       # Error page
├── nextra.config.ts      # Nextra configuration
└── package.json         # Dependencies
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd docs
npm install
```

### Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm run start
```

### Export Static Site

```bash
npm run export
```

## 🎨 Customization

### Theme Configuration

Edit `nextra.config.ts` to customize:

- Logo and branding
- Navigation structure
- Search functionality
- Footer content
- Color scheme

### Adding Pages

1. Create new `.mdx` file in `pages/` directory
2. Add entry to `_meta.json` for navigation
3. Use MDX syntax for content

### Custom Components

You can use React components in your MDX files:

```mdx
import { Button } from "./components/Button";

# My Page

<Button>Click me</Button>
```

## 📝 Writing Documentation

### MDX Syntax

- Use standard Markdown syntax
- Embed React components
- Use frontmatter for page metadata

### Best Practices

- Use descriptive headings
- Include code examples
- Add interactive elements
- Keep content scannable
- Use consistent formatting

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `out`
4. Deploy automatically

### Netlify

1. Connect your repository
2. Set build command: `npm run build && npm run export`
3. Set publish directory: `out`
4. Deploy

### Static Hosting

1. Run `npm run export`
2. Upload `out` directory to your hosting provider
3. Configure redirects for SPA routing

## 🔧 Configuration

### Nextra Config

The `nextra.config.ts` file contains:

- Theme configuration
- Navigation settings
- SEO meta tags
- Custom styling

### Package Scripts

- `dev`: Development server
- `build`: Production build
- `start`: Production server
- `export`: Static export

## 📚 Resources

- [Nextra Documentation](https://nextra.site/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MDX Documentation](https://mdxjs.com/)
- [React Documentation](https://reactjs.org/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📄 License

This documentation is part of the React Flow Rule Engine project.
