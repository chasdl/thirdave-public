from fastapi import APIRouter, Body, Depends, HTTPException, Cookie

router = APIRouter()

import requests
import os
import json
from app.models.users import Users
from app.models.prayers import Prayers
from app.api.utils.db import get_db
from sqlalchemy.orm import Session
from app.core.celery_app import celery_app
from app.api.utils.security import get_current_user
from app.models.partners import Partners


@router.get("/partners", tags=["partners"])
def get_partner(db: Session = Depends(get_db), prayer_token: str = Cookie(None)):
    if not prayer_token:
        return 401
    user = get_current_user(prayer_token)
    
    if not user:
        return 401
    try:
        prayers = db.query(Prayers).filter(Prayers.user_id == str(user.uuid)).filter(Prayers.partner_id != None).all()
        prayerIds = list(map(lambda x: x.partner_id, prayers))
        partner = db.query(Partners).filter(~Partners.ccbid.in_(prayerIds)).first()

        if partner == None:
            return 201

        return partner
    except Exception as e:
        db.rollback()
        print(e)
        return 500
    finally:
        db.close()