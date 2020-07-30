from app.models.prayers import Prayers
from fastapi import APIRouter, Body, Depends, Cookie
from app.api.utils.db import get_db
from sqlalchemy.orm import Session
from app.api.utils.security import get_current_user_uuid
from app.models.partners import Partners



router = APIRouter()

@router.post("/prayers", tags=["prayers"])
def create_prayer(post_data = Body(...), db: Session = Depends(get_db), prayer_token: str = Cookie(None)):
    if not post_data and prayer_token:
        return 400
    try:
         # add new prayer to db
        new_prayer = Prayers(member_id=post_data.get('member_id'), partner_id=post_data.get('partner_id'), user_id=get_current_user_uuid(prayer_token))
        db.add(new_prayer)
        db.commit()

        return {
            "user_id": new_prayer.user_id,
            "message": "Successfully created.",
            "status": "Success",
            "member_id": new_prayer.member_id
        }
    except Exception as e:
        print(e)
        db.rollback()
        return 500

@router.delete("/prayers", tags=["prayers"])
def delete_prayer(p: bool = None, db: Session = Depends(get_db), prayer_token: str = Cookie(None)):
    if not prayer_token:
        return 401
    try:
         # delete all prayers for this user of the specified partner type
        if p == True:
            prayers = db.query(Prayers).filter(Prayers.user_id == get_current_user_uuid(prayer_token)).filter(Prayers.partner_id != None).delete(synchronize_session=False)
        else:
            prayers = db.query(Prayers).filter(Prayers.user_id == get_current_user_uuid(prayer_token)).filter(Prayers.member_id != None).delete(synchronize_session=False)
        db.commit()

        return {
            "message": "Successfully delete.",
            "status": "Success",
        }
    except Exception as e:
        print(e)
        db.rollback()
        return 500
    finally:
        db.close()