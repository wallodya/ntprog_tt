from fastapi import HTTPException, Request, Response
import ormar
from app.core.config import AUTH_COOKIE_EXPIRATION_S, AUTH_COOKIE_NAME

from app.models.user import Person


def set_auth_cookie(user: Person, response: Response) -> None:
    response.set_cookie(
        key=AUTH_COOKIE_NAME,
        value=user.uuid,
        httponly=True,
        expires=AUTH_COOKIE_EXPIRATION_S
    )
    return

def remove_auth_cookie(response: Response) -> None:
    response.delete_cookie(AUTH_COOKIE_NAME)
    return 

def extract_id_from_cookie(request: Request) -> str | None:
    user_id = request.cookies.get(AUTH_COOKIE_NAME)
    return user_id

async def get_user_by_id(id: str) -> Person:

    if not id:
        raise HTTPException(403, "Forbidden")

    try:
        user = await Person.objects.get(uuid=id)
    except ormar.NoMatch:
        raise HTTPException(403, "Forbidden")

    return user