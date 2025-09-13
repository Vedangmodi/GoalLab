from .auth import router as auth_router
from .goals import router as goals_router
from .checkins import router as checkins_router
from .progress import router as progress_router

__all__ = ["auth_router", "goals_router", "checkins_router", "progress_router"]