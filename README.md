# My Portfolio Website

A modern, responsive personal portfolio website built with React, Vite, and Tailwind CSS. Features an interactive design with animations, project showcase, skills timeline, and contact form.

## Features

- 🎨 **Responsive Design** - Mobile-first approach with Tailwind CSS
- ✨ **Interactive Elements** - Smooth animations with floating nodes and cyber grid effects
- 🌍 **3D Globe** - Interactive earth globe using Cobe
- 📅 **Timeline** - Visual timeline of achievements and experience
- 🎓 **Skills & Certifications** - Showcase your skills and achievements
- 🌙 **Modern UI** - Clean, minimalist design with smooth transitions
- ⚡ **Fast Performance** - Built with Vite for optimal build and dev experience
- 📦 **Production Ready** - Configured for Vercel deployment

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS transformations
- **ESLint** - Code quality
- **Cobe** - 3D globe visualization

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/LokeshSitha/mywebsite.git
cd mywebsite
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

The optimized files will be in the `dist` directory.

### Preview

Preview the production build locally:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── AchievementCard.jsx      # Achievement display component
│   ├── CertificationCard.jsx    # Certification showcase
│   ├── ContactForm.jsx          # Contact form
│   ├── CyberGrid.jsx            # Animated grid background
│   ├── FloatingNodes.jsx        # Floating animation elements
│   ├── GlobeEarth.jsx           # 3D globe component
│   ├── Icons.jsx                # Icon components
│   ├── Navigation.jsx           # Navigation bar
│   ├── SkillCard.jsx            # Skill cards
│   ├── Timeline.jsx             # Timeline component
│   └── ui/
│       ├── CobeGlobe.tsx        # 3D globe using Cobe
│       └── wireframe-dotted-globe.tsx
├── App.jsx                      # Main app component
├── main.jsx                     # Entry point
├── App.css                      # Global styles
└── index.css                    # Base styles
```

## Configuration Files

- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS customization
- `postcss.config.js` - PostCSS configuration
- `eslint.config.js` - ESLint rules
- `vercel.json` - Vercel deployment configuration

## Deployment

### Vercel

This project is configured for automatic deployment to Vercel:

1. Push your code to GitHub, GitLab, or Bitbucket
2. Import the repository in your Vercel dashboard
3. Vercel will auto-detect the Vite configuration
4. Set your production branch (default: `main`)

Deployment settings:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Every push to your production branch will trigger an automatic deployment.

## Environment Variables

Create a `.env.local` file for local development (not committed to git):

```env
VITE_API_URL=http://localhost:3000
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Feel free to fork this project and submit pull requests for improvements.

## License

This project is open source and available under the MIT License.
