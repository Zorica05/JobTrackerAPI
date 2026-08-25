from datetime import datetime
from enum import Enum

from pydantic import BaseModel


class JobStatus(str, Enum):
    APPLIED = "applied"
    INTERVIEW = "interview"
    REJECTED = "rejected"
    HIRED = "hired"


class JobBase(BaseModel):
    company: str
    position: str
    description: str | None = None
    status: JobStatus = JobStatus.APPLIED


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    company: str | None = None
    position: str | None = None
    description: str | None = None
    status: JobStatus | None = None


class JobResponse(JobBase):
    id: int
    applied_at: datetime

    class Config:
        from_attributes = True
