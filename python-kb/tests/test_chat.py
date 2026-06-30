from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_chat() -> None:
    response = client.post("/api/chat", json={"question": "What is in the knowledge base?"})

    assert response.status_code == 200
    data = response.json()
    assert data["question"] == "What is in the knowledge base?"
    assert data["answer"]
    assert data["context"]
