from lettuce import step, world
from flask import json
from app.app import app

@before.all
def before_all():
    world.app = app.test_client()

# For create_user endpoint:

@step(u'I have a new user with username "(.*)", email "(.*)", and description "(.*)"$')
def given_new_user(step, username, email, description):
    world.user_data = {'username': username, 'email': email, 'description': description}

@step(u'I send a POST request to create the user$')
def when_send_post_request(step):
    world.response = world.app.post('/api/signup', data=world.user_data)

@step(u'I should get a "(.*)" response$')
def then_response_code(step, expected_response):
    assert world.response.status_code == int(expected_response), \
        "Expected {}, got {}".format(expected_response, world.response.status_code)

@step(u'the response should contain a message "(.*)"$')
def and_response_message(step, expected_message):
    response_data = json.loads(world.response.data)
    assert response_data['MESSAGE'] == expected_message, \
        "Expected {}, got {}".format(expected_message, response_data['MESSAGE'])


# For get_user_songs endpoint:

@step(u'I send a GET request to retrieve the user\'s "(.*)" songs')
def when_send_get_request(step, list_type):
    world.response = world.app.get(f'/api/get_user_songs?user_id=1&type={list_type}')

@step(u'I should get a "(.*)" response$')
def then_response_code(step, expected_response):
    assert world.response.status_code == int(expected_response), \
        f"Expected {expected_response}, got {world.response.status_code}"

@step(u'the response should contain the user\'s songs')
def and_response_contains_songs(step):
    response_data = json.loads(world.response.data)
    assert 'results' in response_data, "Response does not contain user's songs"