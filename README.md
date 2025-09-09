# Kanban Board Application

A full-stack Kanban board application built with React, TypeScript, Express.js, Prisma ORM, and PostgreSQL. This project demonstrates modern web development practices with a clean separation between frontend and backend, state management with Redux Toolkit, and database operations with Prisma.

## 🚀 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Redux Toolkit** for state management
- **Vite** for build tooling and development server
- **React Redux** for React-Redux integration
- **React Select** for enhanced UI components

### Backend
- **Express.js** REST API
- **Prisma ORM** for database operations
- **PostgreSQL** database
- **CORS** for cross-origin requests

### Development & Deployment
- **Docker** & **Docker Compose** for containerization
- **AWS EC2** for cloud deployment
- **ESLint** for code linting
- **TypeScript** for type safety
- **Concurrently** for running multiple processes

## ✨ Features

- **Board Management**: Create, read, update, and delete boards
- **Task Management**: Full CRUD operations for tasks
- **Task Status Tracking**: TODO, IN_PROGRESS, DONE status workflow
- **Real-time Updates**: Redux state management for reactive UI
- **Responsive Design**: Modern, clean interface
- **Type Safety**: Full TypeScript implementation
- **API Integration**: RESTful API with proper error handling

## 📁 Project Structure

```
prisma-express-redux-board/
├── src/
│   ├── components/           # React components
│   │   ├── v2/              # Latest component versions
│   │   │   ├── board.tsx    # Individual board view
│   │   │   ├── boards.tsx   # Boards list view
│   │   │   └── task.tsx     # Task components
│   │   └── kanban.tsx       # Main Kanban container
│   ├── store/               # Redux store configuration
│   │   ├── v2/              # Latest store implementation
│   │   │   ├── api/         # RTK Query API slices
│   │   │   └── slices/      # Redux slices
│   │   └── slices/          # Legacy Redux slices
│   ├── routes/              # Express.js API routes
│   │   ├── boards.js        # Board CRUD operations
│   │   ├── list.js          # List operations
│   │   └── task.js          # Task CRUD operations
│   ├── prisma.js            # Prisma client configuration
│   ├── server.js            # Express server setup
│   └── app.js               # Express app configuration
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── docker-compose.yml       # Docker services configuration
├── Dockerfile              # Docker image configuration
└── package.json            # Dependencies and scripts
```

## 🛠️ Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v13 or higher)
- **Docker** and **Docker Compose** (optional, for containerized setup)

## 📦 Installation & Setup

### Option 1: Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd prisma-express-redux-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/prisma_board"
   PORT=3000
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   ```

5. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start them separately:
   # Backend only
   npm run server
   
   # Frontend only
   npm run dev
   ```

### Option 2: Docker Setup

1. **Start the services**
   ```bash
   docker-compose up --build
   ```

2. **Run database migrations**
   ```bash
   docker-compose exec app npx prisma migrate dev
   ```

## 🚀 Running the Application

### Development Commands

```bash
# Start both frontend and backend concurrently
npm run dev:full

# Start only the Express server
npm run server

# Start only the Vite development server
npm run dev

# Build the application
npm run build

# Preview the production build
npm run preview

# Run ESLint
npm run lint
```

### Access Points

- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend API**: http://localhost:3000/api
- **Database**: localhost:5432 (PostgreSQL)

## 🔌 API Endpoints

### Boards
- `GET /api/boards` - Get all boards
- `GET /api/boards/:id` - Get board by ID
- `POST /api/boards` - Create new board
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Lists
- `GET /api/lists` - Get all lists
- `POST /api/lists` - Create new list
- `PUT /api/lists/:id` - Update list
- `DELETE /api/lists/:id` - Delete list

## 🗄️ Database Schema

The application uses PostgreSQL with the following schema:

### Board Model
```prisma
model Board {
  id        Int      @id @default(autoincrement())
  title     String
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Task Model
```prisma
model Task {
  id          Int        @id @default(autoincrement())
  title       String
  status      TaskStatus
  description String
  board       Board      @relation(fields: [boardId], references: [id], onDelete: Cascade)
  boardId     Int
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}
```

## 🐳 Docker Support

The application includes Docker configuration for easy deployment:

- **PostgreSQL Database**: Pre-configured with persistent storage
- **Application Container**: Includes both frontend and backend
- **Environment Variables**: Configured for containerized environment

To run with Docker:
```bash
docker-compose up --build
```

## ☁️ AWS EC2 Deployment

This application is designed to run on AWS EC2 instances:

### EC2 Setup
- **Instance Type**: t2.micro or higher (recommended)
- **Operating System**: Ubuntu 20.04 LTS or newer
- **Security Groups**: Configure ports 22 (SSH), 80 (HTTP), 443 (HTTPS), and 3000 (API)

### Deployment Steps
1. **Launch EC2 Instance**
   - Choose Ubuntu AMI
   - Configure security groups
   - Create or use existing key pair

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install Docker
   sudo apt-get install -y docker.io docker-compose
   sudo usermod -aG docker ubuntu
   ```

4. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd prisma-express-redux-board
   
   # Set up environment variables
   echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/prisma_board" > .env
   echo "PORT=3000" >> .env
   
   # Start with Docker
   docker-compose up --build -d
   ```

5. **Configure Reverse Proxy (Optional)**
   - Use Nginx to serve the application
   - Set up SSL certificates with Let's Encrypt
   - Configure domain name if available

## 🔄 CI/CD Pipeline

This project includes a complete CI/CD pipeline using GitHub Actions for automated testing, building, and deployment to AWS EC2.

### Pipeline Overview

The CI/CD pipeline consists of two main jobs:

1. **Test Job** - Runs on every push and pull request
2. **Deploy Job** - Runs only on pushes to the main branch

### Pipeline Features

- **Automated Testing**: Runs test suite on every code change
- **Build Verification**: Ensures the application builds successfully
- **Automated Deployment**: Deploys to EC2 automatically on main branch pushes
- **Docker Integration**: Uses Docker Compose for consistent deployment
- **Zero-Downtime Deployment**: Gracefully stops and restarts services

### Workflow Configuration

The pipeline is configured in `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS EC2

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js 18
      - Install dependencies
      - Run tests
      - Build application

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - Checkout code
      - Deploy to EC2 via SSH
      - Pull latest changes
      - Restart Docker services
```

### Required Secrets

Configure the following secrets in your GitHub repository settings:

- `EC2_HOST`: Your EC2 instance public IP or domain
- `EC2_SSH_KEY`: Private SSH key for EC2 access

### Deployment Process

1. **Code Push**: Developer pushes code to main branch
2. **Automated Testing**: GitHub Actions runs tests and builds
3. **Deployment**: If tests pass, automatically deploys to EC2
4. **Service Restart**: Docker services are gracefully restarted
5. **Verification**: Application is live and updated

### Benefits

- **Consistency**: Every deployment follows the same process
- **Reliability**: Tests must pass before deployment
- **Speed**: Automated deployment reduces manual errors
- **Rollback**: Easy to revert to previous versions via Git
- **Monitoring**: GitHub Actions provides deployment logs and status

## 🛠️ Development

### Code Structure
- **Components**: Modular React components with TypeScript
- **State Management**: Redux Toolkit with RTK Query for API calls
- **Styling**: CSS-based styling approach
- **API**: RESTful Express.js backend with proper error handling
- **Database**: Prisma ORM with PostgreSQL

### Key Features
- Type-safe development with TypeScript
- Modern React patterns with hooks
- Efficient state management with Redux Toolkit
- Database operations with Prisma ORM
- Containerized deployment with Docker

## 📝 License

This project is for educational and practice purposes.
