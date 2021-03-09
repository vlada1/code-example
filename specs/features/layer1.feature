Feature: Minespider Platform Support Information

  Scenario: Platform version
    Given I am on Dashboard page
    Then I see Sidebar on the left of the screen
    Then I see the version identification at the bottom of the side bar with Minespider Version

  Scenario: User identification
    Given I am on Dashboard page
    Then I see my Firstname and Lastname on the bottom of sidebar
    Then I see my avatar on the left of the Firstname


  Scenario: Platform logo
    Given I am on Dashboard page
    Then I see logo on the top of sidebar

  Scenario: Platform notifications
    Given I am on Dashboard page
    Then I see notification icon in the sidebar
    Then I can see a green dot with number 1 inside it

  Scenario: Platform news
    Given I am on Dashboard page
    Then I see news icon in the sidebar
