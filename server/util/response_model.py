from pydantic import BaseModel
from typing import Any

class ResponseModel(BaseModel):
    success: bool
    message: str | dict[str, Any]