from datetime import date
from typing import Union
import uuid
import time
from fastapi import APIRouter, HTTPException, Request, Response
import ormar
import bcrypt

from app.schemas.client_messages import PersonDataIn, PersonData
from app.models.user import Person

user_router = APIRouter(prefix="/auth")

DAY_MS = 24 * 60 * 60

@user_router.post("/login")
async def login(user_data: PersonDataIn, response: Response):

    try:
        existing_user = await Person.objects.get(login=user_data.login)
        
        if not bcrypt.checkpw(
                user_data.password.encode("utf-8"),
                existing_user.password.encode("utf-8")
            ):
            raise HTTPException(401, "Invalid login or password")
        
        response.set_cookie(
            key="authentication",
            value=existing_user.uuid,
            httponly=True,
            expires=DAY_MS
        )

        return existing_user

    except ormar.NoMatch:
        raise HTTPException(401, "Invalid login or password")

@user_router.post("/register")
async def register(user_data: PersonDataIn, response: Response):
    
    try:
        await Person.objects.get(login=user_data.login)
        raise HTTPException(409, "User with this login already exists")
    except ormar.NoMatch:
        user_id = str(uuid.uuid4())
        salt = bcrypt.gensalt(12)
        hashed_password = bcrypt.hashpw(user_data.password.encode("utf-8"), salt)
        new_user = await Person.objects.create(
            login=user_data.login,
            password=hashed_password,
            uuid=user_id,
            created_at=time.time() * 1000
        )
        response.set_cookie(
            key="authentication",
            value=new_user.uuid,
            httponly=True,
            expires=DAY_MS
        )
        return new_user

@user_router.post("/logout")
def logout(response: Response, request: Request):
    response.delete_cookie("authentication")
    return


