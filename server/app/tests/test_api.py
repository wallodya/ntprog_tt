import pytest
from fastapi import status
from fastapi.testclient import TestClient

from app.main import app


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


def test_get_instruments(client: TestClient):
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
	with client.websocket_connect("/api/ws", cookies={
		"authentication": "4b8d1f0d169340df8ab89ecb20bdb160; Path=/; Secure; HttpOnly; Expires=Mon, 26 Jun 2023 14:59:39 GMT;"
	}) as socket:
		socket.send_json(
			{
				"hello": "world"
			}
		)
		data = socket.receive_json()
		assert data["message_type"] == 4
