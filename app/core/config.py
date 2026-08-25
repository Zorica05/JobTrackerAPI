import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://username:password@localhost:5432/jobtracker",
)

JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "dev-secret-key-change-this",
)

JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 30
