
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import json

from database import get_db_connection

router = APIRouter(prefix="/farmer", tags=["Farmer"])


# Request model for updating farmer profile
class ProfileUpdate(BaseModel):
    preferred_language: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    pin_code: Optional[str] = None
    farm_name: Optional[str] = None
    total_land_area: Optional[float] = None
    land_area_unit: Optional[str] = None
    land_ownership: Optional[str] = None


# Request model for creating support ticket
class TicketCreate(BaseModel):
    subject: str
    message: str
    preferred_contact: str = "Message"


# Get farmer profile
@router.get("/{farmer_id}/profile")
def get_profile(farmer_id: int):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id, full_name, mobile_number, email,
        preferred_language, state, district, village,
        pin_code, farm_name, total_land_area,
        land_area_unit, land_ownership, created_at
        FROM farmers WHERE id = ?
        """,
        (farmer_id,)
    )

    farmer = cursor.fetchone()
    conn.close()

    if not farmer:
        raise HTTPException(404, "Farmer not found")

    return dict(farmer)


# Update farmer profile
@router.put("/{farmer_id}/profile")
def update_profile(farmer_id: int, data: ProfileUpdate):

    updates = data.model_dump(exclude_unset=True)

    if not updates:
        raise HTTPException(400, "No profile details provided")

    allowed_fields = {
        "preferred_language", "full_name", "email",
        "state", "district", "village", "pin_code",
        "farm_name", "total_land_area",
        "land_area_unit", "land_ownership"
    }

    if not set(updates).issubset(allowed_fields):
        raise HTTPException(400, "Invalid profile fields")

    if updates.get("total_land_area") is not None and updates["total_land_area"] <= 0:
        raise HTTPException(400, "Land area must be greater than zero")

    if updates.get("land_area_unit") not in (None, "Acres", "Hectares"):
        raise HTTPException(400, "Invalid land area unit")

    if updates.get("land_ownership") not in (
        None, "Owned", "Leased", "Family-owned"
    ):
        raise HTTPException(400, "Invalid land ownership")

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "SELECT id FROM farmers WHERE id = ?",
            (farmer_id,)
        )

        if not cursor.fetchone():
            raise HTTPException(404, "Farmer not found")

        fields = ", ".join(f"{field} = ?" for field in updates)

        values = list(updates.values())
        values.append(farmer_id)

        cursor.execute(
            f"UPDATE farmers SET {fields} WHERE id = ?",
            values
        )

        conn.commit()

        return {"message": "Profile updated successfully"}

    finally:
        conn.close()


# Get farmer dashboard information
@router.get("/{farmer_id}/dashboard")
def farmer_dashboard(farmer_id: int):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id, full_name, state, district,
        village, farm_name, total_land_area,
        land_area_unit
        FROM farmers WHERE id = ?
        """,
        (farmer_id,)
    )

    farmer = cursor.fetchone()

    if not farmer:
        conn.close()
        raise HTTPException(404, "Farmer not found")

    cursor.execute(
        """
        SELECT COUNT(*) AS total_predictions
        FROM predictions WHERE farmer_id = ?
        """,
        (farmer_id,)
    )

    prediction_count = cursor.fetchone()["total_predictions"]

    cursor.execute(
        """
        SELECT COUNT(*) AS open_tickets
        FROM tickets
        WHERE farmer_id = ? AND status = 'Open'
        """,
        (farmer_id,)
    )

    open_tickets = cursor.fetchone()["open_tickets"]

    conn.close()

    return {
        "farmer": dict(farmer),
        "total_predictions": prediction_count,
        "open_tickets": open_tickets
    }


# Get previous AI predictions
@router.get("/{farmer_id}/predictions")
def get_predictions(farmer_id: int):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id FROM farmers WHERE id = ?",
        (farmer_id,)
    )

    if not cursor.fetchone():
        conn.close()
        raise HTTPException(404, "Farmer not found")

    cursor.execute(
        """
        SELECT * FROM predictions
        WHERE farmer_id = ?
        ORDER BY created_at DESC
        """,
        (farmer_id,)
    )

    records = [dict(row) for row in cursor.fetchall()]
    conn.close()

    for record in records:
        if record["input_data"]:
            record["input_data"] = json.loads(record["input_data"])

    return records


# Raise a support ticket
@router.post("/{farmer_id}/tickets")
def create_ticket(farmer_id: int, ticket: TicketCreate):

    if ticket.preferred_contact not in ["Message", "Call"]:
        raise HTTPException(400, "Invalid contact preference")

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "SELECT id FROM farmers WHERE id = ?",
            (farmer_id,)
        )

        if not cursor.fetchone():
            raise HTTPException(404, "Farmer not found")

        cursor.execute(
            """
            INSERT INTO tickets
            (farmer_id, subject, message, preferred_contact)
            VALUES (?, ?, ?, ?)
            """,
            (
                farmer_id,
                ticket.subject,
                ticket.message,
                ticket.preferred_contact
            )
        )

        conn.commit()

        return {
            "message": "Support ticket created successfully",
            "ticket_id": cursor.lastrowid
        }

    finally:
        conn.close()


# View farmer support tickets
@router.get("/{farmer_id}/tickets")
def get_tickets(farmer_id: int):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT * FROM tickets
        WHERE farmer_id = ?
        ORDER BY created_at DESC
        """,
        (farmer_id,)
    )

    tickets = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return tickets
