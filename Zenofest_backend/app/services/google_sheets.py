import gspread
from google.oauth2.service_account import Credentials
import base64
import json
from app.config import settings


class GoogleSheetsService:
    def __init__(self):
        creds_json = base64.b64decode(settings.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64).decode("utf-8")
        creds_info = json.loads(creds_json)
        scopes = ["https://www.googleapis.com/auth/spreadsheets"]
        self.client = gspread.service_account_from_dict(creds_info, scopes=scopes)
        self.sheet = self.client.open_by_key(settings.GOOGLE_SHEET_ID)

    def append_registration(self, registration, participants_names=""):
        try:
            ws = self.sheet.worksheet("Registrations")
            row = [
                registration.registration_id,
                registration.event_code,
                registration.event_name,
                registration.team_name,
                registration.leader_name,
                registration.leader_email,
                registration.leader_phone or "",
                registration.college_name or "",
                registration.department or "",
                registration.total_participants,
                participants_names,
                registration.total_amount,
                registration.payment_status,
                registration.created_at.strftime("%Y-%m-%d %H:%M:%S") if registration.created_at else "",
            ]
            ws.append_row(row, value_input_option='USER_ENTERED')
            return True
        except Exception as e:
            print(f"Google Sheets error (registration): {e}")
            return False

    def append_contact(self, contact):
        try:
            ws = self.sheet.worksheet("Contacts")
            row = [
                contact.name,
                contact.email,
                contact.phone or "",
                contact.subject,
                contact.message,
                contact.status,
                contact.created_at.strftime("%Y-%m-%d %H:%M:%S") if contact.created_at else "",
            ]
            ws.append_row(row, value_input_option='USER_ENTERED')
            return True
        except Exception as e:
            print(f"Google Sheets error (contact): {e}")
            return False
