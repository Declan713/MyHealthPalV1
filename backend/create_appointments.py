from pymongo import MongoClient
from bson import ObjectId
import datetime

client = MongoClient("mongodb://127.0.0.1:27017")
db = client.MyHealthPal   
appointments_collection = db.appointments


# Example appointments data
appointments_list = [
    {
        "userId": ObjectId("65cba52b3954240754d76bca"),  # Reference to the user's _id
        "gpId": ObjectId("65cba53e22b25df96440d622"),  # Reference to the GP's _id
        "userMedicalNumber": "ABC123",  # User's medical number
        "dateTime": datetime.datetime(2024, 2, 7, 10, 0, 0), # Fake date/time
        "status": "pending",
    },
]

for new_appointment in appointments_list:
    appointments_collection.insert_one(new_appointment)
