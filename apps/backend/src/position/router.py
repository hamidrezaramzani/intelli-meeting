
from fastapi import APIRouter, Depends, Query, Body
from sqlalchemy.orm import Session
from src.database import get_db
from src.position import schemas, service
router = APIRouter()



@router.post("/",response_model=schemas.CreatePositionResponse)
async def create_position(
    position: schemas.CreatePositionRequest = Body(...),
    db: Session = Depends(get_db)
):
    return service.create_position(db, position.title)

@router.get("/", response_model=schemas.ReadManyPositionsResponse)
def read_positions(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    skip = (page - 1) * limit
    return service.read_positions(db=db, skip=skip, limit=limit)

@router.get("/candidates", response_model=schemas.ReadManyPositionCandidatesResponse)
def read_position_candidates(
    db: Session = Depends(get_db),
):
    return service.read_position_candidates(db=db)


@router.put("/{position_id}")
def update_position(
    position_id: str,
    body = Body(...),
    db: Session = Depends(get_db),
):
    return service.update_position(db=db, position_id=position_id, body=body)



@router.get("/{position_id}", response_model=schemas.ReadOnePositionResponse)
def read_one_position(
    position_id: str,
    db: Session = Depends(get_db),
):
    return service.read_one_position(db=db, position_id=position_id)
