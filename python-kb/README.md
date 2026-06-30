# python-kb

Python knowledge-base service module for this RuoYi React project.

It starts with:

- FastAPI HTTP service
- LangGraph workflow skeleton
- Environment-based configuration
- Health and chat endpoints

## Requirements

- Python 3.11+

## Quick Start

```bash
cd python-kb
python -m venv .venv
.venv\Scripts\activate
pip install -e ".[dev]"
copy .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

API docs:

- http://localhost:8001/docs
- http://localhost:8001/health

## Project Layout

```text
python-kb/
  app/
    api/          FastAPI routers
    core/         Settings and shared config
    graph/        LangGraph workflows
    schemas/      Pydantic request/response models
  tests/          Pytest tests
```

## Next Steps

- Add document upload and parsing APIs.
- Add embedding model and vector store adapters.
- Connect RuoYi auth/JWT validation.
- Add retrieval nodes before answer generation.
