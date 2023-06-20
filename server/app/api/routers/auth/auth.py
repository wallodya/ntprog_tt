from fastapi import APIRouter, HTTPException, Response, status

from app.core.security import (
    remove_auth_cookie,
    set_auth_cookie,
    check_password
)

from app.crud.base import create_user

from app.schemas.base import UserDataIn, UserData
from app.models.user import Person

auth_router = APIRouter(prefix="/auth", tags=["Auth"])

@auth_router.post(
    "/login",
    summary="Log into existing account"
)
async def login(user_data: UserDataIn, response: Response) -> UserData:
    existing_user = await Person.objects.get_or_none(login=user_data.login)

    if not existing_user:
        raise HTTPException(401, "Invalid login or password")


    if not check_password(user_data.password, existing_user.password):
        raise HTTPException(401, "Invalid login or password")

    set_auth_cookie(existing_user, response)

    return existing_user

@auth_router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    summary="Create new account"
)
async def register(user_data: UserDataIn, response: Response) -> UserData:
    
    existing_user = await Person.objects.get_or_none(login=user_data.login)

    if existing_user:
        raise HTTPException(409, "User with this login already exists")
    
    new_user = await create_user(user_data)

    set_auth_cookie(new_user, response)

    return new_user

@auth_router.post(
    "/logout",
    summary="Log out",
)
def logout(response: Response) -> None:
    remove_auth_cookie(response)
    return


