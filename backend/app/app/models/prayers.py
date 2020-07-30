from sqlalchemy import Column, Integer, DateTime, String
import datetime
from app.db.base_class import Base


class Prayers(Base):
    id = Column(Integer, primary_key=True, autoincrement=True)
    member_id = Column(Integer, nullable=True)
    partner_id = Column(Integer, nullable=True)
    user_id = Column(String(128), nullable=False)
    created = Column(DateTime(), default=datetime.datetime.utcnow(), nullable=False)
    updated = Column(DateTime(), default=datetime.datetime.utcnow(), nullable=False)
    

    def __init__(self,
                 member_id: int,
                 partner_id: int,
                 user_id: str):
        self.member_id = member_id
        self.partner_id = partner_id
        self.user_id = user_id

    def to_json(self):
        return {
            'id': self.id,
            'member_id': self.member_id,
            'partner_id': self.partner_id,
            'user_id': self.user_id
        }