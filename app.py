import json
from pathlib import Path
from typing import Optional

from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel

BASE_DIR = Path(__file__).parent
PUZZLE_FILE = BASE_DIR / "puzzle.json"

app = FastAPI()


class NounData(BaseModel):
    n: str
    a: str
    e: str
    decl: Optional[str] = None
    x: float
    y: float


class ZoneData(BaseModel):
    case: str
    x: float
    y: float
    w: float
    h: float


class PuzzleData(BaseModel):
    nouns: list[NounData]
    zones: list[ZoneData]


@app.get("/")
def serve_editor():
    return FileResponse(BASE_DIR / "index.html")


@app.get("/solve")
def serve_solve():
    return FileResponse(BASE_DIR / "solve.html")


@app.get("/style.css")
def serve_css():
    return FileResponse(BASE_DIR / "style.css")


@app.get("/script.js")
def serve_js():
    return FileResponse(BASE_DIR / "script.js", media_type="application/javascript")


@app.get("/api/puzzle")
def get_puzzle():
    if not PUZZLE_FILE.exists():
        return {"nouns": [], "zones": []}
    return json.loads(PUZZLE_FILE.read_text(encoding="utf-8"))


@app.post("/api/puzzle")
def save_puzzle(puzzle: PuzzleData):
    PUZZLE_FILE.write_text(puzzle.model_dump_json(), encoding="utf-8")
    return {"status": "ok"}
