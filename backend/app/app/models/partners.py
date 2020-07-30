from sqlalchemy import Column, DateTime, String, Integer
import datetime
from app.db.base_class import Base


class Partners(Base):
    id = Column(Integer, primary_key=True, autoincrement=True)
    ccbid= Column(Integer, autoincrement=False, nullable=False)
    type = Column(String(128), nullable=False)
    name = Column(String(128), nullable=False)
    email = Column(String(128), nullable=True)
    description = Column(String(128), nullable=True)
    image_url = Column(String(385), nullable=True)
    location = Column(String(385), nullable=True)
    

    def __init__(self,
                 type: str,
                 ccbid: int,
                 name: str,
                 email: str,
                 description: str,
                 image_url: str,
                 location: str):
        self.ccbid = ccbid
        self.type = type
        self.name = name
        self.email = email
        self.description = description
        self.image_url = image_url
        self.location = location

    def to_json(self):
        return {
            'type': self.type,
            'ccbid': self.ccbid,
            'name': self.name,
            'email': self.email,
            'description': self.description,
            'image_url': self.image_url,
            'location': self.location
        }