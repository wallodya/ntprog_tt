import pytest
from fastapi.testclient import TestClient
from fastapi import status

from app.main import app

from app.schemas import server_messages 

@pytest.fixture(scope="session")
def client():
    with TestClient(app) as _client:
        yield _client
    

def test_get_main(client: TestClient):
    response = client.get("/api/")
    assert response.status_code == 200

def test_not_found(client: TestClient):
    response = client.get("/api/abc")
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_get_insrtuments(client: TestClient):
    response = client.get("/api/instruments")
    assert response.status_code == 200
    assert len(response.json()) == 6

def test_login(client: TestClient):
    response = client.post(
        "/api/auth/login",
        json={
            "login": "User1",
            "password": "1234"
        }
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
        "uuid": "4b8d1f0d169340df8ab89ecb20bdb160",
        "login": "User1",
        "created_at": 1687014277056
    }

    response = client.post(
        "/api/auth/login",
        json={
            "login": "User1",
            "password": "12345"
        }
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {
        "detail": "Invalid login or password"
    }

    response = client.post(
        "/api/auth/login",
        json={
            "login": "User0",
            "password": "1234"
        }
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {
        "detail": "Invalid login or password"
    }

    response = client.post(
        "/api/auth/login",
        json={
            "login-with-mistake": "User1",
            "password": "1234"
        }
    )
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    response = client.post(
        "/api/auth/login",
        json={
            "login": "",
            "password": "1234"
        }
    )
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    response = client.post(
        "/api/auth/login",
        json={
            "login": "User1",
            "password": "123"
        }
    )
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    response = client.post(
        "/api/auth/login",
        json={
            "login": "Use",
            "password": "1234"
        }
    )
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    response = client.post(
        "/api/auth/login",
        json={
            "login": "Use",
            "password": "1234"
        }
    )
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_websocket(client: TestClient):
    
    with client.websocket_connect("/api/ws") as socket:
        socket.send_json({
            "hello": "world"
        })
        data = socket.recieve_json()

