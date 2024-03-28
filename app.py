from flask import Flask, request, jsonify
from functools import wraps
from pymongo import MongoClient
from bson import ObjectId
from flask_cors import CORS
import bcrypt
import jwt
from datetime import datetime, timedelta


app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'mysecret'

client = MongoClient('mongodb://127.0.0.1:27017')
db = client.MyHealthPal
users_collection = db.users
GPS_collection = db.gps
Appointments_collection = db.appointments
items_collection = db.items


########################################################################################################
########################################################################################################


# JWT token Generation
def generate_token(user_id, role):
    expiration = datetime.utcnow() + timedelta(days=1)
    payload = {'user_id': str(user_id), 'role': role, 'exp': expiration}
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token 

def decode_token(token):
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}

def jwt_required(func):
    @wraps(func)
    def jwt_required_wrapper(*args, **kwargs):
        token = request.headers.get('Authorization')

        if token:
            decoded_token = decode_token(token)

            if 'error' not in decoded_token:
                request.current_user = decoded_token
                return func(*args, **kwargs)

        return jsonify({'message': 'Unauthorized access'}), 401

    return jwt_required_wrapper


# Login Route
@app.route('/login', methods=['POST'])
def login():
    
    data = request.json

    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({'email': email})
    gp = GPS_collection.find_one({'email': email})

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        token = generate_token(user["_id"], user["role"])
        return jsonify({"token": token, "role": user["role"], "user_id": str(user["_id"])}), 200
    elif gp and bcrypt.checkpw(password.encode('utf-8'), gp['password']):
        token = generate_token(gp["_id"], gp["role"])
        return jsonify({"token": token, "role": gp["role"], "gp_id": str(gp["_id"])}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401
    
# # Logout Route

# # Register New Account




# Show all items
    
# Show one item
    
# Search for item


#####################################################################################################
###########################(GP Feature)##############################################################

# View GP Profile/Account



# Edit GP Profile/Account



# Edit Appointment i.e change from pending to accepted/confirmed



# View all GP Appointments


#######################################################################################################
###########################(User Feature)##############################################################


# View User Account/Show Profile


# View User Basket/Shopping Cart


# Add Items to User Basket/Shopping Cart


# Remove Item from User Basket/Shopping Cart


# Add a Review to an Item


# Edit a Review 


# Delete a Review 


# Get all Users Item reviews



# Create/Book an appointment

# Purchase Items

# Get User Appointments

    

########################################################################################################
###########################(Admin Feature)##############################################################

# Show all Users
    

# Add an Item 
    

# Edit an Item 
    

# Delete an Item 

   
# Add a GP 
    

# Edit a GP's Info
    

# Delete a GP

if __name__ == "__main__":
    app.run(debug=True)
