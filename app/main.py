from fastapi import FastAPI

from app.api.routes.jobs import router as jobs_router
from app.api.routes.auth import router as auth_router
from app.db.database import Base, engine
from app.db import models

app = FastAPI(
    title="JobTrackerAPI",
    description="REST API for tracking and managing job applications.",
    version="1.0.0",
)

Base.metadata.create_all(bind=engine)

app.include_router(jobs_router)
app.include_router(auth_router)


@app.get("/")
def root():
    return {"message": "JobTrackerAPI is running"}
