
import os
import secrets

from fastapi import APIRouter, Depends, Header, HTTPException

from .ai import get_model_status, reload_models

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


def verify_admin(
    x_admin_key: str = Header(default=None)
):
    admin_key = os.getenv("ADMIN_API_KEY")

    if not admin_key:
        raise HTTPException(
            status_code=503,
            detail="Admin API key not configured"
        )

    if not x_admin_key or not secrets.compare_digest(
        x_admin_key, admin_key
    ):
        raise HTTPException(
            status_code=401,
            detail="Unauthorized access"
        )

    return True


@router.get("/status")
def admin_status(
    authorized: bool = Depends(verify_admin)
):
    status = get_model_status()

    loaded = sum(
        1 for item in status.values()
        if item["loaded"]
    )

    return {
        "success": True,
        "total_models": len(status),
        "loaded_models": loaded,
        "failed_models": len(status) - loaded,
        "models": status
    }


@router.post("/reload-models")
def reload_ai_models(
    authorized: bool = Depends(verify_admin)
):
    result = reload_models()

    return {
        "success": len(result["failed"]) == 0,
        "message": "AI models reload completed",
        "loaded": result["loaded"],
        "failed": result["failed"],
        "total": result["total"]
    }
