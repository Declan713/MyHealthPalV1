import spacy
from spacy.training import Example
import json
import random
from pathlib import Path

def load_training_data(data_path="train_data.json"):
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    train_data = []
    # Create a set of unique intents
    intents = {item['intent'] for item in data} 
    for group in data:
        for example in group['examples']:
            cats = {intent: 0 for intent in intents} 
            cats[group['intent']] = 1
            train_data.append((example, cats))
    return train_data


# Function to train the SpaCy NLP model
def train_spacy(train_data, iterations=10):
    nlp = spacy.blank('en')
    config = {
        "model": {
            "@architectures": "spacy.TextCatBOW.v2", # Bag of Words architecture
            "exclusive_classes": True,
            "ngram_size": 1,
            "no_output_layer": False
        }
    }
    textcat = nlp.add_pipe("textcat", config=config)
    # Add labels to the model based on the unique intents
    textcat.add_label("navigation_help")
    textcat.add_label("health_advice")
    textcat.add_label("prescription_help")

    # Training the model
    nlp.initialize()
    for itn in range(iterations): # Training loop
        random.shuffle(train_data) # Shuffle training data each iteration
        losses = {}
        for text, cats in train_data:
            doc = nlp.make_doc(text) # Create a document object from the text
            example = Example.from_dict(doc, {'cats': cats}) # Create an example with the text and categories
            nlp.update([example], drop=0.2, losses=losses) # Update the model
        print(f"Iteration {itn}: Losses {losses}")

    return nlp


if __name__ == '__main__':
    train_data = load_training_data()
    model = train_spacy(train_data)
    model_dir = Path("C:/Users/Cool_Vibration$/Documents/MainProject/MyHealthPalV1/backend/models/nlp_model")
    model.to_disk(model_dir)
    print("Model trained and saved to disk at", model_dir)
