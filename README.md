
# 📚 Manga Web Store UI

<div align="center">
  <img src="./photo_2025-09-15_11-03-09.jpg" alt="Manga Web Store Cover" width="100%" style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
</div>

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.4.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0.6-FF6B35?style=for-the-badge&logo=react&logoColor=white)](https://zustand-demo.pmnd.rs/)

</div>

## 🌟 Overview

A modern, responsive e-commerce web application specialized in selling Arabic-translated manga. Built with cutting-edge technologies to provide a seamless shopping experience for manga enthusiasts.

**متجر إلكتروني متخصص في بيع المانغا المترجمة إلى العربية**

## ✨ Features

- 🛒 **Shopping Cart Management** - Add, remove, and manage manga volumes
- ❤️ **Wishlist System** - Save favorite manga for later
- 🔍 **Advanced Filtering** - Search by genre, availability, price range
- 📱 **Responsive Design** - Optimized for all devices
- 🎨 **Modern UI/UX** - Clean, intuitive interface with Arabic support
- 🔄 **Real-time Updates** - Dynamic content with server-side rendering
- 💳 **Order Management** - Track popular and low-stock items
- 🌊 **Smooth Scrolling** - Enhanced user experience with Lenis
- 🎠 **Interactive Carousels** - Swiper-powered image galleries
- 🔐 **Authentication System** - User registration and login

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15.4.2** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **tw-animate-css** - Animation utilities

### State Management
- **Zustand 5.0.6** - Lightweight state management
- **Zod 4.0.10** - Schema validation

### Enhanced UX
- **Swiper 11.2.10** - Modern touch slider
- **Lenis** - Smooth scrolling library
- **date-fns 4.1.0** - Date utility library

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Turbopack** - Fast bundler for development

## 🚀 Getting Started

### Prerequisites

- Node.js (18.x or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/redaezziani/manga-web-store-ui.git
   cd manga-web-store-ui
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── catalog/         # Manga catalog page
│   ├── volume/          # Individual volume pages
│   ├── wishlist/        # Wishlist management
│   ├── ui/              # Shared UI components
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # Reusable components
│   ├── auth/            # Authentication components
│   ├── manga/           # Manga-specific components
│   ├── navbar-components/ # Navigation components
│   ├── ui/              # UI primitives
│   └── wishlist/        # Wishlist components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
│   ├── currency.ts      # Currency formatting
│   ├── http-client.ts   # API client
│   ├── storage.ts       # Local storage utilities
│   └── utils.ts         # General utilities
├── stores/              # Zustand state stores
│   ├── cart-store.ts    # Shopping cart state
│   ├── user-store.ts    # User authentication
│   ├── wishlist-store.ts # Wishlist management
│   └── filter-store.ts  # Filtering state
└── types/               # TypeScript type definitions
```

## 🎨 Features in Detail

### 🛍️ Shopping Experience
- Browse latest manga releases
- View most ordered titles
- Check low-stock items
- Detailed volume information
- Price display with discounts

### 🔧 User Management
- User registration and authentication
- Personal wishlist management
- Shopping cart persistence
- Order history tracking

### 📱 Responsive Design
- Mobile-first approach
- Tablet and desktop optimization
- Arabic text support
- Custom fonts (Samsung Arabic, AlRai Media)

## 🌐 API Integration

The application integrates with a backend API running on `localhost:7000` with endpoints for:

- `/api/v1/volumes` - Volume listings
- `/api/v1/volumes/most-ordered` - Popular volumes
- `/api/v1/volumes/low-stock` - Low inventory items

## 🎯 Performance Features

- **Server-Side Rendering** with Next.js
- **Static Generation** for optimal performance
- **Image optimization** with Next.js Image component
- **Code splitting** and lazy loading
- **Caching strategies** with revalidation

## 🔧 Configuration

### Environment Setup
Configure your environment variables (create `.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:7000
```

### Tailwind Configuration
The project uses Tailwind CSS 4 with custom configuration for Arabic support and design system.

### TypeScript Configuration
Strict TypeScript configuration with path mapping for clean imports.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Reda Ezziani**
- GitHub: [@redaezziani](https://github.com/redaezziani)

## 🙏 Acknowledgments

- Arabic manga community for inspiration
- Open source libraries and their maintainers
- Design inspiration from modern e-commerce platforms

---

<div align="center">
  <p>Made with ❤️ for the Arabic manga community</p>
</div>
