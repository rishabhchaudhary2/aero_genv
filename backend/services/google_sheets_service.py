"""
Google Sheets service for fetching team member data
"""
import os
from typing import List, Dict, Any
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import urllib.parse

# Define the scopes
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

class GoogleSheetsService:
    def __init__(self):
        self.credentials = None
        self.service = None
        
        self.members_spreadsheet_id = "1yLMzDbhLFgkUV7DqYpapw3fkzsrY-vGEwiNQVM-wOSs"
        
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
                spreadsheetId=self.members_spreadsheet_id,
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

# Create a singleton instance
google_sheets_service = GoogleSheetsService()
