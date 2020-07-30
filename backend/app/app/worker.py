from app.core import config
from app.core.celery_app import celery_app
import requests
import json
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, From, Subject
from app.api.utils.db import get_db
from app.db.session import db_session
from app.models.prayers import Prayers
from app.models.members import Members
from app.models.partners import Partners
from app.models.users import Users
import celery
import datetime
import os

class SqlAlchemyTask(celery.Task):
    """An abstract Celery Task that ensures that the connection the the
    database is closed on task completion"""
    abstract = True

    def after_return(self, status, retval, task_id, args, kwargs, einfo):
        db_session.remove()

@celery_app.task(base=SqlAlchemyTask, acks_late=True)
def queue_emails():
    try:
        users = db_session.query(Users).filter(Users.wants_emails == True).all()
        for user in users:
            print("Sending email to {}...".format(user.email))
            member = get_next_member(user.uuid)
            if not member:
                print("Reseting prayers for {}!".format(user.email))
                db_session.query(Prayers).filter(Prayers.user_id == str(user.uuid)).filter(Prayers.member_id != None).delete(synchronize_session=False)
                db_session.commit()
                member = get_next_member(user.uuid)
            message = Mail(
                from_email=From('admin@prayer.thirdavenue.org', '3ABC Prayer Reminders'),
                to_emails=user.email
            )

            member_since = member.member_since.strftime('%B %Y')
            message.dynamic_template_data = {
                'email': member.email,
                'name': member.name,
                'member_since': member_since,
                'image': member.image_url if member.image_url is not None else None,
                'username': user.name if user.name is not None else user.username
            }
            message.template_id = 'd-0a35a380ad214eb0b6152ddaa961f420'

            sg = SendGridAPIClient('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')
            response = sg.send(message)
            print(response.status_code)

            new_prayer = Prayers(member_id=member.ccbid, partner_id=None, user_id=user.uuid)
            db_session.add(new_prayer)
            db_session.commit()
        return 200
    except Exception as e:
        print('Failed sending all emails')
        print(e)
        return 500
    finally:
        db_session.close()

@celery_app.task(base=SqlAlchemyTask, acks_late=True)
def queue_partner_emails():
    try:
        users = db_session.query(Users).filter(Users.wants_emails == True).all()
        for user in users:
            print("Sending email to {}...".format(user.email))
            partner = get_next_partner(user.uuid)
            if not partner:
                print("Reseting prayers for {}!".format(user.email))
                db_session.query(Prayers).filter(Prayers.user_id == str(user.uuid)).filter(Prayers.partner_id != None).delete(synchronize_session=False)
                db_session.commit()
                partner = get_next_partner(user.uuid)
            message = Mail(
                from_email=From('admin@prayer.thirdavenue.org', '3ABC Prayer Reminders'),
                to_emails=user.email
            )

            message.dynamic_template_data = {
                'user_name': user.name,
                'email': partner.email,
                'name': partner.name,
                'type': partner.type,
                'image': partner.image_url if partner.image_url is not None else None,
                'description': partner.description if partner.description is not None else None,
                'location': partner.location if partner.location is not None else None,
            }
            message.template_id = 'd-5f8116bd407849d5a06e66d586354bdb'

            sg = SendGridAPIClient('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')
            response = sg.send(message)
            print(response.status_code)

            new_prayer = Prayers(member_id=None, partner_id=partner.ccbid, user_id=user.uuid)
            db_session.add(new_prayer)
            db_session.commit()
        return 200
    except Exception as e:
        print('Failed sending partner emails')
        print(e)
        return 500
    finally:
        db_session.close()

@celery_app.task(base=SqlAlchemyTask, acks_late=True)
def sync_members():
    try:
        print('Starting to sync members from CCB into members table...')
        req = {'username': os.getenv("CCB_USER"), 'password': os.getenv("CCB_PASS"), 'keep_me_logged_in' : True}
        session = requests.Session()
        login_res = session.post('https://thirdave.ccbchurch.com/api/login', json=req)
        if login_res.status_code == 200:
            pages_res = session.get('https://thirdave.ccbchurch.com/api/individuals?page=1&per_page=100')
            if pages_res.status_code == 200:
                pages = pages_res.headers['X-Total-Pages']
                db_session.execute('''TRUNCATE TABLE members''')
                db_session.commit()
                for page in range(1, int(pages) + 1):
                    res = session.get('https://thirdave.ccbchurch.com/api/individuals?page=%s&per_page=100' % page)

                    members = json.loads(res.text)

                    objects = []
                    for member in members:
                        if member['family_position'] != 'CHILD' and member['last_name'] != '.Org' and member['last_name'] != 'Fellowship':
                            objects.append(
                                Members(
                                    ccbid=member.get("id"),
                                    name=member.get("name"),
                                    email=member.get("email"),
                                    phone=member.get("phone").get("mobile"),
                                    member_since=member.get("created"),
                                    image_url=get_image(member.get("images"))
                                )
                            )
                        else:
                            continue
                    else:
                        print('Bulk saving CCB members to members table')
                        db_session.bulk_save_objects(objects)
                        db_session.commit()
                        continue

                    db_session.close()
                else:
                    db_session.close()
                    return 200
            else:
                print('Failed retrieving members from CCB')
                return 400
        else:
            print('Failed authenticating with CCB while syncing members')
            return 404
    except Exception as e:
        db_session.close()
        print(e)
        return 500
    finally:
        db_session.close()

@celery_app.task(base=SqlAlchemyTask, acks_late=True)
def refresh_partner_urls():
    try:
        print('Refreshing partner images...')
        req = {'username': os.getenv("CCB_USER"), 'password': os.getenv("CCB_PASS"), 'keep_me_logged_in' : True}
        session = requests.Session()
        login_res = session.post('https://thirdave.ccbchurch.com/api/login', json=req)
        if login_res.status_code == 200:

            partners = db_session.query(Partners).all()
            for partner in partners:
                res = session.get('https://thirdave.ccbchurch.com/api/individuals/%s' % partner.ccbid)
                ccb_partner = json.loads(res.text)
                partner.image_url = get_image(ccb_partner.get('images'))
                db_session.commit()
            else:
                return 200
        else:
            print('Failed to authenticate with CCB while refreshing partner images')
            return 401
    except Exception as e:
        db_session.close()
        print(e)
        print('Failed to refresh partner images')
        return 500
    finally:
        db_session.close()

def get_next_member(userId):
    try:
        # return next unprayed for third ave member
        prayers = db_session.query(Prayers).filter(Prayers.user_id == str(userId)).all()
        prayerIds = list(map(lambda x: x.member_id, prayers))
        members = db_session.query(Members).all()

        for member in members:
            if member.ccbid not in prayerIds and member.image_url:
                return member
                break
        else:
            return None
    except Exception as e:
        print('Failed getting next member')
        print(e)
        return 500
    finally:
        db_session.close()

def get_next_partner(userId):
    try:
        # return next unprayed for third ave partner
        prayers = db_session.query(Prayers).filter(Prayers.user_id == str(userId)).all()
        prayerIds = list(map(lambda x: x.partner_id, prayers))
        partners = db_session.query(Partners).all()

        for partner in partners:
            if partner.ccbid not in prayerIds:
                return partner
                break
        else:
            return None
    except Exception as e:
        print(e)
        print('Failed getting next partner for emails')
        return 500
    finally:
        db_session.close()

def get_image(images):
    if images is not None:
        if 'thumbnail' in images:
            return images['thumbnail']
        elif 'medium' in images:
            return images['medium']
        elif 'large' in images:
            return images['large']
        else:
            return None
    else:
        return None
