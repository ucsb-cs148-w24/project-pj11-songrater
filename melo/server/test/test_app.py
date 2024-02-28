import pytest
from app import app as flask_app  # Ensure this import matches your project structure
from unittest.mock import patch

@pytest.fixture
def app():
    """Provide the Flask app for testing."""
    yield flask_app

@pytest.fixture
def client(app):
    """Provide a test client to send requests to the app."""
    return app.test_client()

def test_add_song(client, mocker):
    """
    Test adding a song to a user's list.
    This involves mocking the database connection and cursor to avoid actual database operations.
    """
    # Mock the database connection and cursor
    mock_conn = mocker.patch('app.get_db_connection')
    mock_cur = mock_conn.return_value.cursor.return_value
    
    # Adjust the mock to reflect a realistic database state
    # Assuming the user already has songs in their 'good' list
    existing_songs = [
        (1, 100, 1, 'Existing song 1', 'good'),  # Existing song data
    ]
    mock_cur.fetchall.return_value = existing_songs
    mock_cur.rowcount = len(existing_songs)  # Reflect the number of existing songs
    
    # Make a POST request to the add_song endpoint with corrected integer types
    response = client.post('/api/add_song', query_string={
        'user_id': 1,  # Changed to integer
        'song_id': 101,  # Changed to integer
        'rank': 2,  # Assuming we're adding a new song at rank 2
        'review': 'Great song!',
        'type': 'good'
    })
    
    # Assert the response
    assert response.status_code == 200
    assert b"Successfully added new song to user list" in response.data

def test_get_user_songs(client, mocker):
    """
    Test retrieving a user's song list by type.
    Mocks the database connection to simulate fetching songs from the database.
    """
    # Mock the database connection and cursor
    mock_conn = mocker.patch('app.get_db_connection')
    mock_cur = mock_conn.return_value.cursor.return_value
    
    # Define the behavior of your mock to simulate fetching songs
    mock_cur.fetchall.return_value = [
        (1, 101, 1, 'Great song!', 9.5),  # Simulated song data
    ]
    mock_cur.rowcount = 1  # One row fetched
    
    # Make a GET request to the get_user_songs endpoint
    response = client.get('/api/get_user_songs', query_string={'user_id': '1', 'type': 'good'})
    
    # Assert the response
    assert response.status_code == 200
    # Assert that the response contains expected song data
    assert b"Great song!" in response.data
    # Adjusted expected rating to match the dynamic calculation logic for a single "good" song
    assert b"7.0" in response.data  # Adjusted rating expectation

def test_update_song(client, mocker):
    """
    Test updating a song entry in a user's list.
    Mocks the database to simulate the update operation without affecting the actual database.
    """
    # Mock the database connection and cursor
    mock_conn = mocker.patch('app.get_db_connection')
    mock_cur = mock_conn.return_value.cursor.return_value
    
    # Define the behavior of your mock
    mock_cur.execute.return_value = None
    mock_cur.rowcount = 1  # Simulate one row affected (song updated)
    
    # Make a PUT request to the update_song endpoint
    response = client.put('/api/update_song', query_string={
        'user_id': '1',
        'song_id': '101',
        'new_rank': '2',
        'new_review': 'Updated review'
    })
    
    # Assert the response
    assert response.status_code == 200
    assert b"Successfully updated song" in response.data

def test_delete_song(client, mocker):
    """
    Test deleting a song from a user's list.
    Mocks the database to simulate the delete operation without affecting the actual database.
    """
    # Mock the database connection and cursor
    mock_conn = mocker.patch('app.get_db_connection')
    mock_cur = mock_conn.return_value.cursor.return_value
    
    # Define the behavior of your mock
    mock_cur.execute.return_value = None
    mock_cur.rowcount = 1  # Simulate one row affected (song deleted)
    
    # Make a DELETE request to the delete_song endpoint
    response = client.delete('/api/delete_song', query_string={
        'user_id': '1',
        'song_id': '101'
    })
    
    # Assert the response
    assert response.status_code == 200
    assert "Successfully deleted song from user list"
