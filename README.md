# 🤖 InnerWhispers - Modern Ai-Blogging Platform

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.7.4-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6.26.1-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.18.2-0055FF?style=for-the-badge&logo=framer&logoColor=white)

**A cyberpunk-themed social blogging platform for AI, Tech, and Gaming enthusiasts**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Integration](#-api-integration) • [License](#-license)

</div>

---

## 📖 About

**InnerWhispers** is a modern, full-featured blogging platform with a futuristic cyberpunk aesthetic. Built with React, it provides a seamless experience for users to create, share, and engage with content focused on AI, Technology, and Gaming.

### 🎯 Project Vision

InnerWhispers aims to create a vibrant community where tech enthusiasts can:
- Share insights on AI and Machine Learning
- Discuss the latest gaming trends
- Write tutorials and reviews
- Connect with like-minded individuals
- Engage through likes, comments, and follows

---

## ✨ Features

### 🔐 Authentication & User Management
- **Secure Authentication**: JWT-based authentication system
- **User Registration & Login**: Email and password-based authentication
- **Profile Management**: Customizable user profiles with avatars
- **Session Persistence**: Auto-login with token validation

### 📝 Blog Management
- **Rich Content Creation**: Write blogs with Markdown support
- **Draft & Publish**: Save drafts or publish immediately
- **Cover Images**: Add custom cover images to blogs
- **Tag System**: Organize content with up to 5 tags per blog
- **AI Assistant (Coming Soon)**: AI-powered writing suggestions

### 🎨 User Interface
- **Cyberpunk Theme**: Modern, futuristic design aesthetic
- **Responsive Design**: Fully responsive across all devices
- **Smooth Animations**: Powered by Framer Motion
- **Dark Mode**: Eye-friendly dark theme by default
- **Interactive Components**: Engaging user interactions

### 📱 Social Features
- **Like System**: Like and unlike blogs
- **Comments**: Threaded comment system with replies
- **User Profiles**: View detailed user profiles
- **Follow/Unfollow**: Build your network
- **User Search**: Find and connect with other users
- **Activity Feed**: Stay updated with latest posts

### 🔍 Discovery
- **Explore Page**: Discover new content and creators
- **Filter Options**: Latest, Trending, and Following feeds
- **User Search**: Find users by username
- **Tag-based Navigation**: Browse content by topics

### 📊 Engagement
- **View Counts**: Track blog views
- **Like Counts**: See engagement metrics
- **Comment Counts**: Measure discussions
- **Share Functionality**: Copy blog links to clipboard

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.3.1** - Modern UI library
- **React Router DOM 6.26.1** - Client-side routing
- **React Icons 5.5.0** - Icon library

### State Management & Context
- **React Context API** - AuthContext for authentication
- **ToastContext** - Custom toast notification system

### Styling & Animation
- **CSS3** - Custom styling with cyberpunk theme
- **Framer Motion 11.18.2** - Smooth animations and transitions

### HTTP & API
- **Axios 1.7.4** - HTTP client with interceptors
- **REST API Integration** - Backend API communication

### Additional Libraries
- **React Markdown 9.1.0** - Render Markdown content
- **Web Vitals 2.1.4** - Performance metrics

### Development Tools
- **React Scripts 5.0.1** - Build tooling
- **Testing Library** - Unit and integration testing

---

## 📦 Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- Backend API server running

### Step 1: Clone the Repository
```bash
git clone https://github.com/JeetInTech/Social-Media-frontend.git
cd Social-Media-frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:8000
```

### Step 4: Start Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

---

## 🚀 Usage

### Development
```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm build
```

### Production Build
```bash
# Create optimized production build
npm run build

# The build folder will contain the production-ready files
```

---

## 🌐 API Integration

### API Configuration
The application uses Axios with interceptors for API communication. Configuration is in `src/utils/api.js`.

### Key API Endpoints

#### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

#### Blogs
- `GET /blogs/` - Get all blogs
- `GET /blogs/:id` - Get single blog
- `POST /blogs/` - Create blog
- `PUT /blogs/:id` - Update blog
- `DELETE /blogs/:id` - Delete blog
- `POST /blogs/:id/view` - Record view
- `POST /blogs/:id/like` - Like blog
- `DELETE /blogs/:id/like` - Unlike blog

#### Profiles
- `GET /profiles/:username` - Get user profile
- `PUT /profiles/me` - Update own profile
- `GET /profiles/:username/blogs` - Get user's blogs
- `POST /profiles/:username/follow` - Follow user
- `DELETE /profiles/:username/follow` - Unfollow user
- `GET /profiles/:username/followers` - Get followers
- `GET /profiles/:username/following` - Get following
- `GET /profiles/search/users` - Search users

#### Comments
- `GET /comments/blog/:blogId` - Get blog comments
- `POST /comments/` - Create comment
- `PUT /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment

### Token Management
- JWT tokens are stored in `localStorage`
- Automatic token injection via Axios interceptors
- Auto-redirect to login on 401 errors

---

## 📂 Project Structure

```
frontend/
├── public/                 # Static files
│   ├── index.html         # HTML template
│   ├── manifest.json      # PWA manifest
│   └── robots.txt         # SEO robots file
├── src/
│   ├── components/        # Reusable components
│   │   ├── Navbar.js      # Navigation bar
│   │   ├── Toast.js       # Toast notifications
│   │   ├── ToastContext.js # Toast state management
│   │   └── UserSearch.js  # User search component
│   ├── context/           # React Context
│   │   └── AuthContext.js # Authentication context
│   ├── pages/             # Page components
│   │   ├── Home.js        # Main feed
│   │   ├── Write.js       # Create blog
│   │   ├── EditBlog.js    # Edit blog
│   │   ├── BlogDetail.js  # Single blog view
│   │   ├── Profile.js     # User profile
│   │   ├── Explore.js     # Discovery page
│   │   ├── Login.js       # Login page
│   │   └── Register.js    # Registration page
│   ├── utils/             # Utility functions
│   │   └── api.js         # API client
│   ├── App.js             # Main app component
│   └── index.js           # Entry point
├── package.json           # Dependencies
└── README.md             # This file
```

---

## 🎨 Features Showcase

### Blog Creation
- **Markdown Support**: Write content with Markdown syntax
- **Live Preview**: Preview mode before publishing
- **Tag Selection**: Choose from predefined tags
- **Cover Images**: Add visual appeal to your blogs

### User Profiles
- **Author Information**: Display username and avatar
- **Bio & Links**: Add personal information
- **Blog History**: View all blogs by a user
- **Follower Stats**: Track followers and following

### Engagement System
- **Real-time Updates**: Instant like/comment count updates
- **Interactive UI**: Smooth animations on interactions
- **Toast Notifications**: User-friendly feedback system

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Authenticated-only pages
- **Token Validation**: Auto-validation on app load
- **Secure Storage**: LocalStorage for token persistence
- **CORS Handling**: Proper cross-origin configuration
- **Input Validation**: Client-side validation

---

## 🌟 Key Highlights

### Performance
- ⚡ Fast initial load time
- 🔄 Optimized re-renders
- 📦 Code splitting ready
- 🎯 Efficient state management

### User Experience
- 🎨 Beautiful cyberpunk design
- 📱 Mobile-first responsive design
- ♿ Accessible components
- 🌐 SEO-friendly structure

### Developer Experience
- 📝 Clean, maintainable code
- 🔧 Easy to extend and customize
- 📚 Well-documented
- 🧪 Test-ready setup

---

## 🐛 Known Issues & Limitations

- AI Writing Assistant feature is under development
- Trending feed algorithm needs backend implementation
- Following feed requires backend filtering

---

## 🔮 Future Enhancements

- [ ] AI-powered writing assistance
- [ ] Rich text editor (WYSIWYG)
- [ ] Image upload functionality
- [ ] Notification system
- [ ] Bookmarking feature
- [ ] Advanced search and filters
- [ ] Email notifications
- [ ] PWA support
- [ ] Dark/Light theme toggle
- [ ] Multi-language support

---

## 🤝 Contributing

This project is proprietary and not open for external contributions. See [LICENSE](LICENSE) for details.

---

## 📧 Contact

**Project Owner**: JeetInTech
- GitHub: [@JeetInTech](https://github.com/JeetInTech)
- Repository: [Social-Media-frontend](https://github.com/JeetInTech/Social-Media-frontend)

---

## 📄 License

**Copyright © 2025 JeetInTech. All Rights Reserved.**

This project is proprietary and confidential. Unauthorized copying, distribution, modification, or use of this software is strictly prohibited. See the [LICENSE](LICENSE) file for complete terms.

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Framer Motion for smooth animations
- The cyberpunk aesthetic community for design inspiration

---

<div align="center">

**Built with ❤️ by JeetInTech**

⭐ **Star this repository if you find it interesting!** ⭐

</div>
