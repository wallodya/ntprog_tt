from typing import Any
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
    existing_user = await Person.objects.prefetch_related(
        ["subscriptions", "subscriptions__instrument"]
    ).get_or_none(login=user_data.login)

    if not existing_user:
        raise HTTPException(401, "Invalid login or password")


    if not check_password(user_data.password, existing_user.password):
        raise HTTPException(401, "Invalid login or password")

    set_auth_cookie(existing_user, response)

    # def flatten_user_subscriptions(user: Person) -> UserData:
    #     return {
    #         "login": user.login,
    #         "created_at": user.created_at,
    #         "uuid": user.uuid,
    #         "subscriptions" : list(
    #             map(
    #                 lambda sub: {
    #                     "name": sub.instrument.name,
    #                     "instrument_id": sub.instrument.instrument_id,
    #                     "buy_position": sub.instrument.buy_position,
    #                     "sell_position": sub.instrument.sell_position,
    #                 }, user.subscriptions
    #             )
    #         )
    #     }
    
    # user_out = flatten_user_subscriptions(existing_user)
    print(existing_user.subscriptions[0])
    return UserData.from_orm(existing_user)

@auth_router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    summary="Create new account"
)
async def register(user_data: UserDataIn, response: Response) -> UserData:
    print("user_data:")
    print(user_data)
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


