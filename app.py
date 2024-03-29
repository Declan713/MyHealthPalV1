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
    
# Logout Route
@app.route('/logout', methods=['POST'])
@jwt_required
def logout():
    # Instruct the client to remove the token from storage
    return jsonify({"message": "Logged out successfully. Please remove the token from your storage."}), 200


# Register New Account
@app.route('/register', methods=['POST'])
def register():
    data = request.json  # Get data from the request's body

    # Basic validation to check if essential fields are provided
    if not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing name, email, or password"}), 400

    # Check if the user already exists
    if users_collection.find_one({'email': data['email']}):
        return jsonify({"error": "User already exists"}), 409

    # Hash the password before storing it in the database
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

    # Prepare the user document for insertion
    user_document = {
        "name": data['name'],
        "email": data['email'],
        "password": hashed_password,
        "medicalNumber": data.get('medicalNumber', ''),  # Optional field
        "basket": [],
        "purchaseHistory": [],
        "role": "user"  # Default role
    }

    # Insert the new user into the database
    result = users_collection.insert_one(user_document)

    # Check if the user was successfully inserted
    if result.inserted_id:
        return jsonify({"message": "User registered successfully", "user_id": str(result.inserted_id)}), 201
    else:
        return jsonify({"error": "Registration failed"}), 500



# Show all items
@app.route('/items', methods=['GET'])
def get_all_items():
    # Find all items in the collection
    items = items_collection.find()
    
    # Convert the items to a list and then to a format that can be JSON serialized
    items_list = []
    for item in items:
        item['_id'] = str(item['_id'])  # Convert ObjectId to string for JSON serialization
        items_list.append(item)
    
    return jsonify(items_list), 200

    
# Show one item
@app.route('/items/<item_id>', methods=['GET'])
def get_item(item_id):
    try:
        # Convert the string ID to a MongoDB ObjectId
        object_id = ObjectId(item_id)
    except:
        # If the ID is not a valid ObjectId, return an error
        return jsonify({"error": "Invalid item ID format"}), 400
    
    # Find the item in the collection using the ObjectId
    item = items_collection.find_one({'_id': object_id})
    
    if item:
        # Convert ObjectId to string for JSON serialization
        item['_id'] = str(item['_id'])
        
        return jsonify(item), 200
    else:
        return jsonify({"error": "Item not found"}), 404


# Search for item


#####################################################################################################
###########################(GP Feature)##############################################################

# View GP Profile/Account
@app.route('/gp/profile/<gp_id>', methods=['GET'])
@jwt_required
def view_gp_profile(gp_id):
    # Convert gp_id from string to ObjectId to query MongoDB
    gp_object_id = ObjectId(gp_id)
    
    # Find the GP in the database by ID
    gp = GPS_collection.find_one({'_id': gp_object_id})

    if gp:
        # Convert MongoDB's ObjectId to string for JSON serialization
        gp['_id'] = str(gp['_id'])
        
        # Remove sensitive information, if any, before sending it to the client
        gp.pop('password', None)

        return jsonify(gp), 200
    else:
        return jsonify({"error": "GP not found"}), 404



# Edit GP Profile/Account
@app.route('/gp/edit_profile/<gp_id>', methods=['PUT'])
@jwt_required
def edit_gp_profile(gp_id):
    # Ensure the user requesting the edit is the GP or an admin
    current_user_id = request.current_user['user_id']
    current_user_role = request.current_user['role']
    gp_object_id = ObjectId(gp_id)

    # Only allow the GP or an admin to edit the profile
    if str(gp_object_id) != current_user_id and current_user_role != 'admin':
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json

    # Validate the input data as needed
    # Example: Ensure 'name' and 'contactNumber' are present if they are required fields
    update_data = {}
    if 'name' in data:
        update_data['name'] = data['name']
    if 'specialisation' in data:
        update_data['specialisation'] = data['specialisation']
    if 'contactNumber' in data:
        update_data['contactNumber'] = data['contactNumber']
    # Add more fields as necessary

    if not update_data:
        return jsonify({"error": "No valid fields provided for update"}), 400

    # Update the GP document in the database
    result = GPS_collection.update_one({'_id': gp_object_id}, {'$set': update_data})

    if result.matched_count:
        return jsonify({"message": "GP profile updated successfully"}), 200
    else:
        return jsonify({"error": "GP not found or update failed"}), 404



# Edit Appointment i.e change from pending to accepted/confirmed
@app.route('/appointments/edit_status/<appointment_id>', methods=['PUT'])
@jwt_required
def edit_appointment_status(appointment_id):
    # Extract the GP's ID from the JWT payload
    current_gp_id = ObjectId(request.current_user['user_id'])

    # Ensure the request is made by a GP
    if request.current_user['role'] != 'GP':
        return jsonify({"error": "Unauthorized"}), 403

    # Convert the appointment_id from string to ObjectId
    appointment_object_id = ObjectId(appointment_id)

    # Retrieve the new status from the request body
    data = request.json
    new_status = data.get('status')

    # Validate the new status
    if new_status not in ['accepted', 'confirmed', 'declined']:
        return jsonify({"error": "Invalid status"}), 400

    # Find the appointment and ensure it belongs to the current GP
    appointment = Appointments_collection.find_one({'_id': appointment_object_id, 'gpId': current_gp_id})
    
    if not appointment:
        return jsonify({"error": "Appointment not found or does not belong to this GP"}), 404

    # Update the appointment status
    result = Appointments_collection.update_one(
        {'_id': appointment_object_id, 'gpId': current_gp_id},
        {'$set': {'status': new_status}}
    )

    if result.modified_count:
        return jsonify({"message": "Appointment status updated successfully"}), 200
    else:
        return jsonify({"error": "Failed to update appointment status"}), 500



# View all GP Appointments
@app.route('/gp_appointments', methods=['GET'])
@jwt_required
def get_gp_appointments():
    if request.current_user['role'] == 'GP':
        gp_id = ObjectId(request.current_user['user_id'])

        # Retrieve appointments for the specified GP
        gp_appointments = Appointments_collection.find({"gpId": gp_id})

        # Convert MongoDB cursor to a list and handle ObjectId serialization
        appointments_list = []
        for appointment in gp_appointments:
            appointment['_id'] = str(appointment['_id'])
            appointment['userId'] = str(appointment['userId'])
            appointment['gpId'] = str(appointment['gpId'])
            appointments_list.append(appointment)

        return jsonify(appointments_list)
    else:
        return jsonify({"error": "Unauthorized access"}), 403

#######################################################################################################
###########################(User Feature)##############################################################


# View User Account/Show Profile
@app.route('/user_profile', methods=['GET'])
@jwt_required
def view_user_profile():
    current_user_id = ObjectId(request.current_user['user_id'])

    user = users_collection.find_one({'_id': current_user_id})
    if user:
        # Convert Object to string
        user['_id'] = str(user['_id'])

        # Takes out sensitive info like user passwords
        user.pop('password', None)
        return jsonify(user), 200
    else:
        return jsonify({"error": "User not found"}), 404

# View User Basket/Shopping Cart
@app.route('/user/basket/<string:user_id>', methods=['GET'])
@jwt_required
def view_user_basket(user_id):
    current_user_id = ObjectId(user_id)

    user = users_collection.find_one({'_id': current_user_id})
    if user:
        # Check if the user has a basket
        if 'basket' in user:
            return jsonify(user['basket']), 200
        else:
            return jsonify({"message": "User has no items in the basket"}), 200
    else:
        return jsonify({"error": "User not found"}), 404

# Add Items to User Basket/Shopping Cart
@app.route('/user/basket/add/<string:user_id>', methods=['POST'])
@jwt_required
def add_to_basket(user_id):
    current_user_id = ObjectId(user_id)

    # Get item details from request body
    data = request.json
    item_id = data.get('item_id')
    item_name = data.get('item_name')
    item_price = data.get('item_price')

    # Check if the user exists
    user = users_collection.find_one({'_id': current_user_id})
    if user:
        # Initialize the basket if it doesn't exist
        if 'basket' not in user:
            user['basket'] = []

        # Add the item to the basket
        user['basket'].append({
            'item_id': item_id,
            'item_name': item_name,
            'item_price': item_price
        })

        # Update the user document in the database
        users_collection.update_one({'_id': current_user_id}, {'$set': {'basket': user['basket']}})

        return jsonify({"message": "Item added to basket successfully"}), 200
    else:
        return jsonify({"error": "User not found"}), 404

# Remove Item from User Basket/Shopping Cart
@app.route('/user/<string:user_id>/basket/remove', methods=['POST'])
@jwt_required
def remove_from_basket(user_id):
    current_user_id = ObjectId(user_id)

    # Get item ID from request body
    data = request.json
    item_id = data.get('item_id')

    # Check if the user exists
    user = users_collection.find_one({'_id': current_user_id})
    if user:
        # Check if the user has a basket
        if 'basket' in user:
            # Remove the item from the basket if it exists
            updated_basket = [item for item in user['basket'] if item['item_id'] != item_id]

            # Update the user document in the database
            users_collection.update_one({'_id': current_user_id}, {'$set': {'basket': updated_basket}})
            return jsonify({"message": "Item removed from basket successfully"}), 200
        else:
            return jsonify({"error": "User has no items in the basket"}), 400
    else:
        return jsonify({"error": "User not found"}), 404


# Add a Review to an Item
@app.route('/items/<string:item_id>/add_review', methods=['POST'])
@jwt_required
def add_review(item_id):
    current_user_id = ObjectId(request.current_user['user_id'])

    # Get item ID from the URL parameter
    item_id = ObjectId(item_id)

    # Get review details from request body
    data = request.json
    rating = data.get('rating')
    comment = data.get('comment')

    # Get user's name from the database
    user = users_collection.find_one({'_id': current_user_id})
    if user:
        user_name = user.get('name', 'Unknown User')

        # Create a review object with user's name
        review = {
            "review_id": ObjectId(),
            "user_id": current_user_id,
            "name": user_name,
            "rating": rating,
            "comment": comment,
            "date": datetime.utcnow()
        }

        # Update the item's reviews array in the database
        items_collection.update_one(
            {'_id': item_id},
            {'$push': {'item_reviews': review}}
        )

        return jsonify({"message": "Review added successfully"}), 200
    else:
        return jsonify({"error": "User not found"}), 404


# Edit a Review 
@app.route('/items/<string:item_id>/reviews/<string:review_id>', methods=['PUT'])
@jwt_required
def edit_review(item_id, review_id):

    current_user_id = ObjectId(request.current_user['user_id'])

    # Converting into ObjectID
    item_id = ObjectId(item_id)
    review_id = ObjectId(review_id)

    # Get review details from the request body
    review_data = request.json
    new_rating = review_data.get('rating')
    new_comment = review_data.get('comment')

    # Find item in the database
    item = items_collection.find_one({'_id': item_id})
    if item:
        # Find the review to be edited
       for review in item['item_reviews']:
            if review['review_id'] == review_id and review['user_id'] == current_user_id:
                # Update the review details
                review['rating'] = new_rating
                review['comment'] = new_comment

                # Update the item in the database
                items_collection.update_one(
                    {'_id': item_id},
                    {'$set': {'item_reviews': item['item_reviews']}}
                )

                return jsonify({"message": "Review updated successfully"}), 200
            
            return jsonify({"error": "Review not found or unauthorized"}), 404
    else:
        return jsonify({"error": "Item not found"}), 404


# Delete a Review 
@app.route('/items/<string:item_id>/reviews/<string:review_id>', methods=['DELETE'])
@jwt_required
def delete_review(item_id, review_id):
    current_user_id = ObjectId(request.current_user['user_id'])

    # Get item ID from the URL parameter
    item_id = ObjectId(item_id)

    # Get review ID from the URL parameter
    review_id = ObjectId(review_id)

    # Find the item in the database
    item = items_collection.find_one({'_id': item_id})
    if item:
        # Find the review in the item's reviews array
        for review in item['item_reviews']:
            if review['review_id'] == review_id and (review['user_id'] == current_user_id or request.current_user['role'] == 'admin'):
                # Remove the review from the item's reviews array
                item['item_reviews'].remove(review)

                # Update the item in the database
                items_collection.update_one(
                    {'_id': item_id},
                    {'$set': {'item_reviews': item['item_reviews']}}
                )

                return jsonify({"message": "Review deleted successfully"}), 200

        return jsonify({"error": "Review not found or unauthorized"}), 404
    else:
        return jsonify({"error": "Item not found"}), 404


# Get all Users Item reviews
@app.route('/user/reviews', methods=['GET'])
@jwt_required
def get_user_reviews():
    current_user_id = ObjectId(request.current_user['user_id'])

    # Find all item reviews made by the current user
    user_reviews = items_collection.find({'item_reviews.user_id': current_user_id}, {'item_reviews.$': 1})

    # Get the reviews from the items and convert ObjectId to string
    reviews = []
    for item in user_reviews:
        for review in item.get('item_reviews', []):
            review['review_id'] = str(review['review_id'])
            review['user_id'] = str(review['user_id'])
            reviews.append(review)

    return jsonify(reviews), 200


# Create/Book an appointment
@app.route('/book/appointment', methods=['POST'])
@jwt_required
def book_appointment():
    current_user_id = ObjectId(request.current_user['user_id'])
    
    # Fetch user details from the database
    user = users_collection.find_one({'_id': current_user_id})
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Extract appointment details from request body
    data = request.json
    gp_id = ObjectId(data.get('gp_id'))
    appointment_date_str = data.get('appointment_date')

    try:
        # Convert appointment_date_str to datetime object
        appointment_date = datetime.strptime(appointment_date_str, '%Y-%m-%dT%H:%M:%S')
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400

    # Create a new appointment document
    new_appointment = {
        "userId": current_user_id,
        "gpId": gp_id,
        "userMedicalNumber": user.get('medicalNumber'),
        "dateTime": appointment_date,  
        "status": "pending",
        
    }

    # Insert the new appointment into the database
    result = Appointments_collection.insert_one(new_appointment)

    if result.inserted_id:
        return jsonify({"message": "Appointment booked successfully", "appointment_id": str(result.inserted_id)}), 200
    else:
        return jsonify({"error": "Failed to book appointment"}), 500

# Purchase Items
@app.route('/purchase', methods=['POST'])
@jwt_required
def purchase_items():
    current_user_id = ObjectId(request.current_user['user_id'])

    # Find the user in the database
    user = users_collection.find_one({'_id': current_user_id})
    if user:
        # Check if the user has items in their basket
        if 'basket' in user and len(user['basket']) > 0:
            # Transfer items from basket to purchase history
            purchase_items = user['basket']
            if 'purchaseHistory' not in user:
                user['purchaseHistory'] = []
            user['purchaseHistory'].extend(purchase_items)

            # Clear the user's basket
            user['basket'] = []

            # Update the user document in the database
            users_collection.update_one({'_id': current_user_id}, {'$set': {'basket': user['basket'], 'purchaseHistory': user['purchaseHistory']}})

            return jsonify({"message": "Items purchased successfully", "purchase_history": user['purchaseHistory']}), 200
        else:
            return jsonify({"error": "User's basket is empty"}), 400
    else:
        return jsonify({"error": "User not found"}), 404
    

# Get User Appointments
@app.route('/user_appointments/<string:user_id>', methods=['GET'])
@jwt_required
def get_user_appointments(user_id):
    try:
        # Convert the user_id to ObjectId 
        user_object_id = ObjectId(user_id)

        # Retrieve appointments for the specified user
        user_appointments = Appointments_collection.find({"userId": user_object_id})

        # Convert MongoDB cursor to a list and handle ObjectId serialization
        appointments_list = []
        for appointment in user_appointments:
            appointment['_id'] = str(appointment['_id'])
            appointment['userId'] = str(appointment['userId'])
            appointment['gpId'] = str(appointment['gpId'])
            appointments_list.append(appointment)

        return jsonify(appointments_list)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

########################################################################################################
###########################(Admin Feature)##############################################################

# Show all Users
@app.route('/admin/users', methods=['GET'])
@jwt_required
def get_all_users():
    # Check if the current user is an admin
    current_user_role = request.current_user.get('role')
    if current_user_role != 'admin':
        return jsonify({"error": "Unauthorized. Access restricted to admin users only."}), 403

    users = users_collection.find()
    
    # Convert the users to a list and then to a format that can be JSON serialized
    users_list = []
    for user in users:
        user['_id'] = str(user['_id'])  # Convert ObjectId to string for JSON serialization
        user.pop('password', None)  # It's a good practice to remove sensitive information
        users_list.append(user)
    
    return jsonify(users_list), 200

# show all GPs 
@app.route('/gps', methods=['GET'])
@jwt_required  
def get_all_gps():
    current_user_role = request.current_user.get('role')
    if current_user_role != 'admin':
        return jsonify({"error": "Unauthorized. Access restricted to admin users only."}), 403

    gps = GPS_collection.find()

    # Convert the GPs to a list and format for JSON serialization
    gps_list = []
    for gp in gps:
        gp['_id'] = str(gp['_id'])  # Convert ObjectId to string for JSON serialization
        gp.pop('password', None)  # Remove sensitive information before sending it to the client
        gps_list.append(gp)

    return jsonify(gps_list), 200


# Add an Item 
    

# Edit an Item 
    

# Delete an Item 

   
# Add a GP 
    

# Edit a GP's Info
    

# Delete a GP

if __name__ == "__main__":
    app.run(debug=True)
