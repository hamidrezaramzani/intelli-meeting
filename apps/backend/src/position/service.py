from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from . import models


def create_position(db: Session, title: str):
    try:
        position = models.Position(
        title=title,
        )

        db.add(position)
        db.commit()
        db.refresh(position)

        return { "success": True }
    except: 
        return { 'success': False }

    

def read_positions(db: Session, skip: int = 0, limit: int = 10):
    total = db.query(models.Position).count()
    
    positions = (
        db.query(models.Position)
        .order_by(models.Position.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    positions_data = jsonable_encoder(positions)
    return {
        "success": True,
        "total": total,
        "page": (skip // limit) + 1,
        "limit": limit,
        "positions": positions_data,
    }
    
def read_position_candidates(db: Session):
    positions = (
         db.query(models.Position)
        .order_by(models.Position.id.desc())
        .all()
    )
    
    positions_data = jsonable_encoder(positions)
    return {
        "success": True,
        "positions": positions_data,
    }
    