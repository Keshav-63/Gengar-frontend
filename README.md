# Cloud File Storage - Modern React Frontend

A high-performance, modern cloud file storage dashboard built with **React + Vite + TypeScript**. Features a beautiful dark theme inspired by Render.com's design system.

## 🚀 Features

- **Authentication**: User registration and login with JWT tokens
- **File Management**: Upload, download, delete, rename, and move files
- **Folder Organization**: Create, manage, and navigate folder hierarchies
- **File Sharing**: Share files and folders with customizable permissions
- **Storage Monitoring**: Real-time storage usage visualization
- **Performance Optimized**: Uses React Window virtualization, memoization, and concurrent rendering
- **Beautiful UI**: Dark theme with glassmorphism effects and smooth animations

## 🛠️ Tech Stack

- **React 18.3** - UI framework
- **Vite 5.0** - Build tool and dev server
- **TypeScript 5.2** - Type safety
- **Zustand 4.4** - State management
- **Axios 1.6** - HTTP client
- **Lucide React 0.294** - Icons
- **React Window 1.8** - Virtual list rendering
- **React Router DOM 6.20** - Client-side routing

## 📦 Project Structure

```
src/
├── api/                   # API integration layer
│   ├── client.ts         # Axios instance with interceptors
│   ├── auth.ts           # Authentication endpoints
│   ├── files.ts          # File management endpoints
│   ├── folders.ts        # Folder management endpoints
│   ├── sharing.ts        # Sharing endpoints
│   └── shortUrls.ts      # Short URL endpoints
├── components/           # React components
│   ├── common/          # Reusable UI components
│   ├── layout/          # Layout components
│   ├── files/           # File-related components
│   ├── folders/         # Folder-related components
│   ├── sharing/         # Sharing-related components
│   └── storage/         # Storage visualization
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication logic
│   ├── useFiles.ts      # File operations
│   ├── useFolders.ts    # Folder operations
│   ├── useDebounce.ts   # Debounce utility
│   └── useIntersectionObserver.ts
├── store/               # Zustand stores
│   ├── authStore.ts     # Auth state management
│   ├── fileStore.ts     # File state management
│   └── uiStore.ts       # UI state management
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
│   ├── formatters.ts    # File size, date, etc.
│   └── validators.ts    # Input validation
├── pages/               # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   └── Auth.css
├── App.tsx              # Main App component
├── main.tsx             # Entry point
└── index.css            # Global styles with design tokens
```

## 🎨 Design System

### Color Palette (Dark Theme)
- **Primary**: `#6366f1` (Indigo)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Error**: `#ef4444` (Red)
- **Background**: `#0d0d0d` (Deep Black)
- **Surface**: `#1a1a1a` (Card Background)

### Typography
- **Font**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI'
- **Sizes**: xs (12px) to 4xl (36px)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and pnpm or npm

### Installation

1. **Clone and Install Dependencies**
```bash
pnpm install
# or
npm install
```

2. **Set Environment Variables**
```bash
cp .env.example .env
# Edit .env and set your API_BASE_URL
```

3. **Start Development Server**
```bash
pnpm dev
# or
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production
```bash
pnpm build
# or
npm run build
```

## 📡 API Integration

The frontend expects a backend API running at `VITE_API_BASE_URL` (default: `http://localhost:8000`).

### Required API Endpoints

**Authentication**
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/auth/storage` - Get storage info
- `PUT /api/v1/auth/password` - Change password

**Files**
- `POST /api/v1/files/upload` - Request upload URL
- `POST /api/v1/files/upload/complete` - Complete upload
- `GET /api/v1/files/` - List files
- `GET /api/v1/files/{file_id}` - Get file details
- `GET /api/v1/files/{file_id}/download` - Get download URL
- `DELETE /api/v1/files/{file_id}` - Delete file
- `PUT /api/v1/files/{file_id}/move` - Move file
- `PUT /api/v1/files/{file_id}/rename` - Rename file

**Folders**
- `POST /api/v1/folders/` - Create folder
- `GET /api/v1/folders/` - List folders
- `GET /api/v1/folders/{folder_id}` - Get folder contents
- `GET /api/v1/folders/tree/all` - Get folder tree
- `PUT /api/v1/folders/{folder_id}/rename` - Rename folder
- `DELETE /api/v1/folders/{folder_id}` - Delete folder

**Sharing**
- `POST /api/v1/shares/` - Create share
- `GET /api/v1/shares/` - List shares
- `PUT /api/v1/shares/{share_id}` - Update share
- `DELETE /api/v1/shares/{share_id}` - Revoke share

## ⚡ Performance Optimizations

- **Component Memoization**: Use `React.memo` and `useCallback` to prevent unnecessary re-renders
- **Virtual Lists**: React Window for rendering large file lists efficiently
- **Debounced Search**: Debounce search inputs to reduce API calls
- **Code Splitting**: Route-based code splitting with React Router
- **Lazy Loading**: Images and heavy components loaded on demand
- **CSS Transforms**: GPU-accelerated animations for smooth 60fps performance

## 🔐 Authentication

- JWT token-based authentication
- Automatic token refresh on 401 responses
- Secure token storage in localStorage
- Protected routes redirect to login

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 768px and 1024px
- Touch-friendly UI components
- Optimized header and sidebar for mobile

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Use TypeScript for all new code
2. Follow the existing project structure
3. Use semantic HTML and ARIA attributes
4. Test components in different screen sizes
5. Ensure accessibility compliance

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🐛 Known Issues & Limitations

- File preview modal is not yet implemented
- Sharing permissions UI needs refinement
- Real-time collaboration features coming soon
- Search functionality needs backend integration

## 🎯 Future Enhancements

- [ ] File preview (images, documents, videos)
- [ ] Advanced file search with filters
- [ ] Bulk operations (delete, move, share)
- [ ] Activity log and version history
- [ ] Real-time notifications
- [ ] File compression status tracking
- [ ] Collaborative features
- [ ] Mobile app with React Native
