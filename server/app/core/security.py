import bcrypt
from fastapi import HTTPException, Response
import ormar
from app.core.config import AUTH_COOKIE_EXPIRATION_S, AUTH_COOKIE_NAME

from app.models.user import Person
from app.schemas.base import UserData


def set_auth_cookie(user: UserData | Person, response: Response) -> None:
    response.set_cookie(
        key=AUTH_COOKIE_NAME,
        value=user.uuid,
        # httponly=True,
        expires=AUTH_COOKIE_EXPIRATION_S
    )
    return

def remove_auth_cookie(response: Response) -> None:
    response.delete_cookie(AUTH_COOKIE_NAME)
    return 

async def get_user_by_id(id: str) -> Person:

    if not id:
        raise HTTPException(403, "Forbidden")

    try:
        user = await Person.objects.get(uuid=id)
    except ormar.NoMatch:
        raise HTTPException(403, "Forbidden")

    return user

def check_password(pwd_in:str, pwd_user: str) -> bool:
    return bcrypt.checkpw(
        pwd_in.encode("utf-8"),
        pwd_user.encode("utf-8")
    )

def generate_hashed_password(pwd: str):
    salt = bcrypt.gensalt(12)
    return bcrypt.hashpw(pwd.encode("utf-8"), salt)