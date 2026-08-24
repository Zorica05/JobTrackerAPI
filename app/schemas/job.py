from datetime import datetime

from pydantic import BaseModel


class JobBase(BaseModel):
    company: str
    position: str
    description: str | None = None
    status: str = "applied"


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    company: str | None = None
    position: str | None = None
    description: str | None = None
    status: str | None = None


class JobResponse(JobBase):
    id: int
    applied_at: datetime

    class Config:
        from_attributes = True
