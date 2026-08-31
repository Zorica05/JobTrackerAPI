from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.models import Job
from app.schemas.job import JobCreate, JobResponse, JobUpdate
from app.core.security import get_current_user_id


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=JobResponse)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    new_job = Job(
        **job.model_dump(),
        user_id=current_user_id,
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job


@router.get("/", response_model=list[JobResponse])
def get_jobs(
    search: str | None = None,
    status: str | None = None,
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    query = db.query(Job).filter(
        Job.user_id == current_user_id
    )

    if search:
        search_pattern = f"%{search}%"

        query = query.filter(
            (Job.company.ilike(search_pattern))
            | (Job.position.ilike(search_pattern))
        )

    if status:
        query = query.filter(
            Job.status == status
        )

    return (
        query
        .order_by(Job.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user_id,
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return job


@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    job_update: JobUpdate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user_id,
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    update_data = job_update.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(job, field, value)

    db.commit()
    db.refresh(job)

    return job


@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user_id,
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    db.delete(job)
    db.commit()

    return {"message": "Job deleted successfully"}
