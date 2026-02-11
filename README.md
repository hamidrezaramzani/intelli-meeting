# Intelli-Meeting

AI-powered online meeting assistant that records meetings, analyzes speech, and summarizes who said what.

## 🚀 Features

- **Real-time Audio Recording & Transcription**: Capture and transcribe meeting audio with high accuracy
- **Speaker Identification**: Automatically identify and tag different speakers in meetings
- **AI-Powered Summaries**: Generate intelligent meeting summaries with key points, decisions, and action items
- **Meeting Chat**: Interactive chat interface for asking questions about meeting content
- **Employee Management**: Manage organization members and their roles
- **Notification System**: Real-time notifications for meeting updates and AI processing status
- **Multi-language Support**: Built-in internationalization with i18n support
- **Modern UI**: Responsive web interface built with Next.js and Tailwind CSS

## 🏗️ Architecture

This is a monorepo application built with:

### Frontend (`apps/web`)
- **Next.js 15** with Turbopack for fast development
- **React 19** with TypeScript
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **React Hook Form** with Zod validation
- **i18next** for internationalization
- **Motion** for animations

### Backend (`apps/backend`)
- **FastAPI** with Python
- **PostgreSQL** for primary data storage
- **Redis** for caching and pub/sub
- **ChromaDB** for vector storage and retrieval
- **OpenAI API** for AI-powered features
- **WebSocket** support for real-time communication

### Shared Packages (`packages/`)
- **shared-ui**: Reusable UI components
- **store**: Shared Redux store configuration
- **translations**: Internationalization resources
- **design-system**: Design tokens and theme

## 🛠️ Tech Stack

### Frontend
- Next.js 15.5.7
- React 19.1.0
- TypeScript 5
- Tailwind CSS 4.1.14
- Redux Toolkit 2.9.2
- React Hook Form 7.65.0
- Zod 4.1.12

### Backend
- FastAPI 0.121.0
- SQLAlchemy 2.0.36
- Pydantic 2.10.5
- OpenAI Python SDK
- PostgreSQL 16
- Redis 7
- ChromaDB 0.5.4

### Development Tools
- Turbo 2.5.8 (Monorepo build system)
- Docker & Docker Compose
- ESLint & Prettier
- TypeScript

## 📋 Prerequisites

- Node.js 18+ 
- Python 3.9+
- Docker & Docker Compose
- PostgreSQL 16
- Redis 7

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd intelli-meeting
```

### 2. Install dependencies
```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
cd apps/backend
pip install -r requirements.txt
```

### 3. Set up environment variables
Create a `.env` file in the root directory:

```env
# Database
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=intelli_meeting
POSTGRES_DATABASE_URL=postgresql://your_postgres_user:your_postgres_password@localhost:5432/intelli_meeting

# Redis
REDIS_DB_URL=redis://localhost:6379

# ChromaDB
CHROMA_HOST=localhost
CHROMA_PORT=6000

# OpenAI
API_KEY=your_openai_api_key
BASE_URL=https://api.openai.com/v1
MODEL_ID=gpt-4

# JWT
SECRET_KEY=your_jwt_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480

# PgAdmin (optional)
PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=admin
```

### 4. Start the services
```bash
# Start database services with Docker
docker-compose up -d

# Run the development servers
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 📁 Project Structure

```
intelli-meeting/
├── apps/
│   ├── web/                 # Next.js frontend application
│   └── backend/             # FastAPI backend application
├── packages/
│   ├── shared-ui/           # Shared React components
│   ├── store/               # Redux store configuration
│   ├── translations/        # i18n translation files
│   └── design-system/       # Design tokens and theme
├── docker-compose.yml       # Development services
├── turbo.json              # Turbo build configuration
└── package.json            # Root package configuration
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev                  # Start all services in development mode
npm run build               # Build all applications
npm run lint                # Lint all packages
npm run format              # Format code with Prettier
npm run check-types         # Type check all TypeScript files

# Backend specific
npm run serve:backend       # Start backend server only
```

### Database Management

```bash
# Start database services
docker-compose up -d postgres redis chroma

# View database (PgAdmin)
# Open http://localhost:8070
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔌 Key Features Explained

### Meeting Management
- Create, update, and delete meetings
- Schedule meetings with date/time and participants
- Generate meeting links for online sessions

### Audio Processing
- Real-time audio recording via WebSocket
- Speech-to-text transcription
- Speaker diarization and identification
- Audio file management and storage

### AI-Powered Analysis
- Automatic meeting summaries
- Key point extraction
- Decision tracking
- Action item identification
- Interactive Q&A about meeting content

### Real-time Features
- WebSocket connections for live updates
- Notification system for processing status
- Live transcription during meetings

## 🌍 Internationalization

The application supports multiple languages through:
- **i18next** for frontend translations
- Configurable language switching
- Translation files in `packages/translations`

## 🔒 Security

- JWT-based authentication
- CORS configuration
- Input validation with Pydantic/Zod
- Environment variable configuration
- Secure file upload handling

## 📊 Monitoring & Logging

- Structured logging with colorlog
- Redis pub/sub for real-time events
- Database query optimization
- Error handling and validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the code comments and documentation

---

Built with ❤️ using modern web technologies and AI capabilities.
