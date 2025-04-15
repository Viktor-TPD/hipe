# Hipe - YRGO Event Matching Platform

Hipe is a web application designed to connect Digital Design (DD) and Web Development (WU) students from YRGO with potential employers during a LIA event. The platform allows students to showcase their skills and portfolios while companies can browse and save students they're interested in for internships and job opportunities.

![Hipe Platform](https://placeholder-image.com/hipe-screenshot.png)

## Features

### For Students:
- Create and customize detailed profile showcasing skills, portfolio links, and specializations
- Upload a picture of yourself to be more memorable
- Browse and view company profiles
- See which companies have saved your profile
- Responsive design for all devices

### For Companies:
- Create company profiles with industry details, internship offerings, and contact information
- Upload a profile picture/company logo
- Browse student profiles with advanced filtering options
- Save interesting candidates to a favorites list
- Direct access to student portfolios and contact information

### General Features:
- Secure authentication system with user-specific views
- Responsive design that works across desktop, tablet, and mobile devices
- Real-time profile updates
- Easy-to-use interface for browsing and connecting

## Technology Stack

### Frontend
- React 
- React Router
- CSS for styling
- Vite for build and development

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- AWS S3 for image storage

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- AWS S3 bucket for image storage
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/hipe.git
cd hipe
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory and configure the following variables:
```
DB_USER=your_mongodb_username
DB_PASSWORD=your_mongodb_password
DB_CON=your_mongodb_connection_string
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET=your_s3_bucket_name
NODE_ENV=development
```

4. Start the development server
```bash
npm run dev
```

5. For production builds
```bash
npm run build
npm start
```

## Project Structure

```
.
├── index.js                 # Server entry point
├── package.json             # Dependencies and scripts
├── public/                  # Static assets
├── models/                  # MongoDB schemas
├── routes/                  # API routes
├── src/                     # React frontend
│   ├── App.jsx              # Main application component
│   ├── components/          # React components
│   ├── styles/              # CSS files
│   ├── context/             # React contexts
│   └── hooks/               # Custom React hooks
└── .env                     # Environment variables (not in repo)
```

## API Routes

The application provides the following RESTful API endpoints:

### Authentication Routes
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/verify` - Verify user session
- `POST /api/v1/auth/logout` - Logout user

### Student Profile Routes
- `GET /api/v1/students` - Get all student profiles (with optional filters)
- `GET /api/v1/students/:id` - Get a specific student profile
- `POST /api/v1/students` - Create a new student profile
- `PUT /api/v1/students/:id` - Update a student profile
- `DELETE /api/v1/students/:id` - Delete a student profile

### Company Profile Routes
- `GET /api/v1/companies` - Get all company profiles
- `GET /api/v1/companies/:id` - Get a specific company profile
- `POST /api/v1/companies` - Create a new company profile
- `PUT /api/v1/companies/:id` - Update a company profile
- `DELETE /api/v1/companies/:id` - Delete a company profile

### Likes Routes
- `GET /api/v1/likes` - Get all likes with optional filtering
- `POST /api/v1/likes` - Create a new like or delete if exists
- `GET /api/v1/likes/student/:studentId` - Get all companies that liked a student
- `GET /api/v1/likes/company/:companyId` - Get all students liked by a company

## Contributing

If you'd like to contribute to this project, please fork the repository and submit a pull request. You can also open issues for bugs or feature requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Created for YRGO's LIA event
- Built by Julia Lyngfelt & Viktor Tohver Stridh

---