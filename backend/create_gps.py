from pymongo import MongoClient
import bcrypt

client = MongoClient("mongodb://127.0.0.1:27017")
db = client.MyHealthPal   
GPS_collection = db.gps  

gps_list = [
        {
            "name": "Dr. Smith",
            "specialisation": "General Practitioner",
            "contactNumber": "123-456-7890",
            "medicalNumbers": ["ABC123", "ABC456"],
            "email": "dr.smith@example.com",  
            "password": b"gp_password",
            "admin": False,
            "role": "GP"
        }
]

for new_gps in gps_list:
      new_gps["password"] = bcrypt.hashpw(new_gps["password"], bcrypt.gensalt())
      GPS_collection.insert_one(new_gps)