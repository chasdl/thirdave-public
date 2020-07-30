from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
import datetime
from uuid import uuid4

from app.db.base_class import Base


class Users(Base):
    id = Column(Integer(), primary_key=True)
    uuid = Column(UUID(as_uuid=True), unique=True, nullable=False, default=uuid4)
    username = Column(String(128), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    email = Column(String(128), unique=True, nullable=False)
    name = Column(String(128), unique=True, nullable=True)
    admin = Column(Boolean, default=False, nullable=False)
    wants_emails = Column(Boolean, default=True, nullable=False)
    created = Column(DateTime(), default=datetime.datetime.utcnow(), nullable=False)
    updated = Column(DateTime(), default=datetime.datetime.utcnow(), nullable=False)

    def __init__(self,
                username: str,
                password: str,
                email: str = '',
                name: str = '',
                wants_emails: bool = True,
                admin: bool = False):
        self.username = username
        self.email = email
        self.wants_emails = wants_emails
        self.name = name
        self.admin = admin
        self.password = password

    def to_json(self):
        return {
            'id': self.id,
            'uuid': self.uuid,
            'username': self.username,
            'email': self.email,
            'name': self.name,
            'wants_emails': self.wants_emails,
            'admin': self.admin
        }