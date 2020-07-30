from typing import List

from fastapi import APIRouter, Body, Depends, HTTPException, Cookie
from fastapi.encoders import jsonable_encoder
from pydantic.networks import EmailStr
from sqlalchemy.orm import Session
from app.models.users import Users

from app.api.utils.db import get_db
from app.core import config
from app.models.users import Users as DBUser
from app.schemas.user import User, UserCreate, UserUpdate
from app.api.utils.security import get_current_user, get_current_user_uuid

router = APIRouter()


@router.get("/users")
def get_user(
    db: Session = Depends(get_db),
    prayer_token: str = Cookie(None)
):
    if not prayer_token:
        return 401
    user = get_current_user(prayer_token)
    if not user:
        return 401
    return user


@router.post("/users")
def update_user(
    *,
    post_data = Body(None),
    db: Session = Depends(get_db),
    prayer_token: str = Cookie(None)
):
    if not prayer_token:
        return 401
    uuid = get_current_user_uuid(prayer_token)
    try:
        user = db.query(Users).filter(Users.uuid == uuid).first()
        if user:
            user.wants_emails = post_data['optIn']
            user.name = post_data['name']
            user.email = post_data['email']
            db.commit()
            db.refresh(user)

            # session['user'] = user.to_json()
            # session.modified = True

            return {
                "message": "Successfully updated.",
                "status": "Success",
                "user": user.to_json()
            }
        else:
            return 404
    except Exception as e:
        print(e)
        db.rollback()
        return 500
    finally:
        db.close()

@router.post("/users/unsub")
def update_user(
    post_data = Body(None),
    db: Session = Depends(get_db)
):
    email = post_data[0].get('email')
    if email:
        try:
            user = db.query(Users).filter(Users.email == email).first()
            if user:
                user.wants_emails = False
                db.commit()
                db.refresh(user)
                return 200
            else:
                return 404
        except Exception as e:
            print(e)
            db.rollback()
            return 500
        finally:
            db.close()
    else:
        return 404
