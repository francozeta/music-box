# MusicBox

![Music Box Preview](/public/cover-demo.png)

A modern web application for music streaming and playlist management built with Next.js and TypeScript.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 🎵 Music streaming capabilities
- 📱 Responsive design for all devices
- 🎨 Modern and intuitive user interface
- 💾 Local storage for user preferences
- 🔄 Real-time updates
- 🎯 Custom audio controls
- 📂 Playlist management

## 🛠️ Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript (63.0%)
- **Styling:** CSS/Tailwind CSS (17.0%)
- **State Management:** React Hooks
- **UI Components:** Custom components with Radix UI
- **Code Quality:** ESLint, Prettier
- **Version Control:** Git

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/francozeta/music-box.git
```

2. Navigate to the project directory:
```bash
cd music-box
```

3. Install dependencies:
```bash
pnpm install
```

4. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

5. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
music-box/
├── app/                   # Next.js app directory
├── components/            # Reusable UI components
├── constants/             # Application constants
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and libraries
├── public/                # Static assets
├── .eslintrc.json         # ESLint configuration
├── .gitignore             # Git ignore rules
├── next.config.js         # Next.js configuration
├── package.json           # Project dependencies
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## ⚙️ Configuration

The project uses various configuration files:

- `.eslintrc.json` - ESLint rules
- `tailwind.config.js` - Tailwind CSS customization
- `next.config.js` - Next.js settings
- `tsconfig.json` - TypeScript compiler options

## 💻 Development

To start development:

1. Run the development server:
```bash
pnpm dev
```

2. For code formatting:
```bash
pnpm format
```

3. To check for linting errors:
```bash
pnpm lint
```

4. To build for production:
```bash
pnpm build
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Franco Zeta](https://github.com/francozeta)