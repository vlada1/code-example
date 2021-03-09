Feature: Logging in

  Scenario: Entering credentials and clicking the login button
    Given an instance of our Login component
    When  I enter a username
    And   I enter a password
    And   I click the login button
    Then  I expect the login handler method to be executed
    And   I expect app to go to main page

  Scenario: Entering wrong credentials, clicking the login button ang getting an error
    Given an instance of our Login component
    When  I enter a wrong username
    And   I enter a wrong password
    And   I click the login button
    Then  I expect the login handler method to be executed with error
    And   I expect app to stay on current page
