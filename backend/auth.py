
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from database import get_db_connection
import hashlib
import secrets
import hmac

router = APIRouter(prefix="/auth", tags=["Authentication"])


# Password security functions
def hash_password(password: str):
    salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode(),
        salt.encode(),
        100000
    ).hex()

    return f"{salt}${hashed}"


def verify_password(password: str, stored_password: str):
    salt, original_hash = stored_password.split("$")

    new_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode(),
        salt.encode(),
        100000
    ).hex()

    return hmac.compare_digest(new_hash, original_hash)


# Farmer registration details
class FarmerRegister(BaseModel):
    preferred_language: str
    full_name: str
    mobile_number: str
    email: Optional[str] = None
    password: str

    state: str
    district: str
    village: str
    pin_code: str

    farm_name: Optional[str] = None
    total_land_area: float
    land_area_unit: str
    land_ownership: str


# Farmer login details
class FarmerLogin(BaseModel):
    identifier: str
    password: str


# Farmer signup API
@router.post("/register")
def register_farmer(farmer: FarmerRegister):

    if len(farmer.password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 8 characters"
        )

    if farmer.total_land_area <= 0:
        raise HTTPException(
            status_code=400,
            detail="Land area must be greater than zero"
        )

    if farmer.land_area_unit not in ["Acres", "Hectares"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid land area unit"
        )

    if farmer.land_ownership not in [
        "Owned", "Leased", "Family-owned"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Invalid land ownership type"
        )

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT id FROM farmers
            WHERE mobile_number = ? OR
            (email IS NOT NULL AND email = ?)
            """,
            (farmer.mobile_number, farmer.email)
        )

        existing_farmer = cursor.fetchone()

        if existing_farmer:
            raise HTTPException(
                status_code=409,
                detail="Mobile number or email already registered"
            )

        password_hash = hash_password(farmer.password)

        cursor.execute(
            """
            INSERT INTO farmers (
                preferred_language,
                full_name,
                mobile_number,
                email,
                password_hash,
                state,
                district,
                village,
                pin_code,
                farm_name,
                total_land_area,
                land_area_unit,
                land_ownership
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                farmer.preferred_language,
                farmer.full_name,
                farmer.mobile_number,
                farmer.email,
                password_hash,
                farmer.state,
                farmer.district,
                farmer.village,
                farmer.pin_code,
                farmer.farm_name,
                farmer.total_land_area,
                farmer.land_area_unit,
                farmer.land_ownership
            )
        )

        conn.commit()

        return {
            "message": "Farmer registered successfully",
            "farmer_id": cursor.lastrowid,
            "full_name": farmer.full_name
        }

    finally:
        conn.close()


# Farmer login API
@router.post("/login")
def login_farmer(user: FarmerLogin):

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT * FROM farmers
            WHERE mobile_number = ? OR email = ?
            """,
            (user.identifier, user.identifier)
        )

        farmer = cursor.fetchone()

        if not farmer:
            raise HTTPException(
                status_code=401,
                detail="Invalid mobile number or password"
            )

        if not verify_password(
            user.password,
            farmer["password_hash"]
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid mobile number or password"
            )

        return {
            "message": "Login successful",
            "farmer": {
                "id": farmer["id"],
                "full_name": farmer["full_name"],
                "mobile_number": farmer["mobile_number"],
                "email": farmer["email"],
                "preferred_language": farmer["preferred_language"],
                "state": farmer["state"],
                "district": farmer["district"],
                "village": farmer["village"]
            }
        }

    finally:
        conn.close()
