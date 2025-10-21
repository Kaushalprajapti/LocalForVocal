# LocalForVocal - E-Commerce Platform

A modern, full-stack e-commerce platform built for local businesses to showcase and sell their products online. This project includes both frontend and backend components with comprehensive documentation.

## 🚀 Project Overview

LocalForVocal is designed to help local businesses establish their online presence with a user-friendly e-commerce platform. The application features both customer-facing and admin interfaces for managing products, orders, and business operations.

### Key Features

- **Customer Features**:
  - Browse products with advanced filtering and search
  - Shopping cart with persistent storage
  - Favorites system for saving products
  - Quick view modal for product previews
  - Order placement and tracking
  - Responsive design for all devices

- **Admin Features**:
  - Product management (CRUD operations)
  - Category management
  - Order management and status updates
  - Analytics dashboard
  - User management
  - Inventory tracking

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Query** for server state management
- **React Router DOM** for routing
- **React Hook Form** for form handling
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Cloudinary** for image storage
- **Multer** for file uploads
- **Bcrypt** for password hashing
- **Express Rate Limit** for API protection

## 📁 Project Structure

```
LocalForVocal/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── routes/         # Route definitions
│   ├── public/             # Static assets
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/                 # Node.js backend application
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/           # Configuration files
│   ├── utils/            # Utility functions
│   ├── package.json
│   └── server.js
├── docs/                  # Documentation files
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for image storage)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Kaushalprajapti/LocalForVocal.git
   cd LocalForVocal
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your configuration
   
   # Start the backend server
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your configuration
   
   # Start the frontend development server
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[Frontend README](frontend/README.md)** - Frontend-specific documentation
- **[Frontend Architecture](frontend/ARCHITECTURE.md)** - Technical architecture overview
- **[API Integration](frontend/API_INTEGRATION.md)** - API integration patterns
- **[Component Guide](frontend/COMPONENT_GUIDE.md)** - Component documentation
- **[State Management](frontend/STATE_MANAGEMENT.md)** - State management patterns
- **[Styling Guide](frontend/STYLING_GUIDE.md)** - Design system and styling
- **[Development Guide](frontend/DEVELOPMENT_GUIDE.md)** - Development guidelines
- **[Deployment Guide](frontend/DEPLOYMENT_GUIDE.md)** - Deployment instructions

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/localforvocal
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=10000
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
The backend can be deployed to platforms like:
- Heroku
- Railway
- DigitalOcean
- AWS EC2
- Google Cloud Platform

### Frontend Deployment
The frontend can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

Detailed deployment instructions are available in the [Deployment Guide](frontend/DEPLOYMENT_GUIDE.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation files
- Contact the development team

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Complete e-commerce functionality
- Admin panel
- Responsive design
- TypeScript implementation
- Comprehensive documentation

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the database solution
- Cloudinary for image storage
- All contributors and testers

---

**Built with ❤️ for local businesses**
