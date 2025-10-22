"""
Google Sheets service for fetching team member data
"""
import os
import re
from typing import List, Dict, Any
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import urllib.parse
from datetime import datetime

# Define the scopes
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

class GoogleSheetsService:
    def __init__(self):
        self.credentials = None
        self.service = None
        
        self.members_sheet_id = "1yLMzDbhLFgkUV7DqYpapw3fkzsrY-vGEwiNQVM-wOSs"
        self.forms_sheet_id = "1EOi8OXaNdDWlPMQKuh2zLsqVYFNOkB_QU2dVKYHdCqM"
        
    def initialize(self):
        """Initialize Google Sheets API service"""
        try:
            # Path to your service account key file
            service_account_file = "config/sheet-key.json"
            
            # Create credentials
            self.credentials = Credentials.from_service_account_file(
                service_account_file, 
                scopes=SCOPES
            )
            
            # Build the service
            self.service = build('sheets', 'v4', credentials=self.credentials)
            return True
        except Exception as e:
            print(f"Error initializing Google Sheets service: {str(e)}")
            return False
    
    async def fetch_team_members(self, sheet_name: str = 'Sheet1') -> List[Dict[str, Any]]:
        """
        Fetch team member data from Google Sheets
        
        Args:
            sheet_name: Name of the sheet tab (default: 'Sheet1')
            
        Returns:
            List of team member dictionaries
        """
        if not self.service:
            if not self.initialize():
                raise Exception("Failed to initialize Google Sheets service")
        
        try:
            # Define the range (adjust based on your sheet structure)
            range_name = f'{sheet_name}!A:I'  # Columns A to I (9 columns as per your fields)
            
            # Call the Sheets API
            result = self.service.spreadsheets().values().get(
                spreadsheetId=self.members_sheet_id,
                range=range_name
            ).execute()
            
            values = result.get('values', [])
            
            if not values:
                return []
            
            # First row is headers
            headers = values[0]
            team_members = []
            
            # Process each row (skip header)
            for row in values[1:]:
                # Ensure row has enough columns (pad with empty strings if needed)
                while len(row) < len(headers):
                    row.append('')

                parse_img_url = urllib.parse.urlparse(row[8]) if len(row) > 8 else None
                query_params = urllib.parse.parse_qs(parse_img_url.query)
                file_id = query_params.get('id')[0]

                member = {
                    'timestamp': row[0] if len(row) > 0 else '',
                    'email': row[1] if len(row) > 1 else '',
                    'name': row[2] if len(row) > 2 else '',
                    'rollNo': row[3] if len(row) > 3 else '',
                    'branch': row[4] if len(row) > 4 else '',
                    'batch': row[5] if len(row) > 5 else '',  # Year of graduation
                    'role': row[6] if len(row) > 6 else '',  # Domain
                    'subDomain': row[7] if len(row) > 7 else '',  # Sub Domain
                    'image': "https://drive.usercontent.google.com/download?id=" + file_id,  # Profile photo URL
                }
                
                # Only add members with at least a name
                if member['name']:
                    team_members.append(member)
            
            return team_members
            
        except HttpError as error:
            print(f"An error occurred: {error}")
            raise Exception(f"Failed to fetch data from Google Sheets: {str(error)}")
        except Exception as e:
            print(f"Error fetching team members: {str(e)}")
            raise Exception(f"Error processing team member data: {str(e)}")
    
    def _sanitize_sheet_name(self, form_name: str) -> str:
        """
        Sanitize form name to create a valid sheet name
        - Remove special characters
        - Replace spaces with dashes
        - Limit to 100 characters (Google Sheets limit)
        """
        sanitized = re.sub(r'[^a-zA-Z0-9\s-]', '', form_name)
        sanitized = sanitized.strip(' ')
        sanitized = sanitized[:100]
        return sanitized
    
    async def _get_or_create_sheet(self, form_name: str, questions: List[Dict[str, Any]]) -> str:
        """
        Get existing sheet or create new one for the form
        
        Args:
            form_name: Name of the form
            questions: List of question objects with question_key and question_text
            
        Returns:
            Sheet name (sanitized)
        """
        if not self.service:
            if not self.initialize():
                raise Exception("Failed to initialize Google Sheets service")
        
        sheet_name = self._sanitize_sheet_name(form_name)
        
        try:
            # Get all sheets in the spreadsheet
            spreadsheet = self.service.spreadsheets().get(
                spreadsheetId=self.forms_sheet_id
            ).execute()
            
            sheets = spreadsheet.get('sheets', [])
            sheet_exists = any(sheet['properties']['title'] == sheet_name for sheet in sheets)
            
            if not sheet_exists:
                # Create new sheet
                requests = [{
                    'addSheet': {
                        'properties': {
                            'title': sheet_name
                        }
                    }
                }]
                
                self.service.spreadsheets().batchUpdate(
                    spreadsheetId=self.forms_sheet_id,
                    body={'requests': requests}
                ).execute()
                
                # Add headers
                headers = ['Timestamp', 'Email']
                # Add question texts as headers
                for question in questions:
                    headers.append(question.get('question_text', question.get('question_key', '')))
                
                # Write headers to the new sheet
                self.service.spreadsheets().values().update(
                    spreadsheetId=self.forms_sheet_id,
                    range=f'{sheet_name}!A1',
                    valueInputOption='RAW',
                    body={'values': [headers]}
                ).execute()
            
            return sheet_name
            
        except HttpError as error:
            print(f"Error creating/getting sheet: {error}")
            raise Exception(f"Failed to create/get sheet: {str(error)}")
    
    async def append_form_submission(
        self, 
        form_name: str, 
        user_name: str, 
        user_email: str,
        questions: List[Dict[str, Any]],
        responses: Dict[str, str],
        timestamp: datetime
    ):
        """
        Append form submission data to Google Sheets
        
        Args:
            form_name: Name of the form
            user_email: Email of the user who submitted
            questions: List of question objects from the form
            responses: Dictionary of question_key: answer pairs
            timestamp: Submission timestamp
        """
        if not self.service:
            if not self.initialize():
                raise Exception("Failed to initialize Google Sheets service")
        
        try:
            # Get or create sheet
            sheet_name = await self._get_or_create_sheet(form_name, questions)
            
            # Prepare row data
            row_data = [
                timestamp.strftime('%Y-%m-%d %I:%M:%S %p'),
                user_email
            ]
            
            # Add responses in the same order as questions
            for question in questions:
                question_key = question.get('question_key', '')
                answer = responses.get(question_key, '')
                row_data.append(answer)
            
            # Append the row
            self.service.spreadsheets().values().append(
                spreadsheetId=self.forms_sheet_id,
                range=f'{sheet_name}!A:A',
                valueInputOption='RAW',
                insertDataOption='INSERT_ROWS',
                body={'values': [row_data]}
            ).execute()
            
            return True
            
        except HttpError as error:
            print(f"Error appending form submission: {error}")
            raise Exception(f"Failed to append form submission: {str(error)}")
        except Exception as e:
            print(f"Error in append_form_submission: {str(e)}")
            raise Exception(f"Error processing form submission: {str(e)}")

# Create a singleton instance
google_sheets_service = GoogleSheetsService()
