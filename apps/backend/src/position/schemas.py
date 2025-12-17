from pydantic import BaseModel

class CreatePositionResponse(BaseModel):
    success: bool
    
class CreatePositionRequest(BaseModel):
    title: str
    
class PositionItem(BaseModel):
    id: int
    title: str
    
class ReadManyPositionsResponse(BaseModel):
    success: bool
    total: int
    page: int
    limit: int
    positions: list[PositionItem] | None
    
    
        
class ReadManyPositionCandidatesResponse(BaseModel):
    success: bool
    positions: list[PositionItem] | None
    

  
class ReadOnePositionResponse(BaseModel):
    success: bool
    position: PositionItem | None
    