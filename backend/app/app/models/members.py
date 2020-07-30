from sqlalchemy import Column, Integer, DateTime, String
import datetime
from app.db.base_class import Base


class Members(Base):
    id = Column(Integer, primary_key=True, autoincrement=True)
    ccbid= Column(Integer, autoincrement=False, nullable=False)
    name = Column(String(128), nullable=False)
    email = Column(String(128), nullable=True)
    phone = Column(String(128), nullable=True)
    member_since = Column(DateTime(), nullable=False)
    image_url = Column(String(385), nullable=True)
    created = Column(DateTime(), default=datetime.datetime.utcnow(), nullable=False)
    updated = Column(DateTime(), default=datetime.datetime.utcnow(), nullable=False)
    

    def __init__(self,
                 ccbid: int,
                 name: str,
                 email: str,
                 phone: str,
                 image_url: str,
                 member_since: str):
        self.ccbid = ccbid
        self.name = name
        self.email = email
        self.phone = phone
        self.image_url = image_url
        self.member_since = member_since

    def to_json(self):
        return {
            'ccbid': self.ccbid,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'image_url': self.image_url,
            'member_since': self.member_since
        }