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
from app.models.members import Members


@router.get("/members", tags=["members"])
def get_member(db: Session = Depends(get_db), prayer_token: str = Cookie(None)):
    if not prayer_token:
        return 401
    user = get_current_user(prayer_token)

    if not user:
        return 401
    try:
        prayers = db.query(Prayers).filter(Prayers.user_id == str(user.uuid)).filter(Prayers.member_id != None).all()
        prayerIds = list(map(lambda x: x.member_id, prayers))
        member = db.query(Members).filter(~Members.ccbid.in_(prayerIds)).first()

        if member == None:
            return 201

        return member
    except Exception as e:
        db.rollback()
        print(e)
        return 500
    finally:
        db.close()

@router.post('/send-emails')
def send_emails(db: Session = Depends(get_db)):

    celery_app.send_task("app.worker.queue_emails")
    return 'Sending emails...', 200

@router.post('/sync-members-from-ccb')
def sync_members(db: Session = Depends(get_db)):

    celery_app.send_task("app.worker.sync_members")
    return 'Syncing members from ccb...', 200

@router.post('/send-partner-emails')
def send_partner_emails(db: Session = Depends(get_db)):

    celery_app.send_task("app.worker.queue_partner_emails")
    return 'Sending partner emails...', 200

@router.post('/refresh-partner-urls')
def refresh_partner_urls(db: Session = Depends(get_db)):

    celery_app.send_task("app.worker.refresh_partner_urls")
    return 'Refreshing partner image_urls from ccb...', 200