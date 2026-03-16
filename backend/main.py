from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()
@app.get('/')
async def root():
    return{"message": "API is running"}

