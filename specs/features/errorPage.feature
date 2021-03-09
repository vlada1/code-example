Feature: Error pages
  Scenario: 400 Error page
    Given Vue Router
    When I reach the link with non-existing page
    Then I see "404"
    And I see the message on the screen "The page you are looking for might have been renamed or it’s temporary unavailable."
    And I click on Go back button I am redirected to previous page
