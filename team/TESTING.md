# Testing Documentation

## Testing Framework

The tests for the Flask application are written using the pytest framework. This framework is chosen for its simplicity and powerful features for writing tests for Python applications. It allows for easy setup of test cases and fixtures, making it ideal for testing Flask applications.

## Tests Implemented

### 1. Test Adding a Song to a User's List (test_add_song)

- **Purpose**: This test ensures that a song can be successfully added to a user's list. It mocks the database connection and cursor to avoid actual database operations, simulating the process of adding a song to the database.
- **Method**: POST
- **Endpoint**: /api/add_song
- **Mocked Components**: Database connection and cursor.
- **Test Scenario**: The test mocks the database to simulate the user already having songs in their 'good' list and then attempts to add a new song to this list. It checks if the song is added successfully by verifying the response status code and message.

### 2. Test Retrieving a User's Song List by Type (test_get_user_songs)

- **Purpose**: To verify that the application can correctly retrieve a user's song list based on the song type (good, ok, bad).
- **Method**: GET
- **Endpoint**: /api/get_user_songs
- **Mocked Components**: Database connection and cursor.
- **Test Scenario**: The test mocks the database to return a predefined list of songs and then checks if the endpoint correctly retrieves this list. It also verifies that the response contains the expected song data and rating.

### 3. Test Updating a Song Entry in a User's List (test_update_song)

- **Purpose**: Ensures that the application can update a song's details (rank and review) in a user's list.
- **Method**: PUT
- **Endpoint**: /api/update_song
- **Mocked Components**: Database connection and cursor.
- **Test Scenario**: This test mocks the database update operation and checks if the song's details are successfully updated by verifying the response status code and message.

### 4. Test Deleting a Song from a User's List (test_delete_song)

- **Purpose**: Tests the functionality of removing a song from a user's list.
- **Method**: DELETE
- **Endpoint**: /api/delete_song
- **Mocked Components**: Database connection and cursor.
- **Test Scenario**: The test mocks the database delete operation to simulate the deletion of a song from the user's list and verifies the operation's success through the response status code and message.

## Conclusion

These tests are designed to cover the core functionalities related to managing a user's song list in the application, ensuring that songs can be added, retrieved, updated, and deleted correctly. By mocking database operations, these tests can run independently of an actual database, allowing for more efficient and isolated testing of the application logic.
