# SQL Runner

A modern, full-stack SQL query execution interface built with Next.js, FastAPI, and SQLite. Features a responsive web interface with dark/light theme support, real-time query execution, and comprehensive database management capabilities.

## 🚀 Features

### Core Functionality
- **SQL Query Execution**: Execute SQL queries with real-time results
- **Database Browser**: View tables, schemas, and sample data
- **Query History**: Track and manage previously executed queries
- **Authentication**: Secure login system with JWT tokens
- **Error Handling**: Comprehensive error reporting and validation

### UI/UX Features
- **Dark/Light Theme**: Toggle between themes with persistent settings
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern Interface**: Clean, professional design with smooth animations
- **Real-time Feedback**: Loading states and execution time tracking

### Technical Features
- **RESTful API**: Well-structured backend with FastAPI
- **Database Support**: SQLite with extensible architecture
- **CORS Enabled**: Cross-origin resource sharing for development
- **Docker Support**: Containerized deployment with Docker Compose
- **Type Safety**: Full TypeScript implementation

## 🛠️ Tech Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Theme System**: CSS variables for light/dark themes

### Backend
- **FastAPI**: Modern Python web framework
- **SQLite**: Lightweight database engine
- **JWT Authentication**: Secure token-based auth
- **Pydantic**: Data validation and serialization

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Node.js 20**: Frontend runtime
- **Python 3.11**: Backend runtime

## 📦 Installation

### Prerequisites
- Docker and Docker Compose
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MoEngage
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Login Credentials
- **Username**: `admin`
- **Password**: `secret`

## 🏗️ Project Structure

```
MoEngage/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages and layouts
│   │   ├── components/      # React components
│   │   └── contexts/        # React context providers
│   ├── Dockerfile
│   └── package.json
├── backend/                 # FastAPI backend application
│   ├── main.py             # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile
├── sql_runner.db           # SQLite database
├── docker-compose.yml      # Docker orchestration
└── README.md
```

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development

**On macOS/Linux:**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Alternative (if Python 3 is in PATH as `python`):**
```bash
cd backend
python -m venv .-- Create a simple demo table
CREATE TABLE IF NOT EXISTS DemoEmployees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  hired_on DATE DEFAULT CURRENT_DATE
);

-- Seed a few rows (safe to re-run; ignores duplicates)
INSERT OR IGNORE INTO DemoEmployees (id, name, role)
VALUES
  (1, 'Ava Patel', 'Engineer'),
  (2, 'Liam Chen', 'Designer'),
  (3, 'Maya Singh', 'Product');

-- Verify data
venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Note:** If you get "command not found" errors:
- Install Python 3.11+ from https://www.python.org/downloads/ or use `brew install python3`
- Use `python3` instead of `python` on macOS
- Always activate the virtual environment before running commands

### Database Management
The application uses SQLite with a pre-populated database containing sample tables:
- `Customers`: Customer information
- `Orders`: Order records
- `Shippings`: Shipping details
- `sqlite_sequence`: SQLite system table

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/tables` - List database tables
- `GET /api/tables/{table_name}` - Get table schema and sample data

### Query Execution
- `POST /api/execute` - Execute SQL queries
- `GET /api/history` - Get query history

### Example API Usage
```bash
# Login
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "secret"}'

# Execute Query
curl -X POST "http://localhost:8000/api/execute" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT * FROM Customers LIMIT 5"}'
```

## 🎨 Theme System

The application features a custom theme system using CSS variables:

### Light Theme
- Primary background: White
- Secondary background: Light gray
- Text: Dark gray/black
- Accents: Blue

### Dark Theme
- Primary background: Dark gray
- Secondary background: Darker gray
- Text: Light gray/white
- Accents: Blue

### Theme Toggle
Click the sun/moon icon in the header to switch between themes. Your preference is automatically saved.

## 🐳 Docker Deployment

### Production Deployment
```bash
# Build and start services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Local Docker commands (quick reference)
These are the exact commands you'll use for local runs:

```bash
# Build and start in background
docker compose up --build -d

# Tail logs for all containers
docker compose logs -f

# Restart only one service
docker compose restart frontend
docker compose restart backend

# Stop and remove containers/network
docker compose down

# Force clean rebuild if cache is stale
docker compose down && docker compose build --no-cache && docker compose up -d
```

Note: Only `backend/Dockerfile`, `frontend/Dockerfile`, and `docker-compose.yml` are needed for local Docker. Cloud-specific files were removed (`railway.json`, `docker-compose.prod.yml`, and root Dockerfile variants).

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8000)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Pydantic models for data validation
- **SQL Injection Prevention**: Parameterized queries
- **Error Handling**: Secure error messages without sensitive data

## 🧪 Testing

### Manual Testing
1. **Login**: Test authentication with valid/invalid credentials
2. **Query Execution**: Run various SQL queries (SELECT, INSERT, UPDATE, DELETE)
3. **Theme Toggle**: Switch between light and dark themes
4. **Table Browser**: Click on different tables to view schemas
5. **Query History**: Check history functionality
6. **Error Handling**: Test with invalid SQL queries

### Sample Queries
```sql
-- Basic queries
SELECT * FROM Customers LIMIT 10;
SELECT COUNT(*) FROM Orders;
SELECT * FROM Customers WHERE age > 25;

-- Joins
SELECT c.name, o.order_date 
FROM Customers c 
JOIN Orders o ON c.id = o.customer_id;

-- Aggregations
SELECT COUNT(*) as total_orders, 
       AVG(amount) as avg_amount 
FROM Orders;
```

## 🚀 Performance

- **Frontend**: Optimized Next.js build with static generation
- **Backend**: FastAPI with async support
- **Database**: SQLite with indexed queries
- **Caching**: Browser-based theme persistence
- **Loading States**: Real-time feedback for all operations

## 🐛 Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Ensure ports 3000 and 8000 are available
   - Check for other running applications

2. **Database Issues**
   - Verify `sql_runner.db` exists in the root directory
   - Check file permissions

3. **Theme Not Switching**
   - Clear browser cache
   - Check browser console for errors

4. **API Connection Issues**
   - Verify backend is running on port 8000
   - Check CORS configuration

### Debug Commands
```bash
# Check container status
docker-compose ps

# View backend logs
docker-compose logs backend

# View frontend logs
docker-compose logs frontend

# Restart services
docker-compose restart
```

## 📈 Future Enhancements

- **Database Support**: PostgreSQL, MySQL integration
- **Query Builder**: Visual query construction
- **Export Features**: CSV, JSON export capabilities
- **User Management**: Multi-user support with roles
- **Query Optimization**: Query performance analysis
- **Real-time Collaboration**: Multi-user query sessions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation at http://localhost:8000/docs

---

**Built with ❤️ using Next.js, FastAPI, and modern web technologies.**

## 🧾 Submission Guidelines

Use this section when packaging your assignment.

### What to include (ZIP the folder)
- Entire `MoEngage/` directory containing:
  - `backend/` (FastAPI app, `requirements.txt`, `Dockerfile`)
  - `frontend/` (Next.js app, `Dockerfile`)
  - `sql_runner.db`
  - `docker-compose.yml`, `docker-compose.prod.yml`
  - `railway.json`, `DEPLOYMENT.md`, `SUBMISSION.md`
  - `README.md`
  - `docs/screenshots/` (add PNG/JPG screenshots here)

From the parent directory, create the archive:
```bash
zip -r moengage_sql_runner_submission.zip MoEngage
```

### How to run (Docker)
```bash
docker-compose up --build -d
```
Open: Frontend http://localhost:3000, Backend http://localhost:8000 (Docs: /docs)

### How to run without Docker
Backend:
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```
Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Docker Compose (bonus)
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### Screenshots
Below are actual screenshots from `docs/screenshots/`:

![Login](<docs/screenshots/Screenshot 2025-10-29 at 4.54.50 PM.png>)
![Home](<docs/screenshots/Screenshot 2025-10-29 at 4.54.34 PM.png>)
![Results](<docs/screenshots/Screenshot 2025-10-29 at 4.56.51 PM.png>)
![Tables](<docs/screenshots/Screenshot 2025-10-29 at 4.54.39 PM.png>)
