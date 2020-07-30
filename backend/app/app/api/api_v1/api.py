from fastapi import APIRouter

from app.api.api_v1.endpoints import login, users, prayers, members, partners

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, tags=["users"])
api_router.include_router(prayers.router, tags=["prayers"])
api_router.include_router(members.router, tags=["members"])
api_router.include_router(partners.router, tags=["partners"])
