from pymongo import MongoClient
import bcrypt

client = MongoClient("mongodb://127.0.0.1:27017")
db = client.MyHealthPal   
users_collection = db.users      

users_list = [
        { 
            "name": "test",
            "email": "test@example.com",
            "password": b"test",
            "medicalNumber": "test",
            "basket": [],
            "purchaseHistory": [],
            "admin": False,
            "role": "user"
        }
]

for new_user in users_list:
      new_user["password"] = bcrypt.hashpw(new_user["password"], bcrypt.gensalt())
      users_collection.insert_one(new_user)