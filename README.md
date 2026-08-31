# JobTrackerAPI

JobTrackerAPI is a full-stack application for tracking and managing job applications.

## Features

* User registration
* User login
* JWT authentication
* Create job applications
* View job applications
* Update job applications
* Delete job applications
* Job status tracking
* Job statistics
* Search jobs by company or position
* Filter jobs by status
* Pagination

## Tech Stack

### Backend

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL
* Pydantic
* Alembic
* Pytest
* JWT

### Frontend

* React
* Vite
* Axios
* CSS

### DevOps

* Docker
* Docker Compose
* Git
* GitHub

## Project Structure

```text
JobTrackerAPI/
├── app/
├── alembic/
├── tests/
├── frontend/
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

## Running the Application

### Start the Backend and Database

From the project root:

```bash
docker compose up -d
```

Check the running containers:

```bash
docker compose ps
```

The API will be available at:

```text
http://127.0.0.1:8000
```

### Start the Frontend

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## API Documentation

When the backend is running, open:

```text
http://127.0.0.1:8000/docs
```

The Swagger documentation allows you to view and test the API endpoints.

## Authentication

The application uses JWT Bearer authentication.

Users can:

* Register an account
* Log in
* Receive an access token
* Use the token to access protected job endpoints

## Job Statuses

Job applications can have the following statuses:

* Applied
* Interview
* Rejected
* Hired

## API Endpoints

### Authentication

```text
POST /auth/register
POST /auth/login
```

### Jobs

```text
GET    /jobs/
POST   /jobs/
GET    /jobs/{job_id}
PUT    /jobs/{job_id}
DELETE /jobs/{job_id}
```

The jobs endpoint also supports search, status filtering, and pagination.

## Testing

Backend tests can be run with:

```bash
pytest
```

The frontend production build can be checked with:

```bash
cd frontend
npm run build
```

## Environment Variables

Create a local `.env` file based on `.env.example`.

Do not commit `.env` or other secrets to GitHub.

## Author

Zorica
