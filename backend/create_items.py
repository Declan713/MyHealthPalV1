from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

client = MongoClient("mongodb://127.0.0.1:27017")
db = client.MyHealthPal
items_collection = db.items

items_list = [
    {
        "name": "Electric Toothbrush",
        "item_image": "image.png",
        "category": "Health/Personal Care",
        "description": "High-powered electric toothbrush for effective oral hygiene.",
        "price": 39.99,
        "stock_quantity": 30,
        "item_reviews": [
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bca"),
                "name": "John Doe",
                "rating": 5,
                "comment": "Leaves my teeth feeling exceptionally clean.",
                "date": datetime.utcnow()
            },
        ],
    },
    {
        "name": "Essential Oil Diffuser",
        "item_image": "image.png",
        "category": "Health/Personal Care",
        "description": "Aromatherapy diffuser for a calming and relaxing atmosphere.",
        "price": 29.99,
        "stock_quantity": 80,
        "item_reviews": [
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bca"),
                "name": "John Doe",
                "rating": 4,
                "comment": "Lovely addition to my relaxation routine.",
                "date": datetime.utcnow()
            },
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bcb"), 
                "name": "Jane Smith",
                "rating": 3, 
                "comment": "Helps create a soothing environment.",
                "date": datetime.utcnow()
            },
        ],
    },
    {
        "name": "Digital Blood Pressure Monitor",
        "item_image": "image.png",
        "category": "Health/Personal Care",
        "description": "Accurate digital blood pressure monitor for at-home monitoring.",
        "price": 49.99,
        "stock_quantity": 50,
        "item_reviews": [
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bca"),
                "name": "John Doe",
                "rating": 3,
                "comment": "Easy to use and provides reliable readings.",
                "date": datetime.utcnow()
            },
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bcb"), 
                "name": "Jane Smith",
                "rating": 3,
                "comment": "A must-have for regular health check-ups.",
                "date": datetime.utcnow()
            },

        ],
    },
    {
        "name": "Weighted Blanket",
        "item_image": "image.png",
        "category": "Health/Personal Care",
        "description": "Calming weighted blanket for better sleep and relaxation.",
        "price": 69.99,
        "stock_quantity": 40,
        "item_reviews": [
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bca"),
                "name": "John Doe",
                "rating": 4, 
                "comment": "Helps alleviate anxiety and promotes deep sleep.",
                "date": datetime.utcnow()
            },
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bcb"), 
                "name": "Jane Smith",
                "rating": 4, 
                "comment": "Feels comforting and cozy.",
                "date": datetime.utcnow()
            },
        ],
    },
    {
        "name": "Fitness Tracker",
        "item_image": "image.png",
        "category": "Health/Personal Care",
        "description": "Smart fitness tracker for monitoring activity and health metrics.",
        "price": 79.99,
        "stock_quantity": 30,
        "item_reviews": [
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bca"),
                "name": "John Doe",
                "rating": 5,
                "comment": "Tracks steps, heart rate, and more accurately.",
                "date": datetime.utcnow()
            },
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bcb"), 
                "name": "Jane Smith",
                "rating": 5, 
                "comment": "Motivates me to stay active throughout the day.",
                "date": datetime.utcnow()
            },
        ],
    },
    {
        "name": "Whey Protein Powder",
        "item_image": "image.png",
        "category": "Sports and Nutrition",
        "description": "High-quality whey protein powder for muscle building and recovery.",
        "price": 29.99,
        "stock_quantity": 50,
        "item_reviews": [
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bca"),
                "name": "John Doe", 
                "rating": 4,
                "comment": "Great taste and mixes well.",
                "date": datetime.utcnow()
            },
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bcb"), 
                "name": "Jane Smith",
                "rating": 5, 
                "comment": "Effective for post-workout recovery.",
                "date": datetime.utcnow()
            },
        ],
    },
    {
        "name": "BCAA Capsules",
        "item_image": "image.png",
        "category": "Sports and Nutrition",
        "description": "Branched-chain amino acids (BCAA) capsules for improved endurance.",
        "price": 24.99,
        "stock_quantity": 60,
        "item_reviews": [
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bca"),
                "name": "John Doe", 
                "rating": 4,
                "comment": "Helps reduce muscle soreness after workouts.",
                "date": datetime.utcnow()
            },
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bcb"),
                "name": "Jane Smith", 
                "rating": 4, 
                "comment": "Boosts energy during long runs.",
                "date": datetime.utcnow()
            },
        ],
    },
    {
        "name": "Pre-Workout Energy Drink",
        "item_image": "image.png",
        "category": "Sports and Nutrition",
        "description": "Energizing drink with caffeine and electrolytes for pre-workout boost.",
        "price": 19.99,
        "stock_quantity": 40,
        "item_reviews": [
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bca"),
                "name": "John Doe",
                "rating": 4,
                "comment": "Gives a good energy kick before workouts.",
                "date": datetime.utcnow()
            },
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bcb"),
                "name": "Jane Smith", 
                "rating": 4, 
                "comment": "Great for intense training sessions.",
                "date": datetime.utcnow()
            },
        ],
    },
    {
        "name": "Vegan Protein Bars",
        "item_image": "image.png",
        "category": "Sports and Nutrition",
        "description": "Plant-based protein bars for a quick and nutritious snack.",
        "price": 2.49,
        "stock_quantity": 80,
        "item_reviews": [
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bca"),
                "name": "John Doe",
                "rating": 4,
                "comment": "Tastes amazing and good for on-the-go.",
                "date": datetime.utcnow()
            },
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bcb"),
                "name": "Jane Smith",
                "rating": 4, 
                "comment": "Perfect for a post-workout snack.",
                "date": datetime.utcnow()
            },
        ],
    },
    {
        "name": "Electrolyte Sports Drink Mix",
        "item_image": "image.png",
        "category": "Sports and Nutrition",
        "description": "Replenishing drink mix with electrolytes for hydration during exercise.",
        "price": 12.99,
        "stock_quantity": 55,
        "item_reviews": [
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bca"),
                "name": "John Doe",
                "rating": 4,
                "comment": "Keeps me hydrated during long runs.",
                "date": datetime.utcnow()
            },
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bcb"),
                "name": "Jane Smith", 
                "rating": 4, 
                "comment": "Great for cycling in hot weather.",
                "date": datetime.utcnow()
            },
        ],
    },
    {
        "name": "Multivitamin Tablets",
        "item_image": "image.png",
        "category": "Vitamins and Supplements",
        "description": "Comprehensive multivitamin tablets for overall health.",
        "price": 19.99,
        "stock_quantity": 100,
        "item_reviews": [
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bca"),
                "name": "John Doe",
                "rating": 4,
                "comment": "Great combination of essential vitamins.",
                "date": datetime.utcnow()
            },
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bcb"),
                "name": "Jane Smith",
                "rating": 4, 
                "comment": "Noticeable improvement in energy levels.",
                "date": datetime.utcnow()
            },
        ],
    },
    {
        "name": "Vitamin D3 Softgels",
        "item_image": "image.png",
        "category": "Vitamins and Supplements",
        "description": "Vitamin D3 supplement for bone health and immune support.",
        "price": 14.99,
        "stock_quantity": 80,
        "item_reviews": [
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bca"),
                "name": "John Doe",
                "rating": 4,
                "comment": "Essential for those with limited sun exposure.",
                "date": datetime.utcnow()
            },
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bcb"),
                "name": "Jane Smith",
                "rating": 4, 
                "comment": "Easy to take and effective.",
                "date": datetime.utcnow()
            },
        ],
    },
    {
        "name": "Fish Oil Capsules",
        "item_image": "image.png",
        "category": "Vitamins and Supplements",
        "description": "Omega-3 fish oil capsules for heart and brain health.",
        "price": 22.99,
        "stock_quantity": 60,
        "item_reviews": [
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bca"),
                "name": "John Doe",
                "rating": 4,
                "comment": "High-quality source of omega-3 fatty acids.",
                "date": datetime.utcnow()
            },
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bcb"),
                "name": "Jane Smith",
                "rating": 4, 
                "comment": "Supports cognitive function.",
                "date": datetime.utcnow()
            },
        ],
    },
    {
        "name": "Probiotic Supplements",
        "item_image": "image.png",
        "category": "Vitamins and Supplements",
        "description": "Probiotic capsules for gut health and digestive balance.",
        "price": 17.99,
        "stock_quantity": 90,
        "item_reviews": [
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bca"),
                "name": "John Doe",
                "rating": 4,
                "comment": "Improved digestion and immune system.",
                "date": datetime.utcnow()
            },
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bcb"),
                "name": "Jane Smith",
                "rating": 4, 
                "comment": "A staple for maintaining a healthy gut.",
                "date": datetime.utcnow()
            },
        ],
    },
    {
        "name": "Collagen Powder",
        "item_image": "image.png",
        "category": "Vitamins and Supplements",
        "description": "Collagen powder for skin, hair, and joint support.",
        "price": 29.99,
        "stock_quantity": 70,
        "item_reviews": [
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bca"),
                "name": "John Doe",
                "rating": 4,
                "comment": "Visible improvement in skin elasticity.",
                "date": datetime.utcnow()
            },
            {
                "review_id": ObjectId(),
                "user_id": ObjectId("65cba52b3954240754d76bcb"),
                "name": "Jane Smith",
                "rating": 4, 
                "comment": "Helps with joint flexibility.",
                "date": datetime.utcnow()
            },
        ],
    }, 
]

for new_item in items_list:
    items_collection.insert_one(new_item)