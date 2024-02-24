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

## Unit Testing Implementation

1. **Unit Test Implementation**: We implemented unit tests using the pytest library, focusing on the core functionalities of our Flask application, such as adding, retrieving, updating, and deleting songs from a user's list. These tests are located in `melo/server/test/test_app.py`.
2. **Plans for Unit Testing**: We plan to continue using pytest for unit testing, focusing on critical areas of the application. While we see the value in comprehensive unit testing, we aim to balance it with development speed, focusing on high-impact areas.

## Component/Integration/End-to-End Testing

1. **Higher-Level Testing Implementation**: For component, integration, and end-to-end testing, we utilized the Lettuce framework to write behavior-driven development (BDD) tests, specifically targeting the `get_user_songs` and `create_user` endpoints in `app.py`. These tests are defined in `melo/server/test/features/steps.py`.
2. **Plans for Higher-Level Testing**: Moving forward, we plan to expand our BDD tests with Lettuce to cover more scenarios and endpoints, ensuring that the application behaves as expected from an end-user perspective.

## Conclusion
These testing strategies are designed to ensure the reliability and correctness of our Flask application, from individual units to the entire system's behavior. By using pytest for unit testing and Lettuce for higher-level BDD tests, we aim to maintain a high-quality application while efficiently managing our development resources.
