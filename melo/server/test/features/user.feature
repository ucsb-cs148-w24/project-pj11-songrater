Feature: User management

  Scenario: Creating a new user
    Given I have a new user with username "testuser", email "test@example.com", and description "A test user"
    When I send a POST request to create the user
    Then I should get a "200" response
    And the response should contain a message "Successfully created new user and added to db"

Feature: User song list retrieval

  Scenario: Retrieving a user's "good" song list
    Given I have a user with id "1"
    And the user has songs in their "good" list
    When I send a GET request to retrieve the user's "good" songs
    Then I should get a "200" response
    And the response should contain the user's songs