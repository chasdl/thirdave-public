from datetime import timedelta

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import requests

from app.models.users import Users
from app.api.utils.db import get_db
from app.api.utils.security import get_current_user
from app.core import config
from app.core.jwt import create_access_token
from app.core.security import get_password_hash, verify_password
from app.models.users import Users as DBUser
from app.schemas.msg import Msg
from app.schemas.token import Token
from app.schemas.user import User

router = APIRouter()

@router.post("/login", tags=["login"])
def login(username: str = Body(...), password: str = Body(...), db: Session = Depends(get_db)):
    try:
        user = db.query(Users).filter(Users.username == username).first()
        if user and verify_password(password, user.password):
            access_token_expires = timedelta(minutes=60 * 24 * 8)
            auth_token = create_access_token(data={"user_uuid": str(user.uuid)}, expires_delta=access_token_expires)
            if auth_token:
                return {
                    "access_token": auth_token.decode(),
                    "message": "Successfully registered.",
                    "status": "Success",
                    "user": user.to_json()
                }
            else:
                return 500
        else:
            return 404
    except Exception as e:
        db.rollback()
        print(e)
        return 500
    finally:
        db.close()


@router.post("/register", tags=["register"])
def register(username: str = Body(...), email: str = Body(...), password: str = Body(...), name: str = Body(...), optIn: bool = Body(...), db: Session = Depends(get_db)):
    try:
        user = db.query(Users).filter(Users.email == email).first()
        if not user:
            # check user has valid login in CCB
            req = {'username': username, 'password': password, 'keep_me_logged_in' : True}
            res = requests.post('https://thirdave.ccbchurch.com/api/login', json=req)

            if res.status_code == 200:
                
                # add new user to db
                new_user = Users(
                    username=username, 
                    email=email, 
                    name=name,
                    password=get_password_hash(password),
                    wants_emails=optIn
                    )
                db.add(new_user)
                db.commit()
                db.refresh(new_user)
                # generate auth token
                
                access_token_expires = timedelta(minutes=120 * 24 * 8)
                auth_token = create_access_token(data={"user_uuid": str(new_user.uuid)}, expires_delta=access_token_expires)

                return {
                    "access_token": auth_token.decode(),
                    "message": "Successfully registered.",
                    "status": "Success",
                    "user": new_user.to_json()
                }
            else:
                return 404
        else:
            return 400
    except Exception as e:
        print(e)
        db.rollback()
        return 500
    finally:
        db.close()