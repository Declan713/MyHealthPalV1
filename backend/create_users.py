from pymongo import MongoClient
import bcrypt

client = MongoClient("mongodb://127.0.0.1:27017")
db = client.MyHealthPal   
users_collection = db.users      

users_list = [
        { 
            "name": "John Doe",
            "email": "john@example.com",
            "avatar": "man.png",
            "password": b"john_NA",
            "medicalNumber": "ABC123",
            "basket": [],
            "purchaseHistory": [],
            "admin": False,
            "role": "user"
        },
        {
            "name": "Jane Smith",
            "email": "jane@example.com",
            "avatar": "woman.png",
            "password": b"jane_password",
            "medicalNumber": "ABC456",
            "basket": [],
            "purchaseHistory": [],
            "admin": False,
            "role": "user"
        },
         {
            "name": "Declan Madden",
            "email": "DM@example.com",
            "avatar": "admin.png",
            "password": b"Admin",
            "medicalNumber": "0000",
            "basket": [],
            "purchaseHistory": [],
            "admin": True,
            "role": "admin"
        },
]

for new_user in users_list:
      new_user["password"] = bcrypt.hashpw(new_user["password"], bcrypt.gensalt())
      users_collection.insert_one(new_user)