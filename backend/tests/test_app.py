from app import app
import pytest
import json
import logging




# Set up basic configuration for logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')


@pytest.fixture
def client():
    """Fixture to setup Flask test client."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        logging.debug("Starting a test case with test client.")
        yield client
        logging.debug("Ending test case.")



def test_login(client):
    """Test login with predefined user credentials."""
    logging.info("Testing login for test@gmail.com")
    response = client.post('/login', json={
        'email': 'test@gmail.com',
        'password': 'tester'
    })
    # Checks status code for a successful login is 200 and includes a token in the response
    assert response.status_code == 200
    assert 'token' in json.loads(response.data)
    logging.debug("Login test passed for test@gmail.com")




def test_logout(client):
    """Test the logout functionality."""
    logging.info("Testing logout for a logged-in user.")
    login_response = client.post('/login', json={
        'email': 'test@gmail.com',
        'password': 'tester'
    })
    token = json.loads(login_response.data)['token']
    response = client.post('/logout', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200
    assert 'Logged out successfully' in response.get_json()['message']
    logging.debug("Logout test passed.")


# def test_register_new_user(client):
#     """Test registration of a new user."""
#     logging.info("Testing registration for a new user: John Doe")
#     response = client.post('/register', json={
#         'name': 'John Doe',
#         'email': 'john.doe@example.com',
#         'password': 'securepassword123',
#         'medicalNumber': '1234567890'
#     })
#     assert response.status_code == 201
#     assert 'User registered successfully' in response.get_json()['message']



def test_duplicate_register(client):
    """Test registration with an already registered email."""
    logging.info("Testing duplicate registration for test@gmail.com")
    response = client.post('/register', json={
        'name': 'test user',
        'email': 'test@gmail.com',
        'password': 'tester',
        'medicalNumber': 'BB1'
    })
    assert response.status_code == 409
    assert 'User already exists' in response.get_json()['error']
    logging.debug("Duplicate registration test passed for test@gmail.com.")


def test_user_profile_access(client):
    """Test user profile access."""
    logging.info("Testing profile access for user: test@gmail.com")
    login_response = client.post('/login', json={'email': 'test@gmail.com', 'password': 'tester'})
    token = json.loads(login_response.data)['token']
    response = client.get('/user_profile', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200
    assert 'name' in response.get_json()  
    logging.debug("User profile access test passed for test@gmail.com.")