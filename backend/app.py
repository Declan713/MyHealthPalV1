from flask import Flask, request, jsonify, send_from_directory
from functools import wraps
from pymongo import MongoClient, ASCENDING, DESCENDING
from bson import ObjectId
from flask.json import JSONEncoder
from flask_cors import CORS
import bcrypt
import jwt
from datetime import datetime, timedelta
import logging
from textblob import TextBlob
import spacy


logging.basicConfig(level=logging.DEBUG)

# Helps convert ObjectId to strings in every route.
class CustomJSONEncoder(JSONEncoder):
    """Extend JSONEncoder to add support for ObjectId."""
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super(CustomJSONEncoder, self).default(obj)

app = Flask(__name__)
app.json_encoder = CustomJSONEncoder
CORS(app)
app.config['SECRET_KEY'] = 'mysecret'
nlp_model = spacy.load('models/nlp_model')
nlp = spacy.load('en_core_web_sm')

client = MongoClient('mongodb://127.0.0.1:27017')
db = client.MyHealthPal
users_collection = db.users
GPS_collection = db.gps
Appointments_collection = db.appointments
items_collection = db.items
feedback_collection = db.feedback


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
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(" ")[1]
            decoded_token = decode_token(token)
            
            if 'error' not in decoded_token:
                request.current_user = decoded_token
                return func(*args, **kwargs)
        return jsonify({'message': 'Unauthorised access'}), 401

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
    return jsonify({"message": "Logged out successfully. Removed the token from your storage."}), 200


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
        "avatar": "man.png",
        "password": hashed_password,
        "medicalNumber": data['medicalNumber'],
        "basket": [],
        "purchaseHistory": [],
        "role": "user"
    }

    # Insert the new user into the database
    result = users_collection.insert_one(user_document)

    # Check if the user was successfully inserted
    if result.inserted_id:
        # Generate a token for the new user
        token = generate_token(result.inserted_id, "user") 
        return jsonify({"message": "User registered successfully", "token": token, "user_id": str(result.inserted_id), "role":"user"}), 201
    else:
        return jsonify({"error": "Registration failed"}), 500

# Images used
@app.route('/static/icons/<path:filename>')
def serve_image(filename):
    return send_from_directory('static/icons', filename)

@app.route('/static/background_img/<path:filename>')
def serve_background_image(filename):
    return send_from_directory('static/background_img', filename)

@app.route('/static/<path:filename>')
def serve_imagev2(filename):
    return send_from_directory('static', filename)

@app.route('/static/item_images/<path:filename>')
def serve_item_image(filename):
    return send_from_directory('static/item_images', filename)


# Show all items
@app.route('/items', methods=['GET'])
def get_all_items():
    page_num = int(request.args.get('pn', 1))
    page_size = int(request.args.get('ps', 12))
    sort_order = request.args.get('sort', 'name')
    sort_direction = ASCENDING if request.args.get('dir', 'asc') == 'asc' else DESCENDING

    items_list = []
    items = items_collection.find().sort(sort_order, sort_direction).skip(page_size * (page_num - 1)).limit(page_size)
    
    # Convert the items to a list and then to a format that can be JSON serialized
    for item in items:
        item['_id'] = str(item['_id'])
        for review in item["item_reviews"]:
            review["user_id"] = str(review["user_id"])
            review["review_id"] = str(review["review_id"])
        items_list.append(item)
    
    return jsonify(items_list), 200

# show one item
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
        
        # Convert any ObjectId fields in item_reviews to strings
        if 'item_reviews' in item:
            for review in item['item_reviews']:
                if 'user_id' in review:
                    review['user_id'] = str(review['user_id'])
                if 'review_id' in review:
                    review['review_id'] = str(review['review_id'])
        
        return jsonify(item), 200
    else:
        return jsonify({"error": "Item not found"}), 404



# Search for item
@app.route("/items/search", methods=["GET"])
def search_items():
    try:
        search_query = request.args.get("searchQuery", "")
        category = request.args.get("category", "")

        # Build the search filter
        search_filter = {}
        if search_query:
            search_filter["$text"] = {"$search": search_query}
        if category:
            search_filter["category"] = {"$regex": f"^{category}$", "$options": "i"}

        # Perform the search
        if search_filter:
            search_result = list(items_collection.find(search_filter))
        else:
            # If no search filters are provided, return all items
            search_result = list(items_collection.find())

        # Convert ObjectId to string
        search_result = [{
            "_id": str(item["_id"]),
            "name": item["name"],
            "item_image": item["item_image"],
            "category": item["category"],
            "description": item["description"],
            "price": item["price"],
            "stock_quantity": item["stock_quantity"],
            "item_reviews": item.get("item_reviews", [])
        } for item in search_result]

        return jsonify({"results": search_result}), 200

    except Exception as e:
        print(f"Error searching items: {e}")
        return jsonify({"message": "An error occurred while searching items"}), 500
    
#####################################################################################################
###########################(Chatbot Feature)##############################################################
await_feedback = False

@app.route('/api/chat', methods=['POST'])
def chat():
    global await_feedback
    # Checks if the request contains a 'message' key
    if not request.json or 'message' not in request.json:
        logging.error("Invalid request: No 'message' key found.")
        return jsonify({"response": "Invalid or no message provided."})
    
    user_message = request.json['message'].strip()

    # Checks if the message is empty after stripping the whitespaces
    if not user_message:
        logging.error("Empty message received.")
        return jsonify({"response": "Message is empty."})
    
    # Handles the feedback
    if await_feedback:
        # Preform the sentiment analysis on the feedback
        sentiment = TextBlob(user_message).sentiment
        await_feedback = False # Resets the flag

        # Store the feedback with the sentiment analysis in my database
        feedback_data = {
            "text": user_message,
            "sentiment_polarity_score": sentiment.polarity,
            "sentiment_subjective": sentiment.subjectivity,
        }
        feedback_collection.insert_one(feedback_data)

        thank_you_message = "Thank you for your feedback!"
        sentiment_response = f"Sentiment polarity: {sentiment.polarity}, subjectivity: {sentiment.subjectivity}"
        return jsonify({"response": thank_you_message, "sentiment": sentiment_response})

    # Process the chat message using the NLP modal
    logging.info(f"Processing message: {user_message}")
    doc = nlp_model(user_message)
    intents = doc.cats

    if not intents:
        logging.warning("No intents detected by the model.")
        return jsonify({"response": "No intents detected."})
    
    highest_intent = max(intents, key=intents.get)
    response = handle_intent(highest_intent, user_message)
    
    return jsonify({"response": response})

def handle_intent(intent, user_message):
    global await_feedback
    logging.info(f"Handling intent: {intent} for message: {user_message}")
    if any(word in user_message.lower() for word in ['bye', 'thanks', 'thank you for the help', 'thank you']):
        await_feedback = True
        return "No problem! Could you please give us a rating on how you liked are services? Just reply with your feedback."
    
    if intent == "navigation_help":
        return handle_navigation_query(user_message)
    elif intent == "health_advice":
        return handle_health_query(user_message)
    elif intent == "prescription_help":
        return handle_prescription_query(user_message)
    else:
        return "I'm sorry, I'm not sure how to help with that."
        
def handle_navigation_query(text):
    lower_text = text.lower()
    logging.info(f"Evaluating navigation query: {lower_text}")
    
    if 'logout' in lower_text:
        logging.info("Matched logout condition.")
        return "To logout of your account, click on the top right corner where it says 'Logout' in the navbar."
    elif 'add' in lower_text and 'basket' in lower_text:
        logging.info("Matched add to basket condition.")
        return "To add an item to your basket, click on the item you would like to add and click the 'Add to Basket' button."
    elif 'submit' in lower_text and 'review' in lower_text:
        logging.info("Matched submit review condition.")
        return "To submit a review, navigate to the item you want to review and scroll down to find the reviews section and hit the 'Add Review' button to bring up the form to add a review to that item."
    elif 'book' in lower_text and 'booking' in lower_text:
        logging.info("Matched booking condition.")
        return "To book an appointment with your GP please navigate to the Booking section by clicking the 'Booking' text in the navbar this should direct you to where you can book an appointment via a calendar."
    elif 'view' in lower_text and 'appointments' in lower_text:
        logging.info("Matched view appointments condition.")
        return "To view appointments made with your GP you must click on the 'Appointments' text in the navbar at the top. This should direct you to your past/future made appointments."
    elif 'account' in lower_text:
        logging.info("Matched account details condition.")
        return "You can view your account details by clicking 'Account' to navigate you to your profile menu"
    else:
        logging.info("No specific navigation query matched.")
        return "Can you please specify what help you need? I'm here to assist!"

def handle_health_query(text):
    lower_text = text.lower()
    if 'advice' in lower_text or 'health' in lower_text or 'symptoms' in lower_text:
        return "If you would like advice on any illnesses you have, you can book an appointment with your GP or you can visit (https://www.nhs.uk/conditions/) for some advice."
    elif 'high blood pressure' in lower_text:
            return "Managing high blood pressure involves maintaining a healthy diet, regular exercise, and sometimes medication. It's best to consult a healthcare provider for a plan tailored to your needs."
    elif 'anxious' in lower_text or 'anxiety' in lower_text:
        return "If you feel anxious, practicing mindfulness, meditation, and speaking with a mental health professional can be beneficial."
    elif 'diabetes' in lower_text:
        return "For diabetes treatment, maintaining blood sugar levels through diet, exercise, and medication is crucial. Please consult with a healthcare professional for detailed management strategies."
    elif 'cold' in lower_text:
        return "Common cold symptoms include sneezing, sore throat, and a runny nose. Rest, increased fluid intake, and over-the-counter meds might help alleviate the symptoms."
    elif 'flu' in lower_text:
        return "Flu symptoms can be treated with rest, fluids, and over-the-counter medications. If symptoms persist, seek medical advice as antiviral drugs might be needed."
    elif 'heart disease' in lower_text:
        return "Preventative measures for heart disease include maintaining a healthy weight, controlling your blood pressure, staying active, and eating a balanced diet."
    elif 'mental health care' in lower_text:
        return "Best practices for mental health care include regular exercise, keeping a balanced diet, getting enough sleep, and consulting a mental health professional."
    elif 'nutritional diets' in lower_text:
        return "Guidance on nutritional diets can vary widely depending on individual health needs, but generally includes eating a variety of foods to get a balanced intake of nutrients."
    elif 'skin problems' in lower_text:
        return "For skin problems, it's best to consult a dermatologist who can provide tailored advice based on your specific condition."
    elif 'asthma attack' in lower_text:
        return "During an asthma attack, use your rescue inhaler as prescribed and seek immediate medical help if symptoms continue to worsen."
    else:
        return "Can you specify what kind of health advice you need?"

def handle_prescription_query(text):
    lower_text= text.lower()
    if 'prescription' in lower_text:
        return "If you would like to get any prescriptions you may want to visit (https://medicare-group.com/pages/prescription-collection-delivery-service)."
    elif 'prescriptions' in lower_text:
        return "If you would like to get any prescriptions you may want to visit (https://medicare-group.com/pages/prescription-collection-delivery-service)."
    elif 'medication delivered' in lower_text:
        return "If you would like to get any prescriptions you may want to visit (https://medicare-group.com/pages/prescription-collection-delivery-service)."
    else:
        return "Can you please specify what help you need? I'm here to assist!"

#####################################################################################################
###########################(GP Feature)##############################################################

# View GP Profile/Account
@app.route('/gp/profile', methods=['GET'])
@jwt_required
def view_gp_profile():
    # Convert gp_id from string to ObjectId to query MongoDB
    current_gp_id = ObjectId(request.current_user['user_id'])
    
    # Find the GP in the database by ID
    gp = GPS_collection.find_one({'_id': current_gp_id})
    if gp:
        # Convert ObjectId to string 
        gp['_id'] = str(gp['_id'])
        
        # Takes out sensitive info like user passwords
        gp.pop('password', None)
        return jsonify(gp), 200
    else:
        return jsonify({"error": "GP not found"}), 404


# Edit Appointment i.e change from pending to accepted/confirmed
@app.route('/appointments/edit_status/<appointment_id>', methods=['PUT'])
@jwt_required
def edit_appointment_status(appointment_id):
    # Extract the GP's ID from the JWT payload
    current_gp_id = ObjectId(request.current_user['user_id'])

    # Ensure the request is made by a GP
    if request.current_user['role'] != 'GP':
        return jsonify({"error": "Unauthorised"}), 403

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
        try:
            gp_id = ObjectId(request.current_user['user_id'])
            
            # Retrieve appointments for the specified Gp
            gp_appointments = Appointments_collection.find({"gpId": gp_id})
            
            # Convert MongoDB cursor to a list and handle ObjectId serialisation
            appointments_list = []
            for appointment in gp_appointments:
                # Fetch User details for each appointment
                user_details = users_collection.find_one({"_id": appointment['userId']})
                if user_details:
                    appointment['userName'] =user_details.get('name', 'Unknown User')
                appointments_list.append(appointment)
            
            return jsonify(appointments_list), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

#######################################################################################################
###########################(User Feature)##############################################################


# View User Account/Show Profile
@app.route('/user_profile', methods=['GET'])
@jwt_required
def getUserProfile():
    current_user_id = ObjectId(request.current_user['user_id'])

    user = users_collection.find_one({'_id': current_user_id})
    if user:
        # Convert ObjectId to string
        user['_id'] = str(user['_id'])

        # Takes out sensitive info like user passwords
        user.pop('password', None)
        return jsonify(user), 200
    else:
        return jsonify({"error": "User not found"}), 404

# View User Basket/Shopping Cart
@app.route('/user/basket', methods=['GET'])
@jwt_required
def view_user_basket():
    current_user_id = ObjectId(request.current_user['user_id'])

    user = users_collection.find_one({'_id': current_user_id})
    if user:
        # Check if the user has a basket
        if 'basket' in user:
            return jsonify(user['basket']), 200
        else:
            return jsonify({"message": "User has no items in the basket"}), 200
    else:
        return jsonify({"error": "User not found"}), 404


# Get user basket count
@app.route('/api/user/basket/count', methods=['GET'])
@jwt_required
def get_basket_count():
    current_user_id = request.current_user['user_id']
    user = users_collection.find_one({'_id': ObjectId(current_user_id)})

    if user and 'basket' in user:
        total_quantity = sum(item['quantity'] for item in user['basket'])
        return jsonify({"count": total_quantity}), 200
    else:
        return jsonify({"count": 0}), 200



# Add Items to User Basket/Shopping Cart
@app.route('/user/basket/add', methods=['POST'])
@jwt_required
def add_to_basket():
    current_user_id = ObjectId(request.current_user['user_id'])

    # Get item details from request body
    item_id = request.json.get("_id")
    quantity = int(request.json.get("quantity", 1))
    if not item_id:
        return jsonify({"error": "Missing item ID"}), 400

    item = items_collection.find_one({"_id": ObjectId(item_id)})
    if not item:
        return jsonify({"error": "Item not found"}), 404

    # Create an update query that checks if the item already exists in the basket
    update_result = users_collection.update_one(
        {"_id": current_user_id, "basket._id": ObjectId(item_id)},
        {"$inc": {"basket.$.quantity": quantity}}
    )

    if update_result.modified_count == 0:
        # If the item does not exist in the basket, add it with the initial quantity
        update_result = users_collection.update_one(
        {"_id": current_user_id},
        {"$push": {"basket": {"_id": item["_id"], "name": item["name"], "price": item["price"], "item_image": item["item_image"], "quantity": quantity}}}
    )

    if update_result.modified_count:
        return jsonify({"message": "Item added to basket successfully"}), 200
    else:
        return jsonify({"error": "Failed to add item to basket"}), 500


# Remove Item from User Basket/Shopping Cart
@app.route('/user/basket/update', methods=['POST'])
@jwt_required
def update_basket():
    current_user_id = ObjectId(request.current_user['user_id'])
    item_id = request.json.get('_id')

    # Set decrement to 1 to ensure only one unit is reduced
    decrement = 1

    # logging.debug("User ID: %s", current_user_id)
    # logging.debug("Request Data: %s", request.json)
    # logging.debug("Attempting to decrement item with ID %s for user %s by %d", item_id, current_user_id, decrement)

    # Update the quantity by reducing it by one
    result = users_collection.update_one(
        {'_id': current_user_id, 'basket._id': ObjectId(item_id)},
        {'$inc': {'basket.$.quantity': -decrement}}
    )

    if result.modified_count == 0:
        logging.error("Item not found in basket or decrement not applicable: %s", item_id)
        return jsonify({"error": "Item not found in basket or decrement not applicable"}), 404

    # After reducing, find the item to check if its quantity is zero
    user = users_collection.find_one(
        {'_id': current_user_id, 'basket._id': ObjectId(item_id)},
        {'basket.$': 1})
    
    item = user['basket'][0] if user and 'basket' in user and len(user['basket']) > 0 else None

    # If quantity is zero or less, remove the item from the basket
    if item and item['quantity'] <= 0:
        remove_result = users_collection.update_one(
            {'_id': current_user_id},
            {'$pull': {'basket': {'_id': ObjectId(item_id)}}}
        )
        if remove_result.modified_count == 0:
            logging.error("Failed to remove item with zero quantity: %s", item_id)
            return jsonify({"error": "Failed to remove item with zero quantity"}), 404
        logging.info("Item removed from basket due to zero quantity for user %s", current_user_id)

    # logging.info("Basket updated successfully for user %s", current_user_id)
    return jsonify({"message": "Basket updated successfully"}), 200


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

# Edit Review
@app.route('/items/<string:item_id>/reviews/<string:review_id>', methods=['PUT'])
@jwt_required
def edit_review(item_id, review_id):
    print(f"Editing review for item {item_id} and review {review_id}")
    current_user_id = ObjectId(request.current_user['user_id'])

    item_id = ObjectId(item_id)
    review_id = ObjectId(review_id)

    review_data = request.json
    new_rating = review_data.get('rating')
    new_comment = review_data.get('comment')

    item = items_collection.find_one({'_id': item_id})
    if item:
        found_review = False
        for review in item['item_reviews']:
            print(f"Checking review {review['review_id']} for user {review['user_id']}")
            if review['review_id'] == review_id and review['user_id'] == current_user_id:
                found_review = True
                review['rating'] = new_rating
                review['comment'] = new_comment
                break

        if found_review:
            items_collection.update_one(
                {'_id': item_id},
                {'$set': {'item_reviews': item['item_reviews']}}
            )
            return jsonify({"message": "Review updated successfully"}), 200
        else:
            return jsonify({"error": "Review not found or unauthorised"}), 404
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

        return jsonify({"error": "Review not found or unauthorised"}), 404
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
    logging.info("Received request to book an appointment")
    try:
        current_user_id = ObjectId(request.current_user['user_id'])
        data = request.json
        medical_number = data.get('medicalNumber')
        appointment_date_str = data.get('appointment_date')

        logging.debug(f"Data received: {data}")

        # Fetch user details from the database
        user = users_collection.find_one({'_id': current_user_id})
        if not user:
            logging.error("User not found")
            return jsonify({"error": "User not found"}), 404

        # Find the GP using the medical number
        gp = GPS_collection.find_one({"medicalNumbers": medical_number})
        if not gp:
            logging.error("GP not found for the provided medical number")
            return jsonify({"error": "GP not found for the provided medical number"}), 404

        # Convert appointment_date_str to datetime object
        appointment_date = datetime.strptime(appointment_date_str, '%Y-%m-%dT%H:%M')

        # Check for conflicting appointments within a 2-hour window
        min_time = appointment_date - timedelta(hours=2)
        max_time = appointment_date + timedelta(hours=2)
        conflict = Appointments_collection.find_one({
            "gpId": gp['_id'],
            "dateTime": {"$gte": min_time, "$lte": max_time}
        })
        if conflict:
            logging.error("There is a conflicting appointment within 2 hours of the requested time")
            return jsonify({"error": "Appointment time conflict within 2 hours"}), 409

        # Create a new appointment document
        new_appointment = {
            "userId": current_user_id,
            "gpId": gp['_id'],
            "userMedicalNumber": medical_number,
            "dateTime": appointment_date,
            "status": "pending...",
        }

        # Insert the new appointment into the database
        result = Appointments_collection.insert_one(new_appointment)
        if result.inserted_id:
            return jsonify({"message": "Appointment booked successfully", "appointment_id": str(result.inserted_id)}), 200
        else:
            logging.error("Failed to insert the appointment into the database")
            return jsonify({"error": "Failed to book appointment"}), 500
    except Exception as e:
        logging.exception("Failed to process the appointment booking")
        return jsonify({"error": str(e)}), 400
    

# Delete/Clear appointment if declined by GP
@app.route('/appointments/delete_declined/<appointment_id>', methods=['DELETE'])
@jwt_required
def delete_declined_appointment(appointment_id):
    current_user_id = ObjectId(request.current_user['user_id'])

    try:
        appointment = Appointments_collection.find_one({'_id': ObjectId(appointment_id)})
        if not appointment:
            return jsonify({"error": "Appointment not found"}), 404

        # Check if the current user is the owner of the appointment
        if appointment['userId'] != current_user_id:
            return jsonify({"error": "Unauthorised access"}), 403
        
        # Check if the appointment is declined
        if appointment['status'] != 'declined':
            return jsonify({"error": "Only declined appointments can be deleted"}), 400

        # Perform the deletion if the status is declined
        result = Appointments_collection.delete_one({'_id': ObjectId(appointment_id)})
        if result.deleted_count:
            return jsonify({"message": "Appointment deleted successfully"}), 200
        else:
            return jsonify({"error": "Failed to delete appointment"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 400

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
            if 'purchaseHistory' not in user:
                user['purchaseHistory'] = []

            for basket_item in user['basket']:
                # Check if item already exists in the purchase history
                found = False
                for purchased_item in user['purchaseHistory']:
                    if purchased_item['name'] == basket_item['name']:
                        # If item exists, update quantity and total price
                        purchased_item['quantity'] += basket_item['quantity']
                        purchased_item['totalPrice'] = purchased_item['quantity'] * basket_item['price']
                        found = True
                        break

                if not found:
                    # If item isn't in the purchase history
                    new_purchase = {
                        'name': basket_item['name'],
                        'quantity': basket_item['quantity'],
                        'price': basket_item['price']
                    }
                    user['purchaseHistory'].append(new_purchase)

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
        user_object_id = ObjectId(user_id)
        user_appointments = Appointments_collection.find({"userId": user_object_id})

        appointments_list = []
        for appointment in user_appointments:
            # Fetch GP details for each appointment
            gp_details = GPS_collection.find_one({"_id": appointment['gpId']})
            if gp_details:
                appointment['gpName'] = gp_details.get('name', 'Unknown GP')
            appointments_list.append(appointment)

        return jsonify(appointments_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

########################################################################################################
###########################(Admin Feature)##############################################################

# View Admin Account/Show Profile
@app.route('/admin/profile', methods=['GET'])
@jwt_required
def view_admin_profile():
    # Ensure the user requesting the profile is an admin
    if request.current_user.get('role') != 'admin':
        return jsonify({"error": "Unauthorised. Access restricted to admin users only."}), 403

    admin_id = ObjectId(request.current_user['user_id'])
    admin = users_collection.find_one({'_id': admin_id})

    if admin:
        admin['_id'] = str(admin['_id'])

        admin.pop('password', None)

        return jsonify(admin), 200
    else:
        return jsonify({"error": "Admin not found"}), 404


# Show all Users
@app.route('/admin/users', methods=['GET'])
@jwt_required
def get_all_users():
    # Check if the current user is an admin
    current_user_role = request.current_user.get('role')
    if current_user_role != 'admin':
        return jsonify({"error": "Unauthorised. Access restricted to admin users only."}), 403

    users = users_collection.find({}, {'password': 0, 'basket': 0})  # Exclude fields password and basket
    users_list = list(users)

    # Convert MongoDB's ObjectId to string
    for user in users_list:
        user['_id'] = str(user['_id'])

    return jsonify(users_list)

# Edit User
@app.route('/admin/edit_user/<user_id>', methods=['PUT'])
@jwt_required
def edit_user(user_id):
    print(f"Editing User ID: {user_id}")
    if request.current_user.get('role') != 'admin':
        return jsonify({"error": "Unauthorised. Access restricted to admin users only."}), 403

    try:
        user_id = ObjectId(user_id)
    except:
        return jsonify({"error": "Invalid user ID format"}), 400

    data = request.json
    update_data = {}
    for field in ['name', 'email', 'medicalNumber', 'avatar']:
        if field in data:
            update_data[field] = data[field]

    if not update_data:
        return jsonify({"error": "No update data provided"}), 400

    result = users_collection.update_one({'_id': user_id}, {'$set': update_data})

    if result.matched_count:
        return jsonify({"message": "User updated successfully"}), 200
    else:
        return jsonify({"error": "User not found"}), 404
    
# Delete a User
@app.route('/admin/delete_user/<user_id>', methods=['DELETE'])
@jwt_required
def delete_user(user_id):
    print(f"Deleting User ID: {user_id}")
    if request.current_user.get('role') != 'admin':
        return jsonify({"error": "Unauthorised. Access restricted to admin users only."}), 403
    
    try:
        user_id = ObjectId(user_id)
    except:
        return jsonify({"error": "Invalid user ID format"}), 400

    result = users_collection.delete_one({'_id': user_id})

    if result.deleted_count:
        return jsonify({"message": "User deleted successfully"}), 200
    else:
        return jsonify({"error": "User not found"}), 404




  
# show all GPs 
@app.route('/gps', methods=['GET'])
@jwt_required  
def get_all_gps():
    current_user_role = request.current_user.get('role')
    if current_user_role != 'admin':
        return jsonify({"error": "Unauthorised. Access restricted to admin users only."}), 403

    gps = GPS_collection.find()

    # Convert the GPs to a list
    gps_list = []
    for gp in gps:
        gp['_id'] = str(gp['_id'])  
        gp.pop('password', None)  
        gps_list.append(gp)

    return jsonify(gps_list), 200


# Add an Item 
@app.route('/admin/add_item', methods=['POST'])
@jwt_required
def add_item():
    # Check if the current user is an admin
    if request.current_user.get('role') != 'admin':
        return jsonify({"error": "Unauthorised. Access restricted to admin users only."}), 403

    data = request.json

    # Validate the item data
    if not data.get('name') or not data.get('price') or not data.get('stock_quantity'):
        return jsonify({"error": "Missing required item information"}), 400

    # Prepare the item document for insertion
    item_document = {
        "name": data.get('name'),
        "item_image": data.get('item_image', 'man.png'),  
        "category": data.get('category', 'New-Item'), 
        "description": data.get('description', ''),
        "price": data.get('price'),
        "stock_quantity": data.get('stock_quantity'),
        "item_reviews": [] 
    }

    # Insert the new item into the database
    result = items_collection.insert_one(item_document)

    # Check if the item was successfully inserted
    if result.inserted_id:
        return jsonify({"message": "Item added successfully", "item_id": str(result.inserted_id)}), 201
    else:
        return jsonify({"error": "Failed to add the item"}), 500


# Edit an Item 
@app.route('/admin/edit_item/<item_id>', methods=['PUT'])
@jwt_required
def edit_item(item_id):
    # Check if the current user is an admin
    if request.current_user.get('role') != 'admin':
        return jsonify({"error": "Unauthorised. Access restricted to admin users only."}), 403

    try:
        # Convert the item_id to ObjectId
        object_id = ObjectId(item_id)
    except:
        return jsonify({"error": "Invalid item ID format"}), 400

    data = request.json

    # Create update object
    update_data = {}
    for field in ['name', 'item_image', 'category', 'description', 'price', 'stock_quantity']:
        if field in data:
            update_data[field] = data[field]

    if not update_data:
        return jsonify({"error": "No update data provided"}), 400

    # Update the item in the database
    result = items_collection.update_one({'_id': object_id}, {'$set': update_data})

    if result.matched_count:
        return jsonify({"message": "Item updated successfully"}), 200
    else:
        return jsonify({"error": "Item not found"}), 404


# Delete an Item 
@app.route('/admin/delete_item/<item_id>', methods=['DELETE'])
@jwt_required
def delete_item(item_id):
    # Check if the current user is an admin
    if request.current_user.get('role') != 'admin':
        return jsonify({"error": "Unauthorised. Access restricted to admin users only."}), 403

    try:
        # Convert the item_id to ObjectId
        object_id = ObjectId(item_id)
    except:
        return jsonify({"error": "Invalid item ID format"}), 400

    # Delete the item from the database
    result = items_collection.delete_one({'_id': object_id})

    if result.deleted_count:
        return jsonify({"message": "Item deleted successfully"}), 200
    else:
        return jsonify({"error": "Item not found"}), 404

   
# Add a GP 
@app.route('/admin/add_gp', methods=['POST'])
@jwt_required
def add_gp():
    if request.current_user.get('role') != 'admin':
        return jsonify({"error": "Unauthorised. Access restricted to admin users only."}), 403

    data = request.json
    required_fields = ['name', 'specialisation', 'contactNumber', 'email', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Hash the password that is given
    try:
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    except Exception as e:
        return jsonify({"error": "Error hashing password", "details": str(e)}), 500
    
    # Data that will be put into the Gps collection
    new_gp = {
        "name": data.get('name'),
        "specialisation": data.get('specialisation'),
        "contactNumber": data.get('contactNumber'),
        "medicalNumbers": data.get('medicalNumbers', []),
        "email": data.get('email'),
        "password": hashed_password,
        "admin": False,
        "role": "GP",
        "avatar": data.get('avatar', 'man.png')
    }
    GPS_collection.insert_one(new_gp)
    return jsonify({"message": "GP added successfully"}), 201


# Edit a GP's Info
@app.route('/admin/edit_gp/<gp_id>', methods=['PUT'])
@jwt_required
def edit_gp(gp_id):
    # print(f"Editing GP ID: {gp_id}")
    if request.current_user.get('role') != 'admin':
        return jsonify({"error": "Unauthorised. Access restricted to admin users only."}), 403
    
    try:
        gp_id = ObjectId(gp_id)
    except:
        return jsonify({"error": "Invalid GP ID format"}), 400

    data = request.json
    update_data = {}

    for field in ['name', 'specialisation', 'contactNumber', 'medicalNumbers', 'email']:
        if field in data:
            update_data[field] = data[field]

    if not update_data:
        return jsonify({"error": "No update data provided"}), 400

    result = GPS_collection.update_one({'_id': gp_id}, {'$set': update_data})

    if result.matched_count:
        return jsonify({"message": "GP updated successfully"}), 200
    else:
        return jsonify({"error": "GP not found"}), 404


# Delete a GP
@app.route('/admin/delete_gp/<gp_id>', methods=['DELETE'])
@jwt_required
def delete_gp(gp_id):
    if request.current_user.get('role') != 'admin':
        return jsonify({"error": "Unauthorised. Access restricted to admin users only."}), 403
    
    try:
        gp_id = ObjectId(gp_id)
    except:
        return jsonify({"error": "Invalid GP ID format"}), 400

    result = GPS_collection.delete_one({'_id': gp_id})

    if result.deleted_count:
        return jsonify({"message": "GP deleted successfully"}), 200
    else:
        return jsonify({"error": "GP not found"}), 404



if __name__ == "__main__":
    app.run(debug=True)
