import jwt
from fastapi import Depends, HTTPException, Security
from jwt import PyJWTError
from sqlalchemy.orm import Session
from starlette.status import HTTP_403_FORBIDDEN

from app.api.utils.db import get_db
from app.core import config
from app.core.jwt import ALGORITHM
from app.models.users import Users
from app.schemas.token import TokenPayload
from app.db.session import db_session


def get_current_user(token: str):
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[ALGORITHM])
        token_data = TokenPayload(**payload)

        user = db_session.query(Users).filter(Users.uuid == token_data.user_uuid).first()
        if not user:
            return None

        return user
    except Exception as e:
        db_session.rollback()
        return None
    finally:
        db_session.close()

def get_current_user_uuid(token: str):
    try:
        payload = jwt.decode(token, config.SECRET_KEY, algorithms=[ALGORITHM])
        token_data = TokenPayload(**payload)
    except PyJWTError:
        return None
    return token_data.user_uuid
