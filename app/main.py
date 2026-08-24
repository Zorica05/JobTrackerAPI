from fastapi import FastAPI

from app.api.routes.jobs import router as jobs_router
from app.db.database import Base, engine
from app.db import models

app = FastAPI(
    title="JobTrackerAPI",
    description="REST API for tracking and managing job applications.",
    version="1.0.0",
)

Base.metadata.create_all(bind=engine)

app.include_router(jobs_router)


@app.get("/")
def root():
    return {"message": "JobTrackerAPI is running"}
