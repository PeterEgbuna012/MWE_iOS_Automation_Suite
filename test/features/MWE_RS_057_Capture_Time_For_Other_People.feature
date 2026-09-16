# This feature file covers Start and Pause Work Order.
Feature: MWE_RS_057 - Capture Time For Other People

  Scenario Outline: Capture Time For Other People
    Given I am on the Init page
    When I set Region select field
    When I set Region as "<country>"
    When I set "<EnvCode>" into Environment Code input field
    Then I can connect to the Environment
    Then signIn option shows up
    When I switch to the web view context
    Then I enter username as "<username>"
    And I enter password as "<password>"
    And I click on "Sign In" button
    And I switch to native view context
    And I see allow button
    Then I wait for page to load
    Then I take a screenshot
    When I click on "Reject" button
    Then The Worklist page is open
    When I click at "first" WO
    Then WO page is "Mobile Work Execution"
    Then I take a screenshot
    Then I click on "START ICON" button
    Then I click on "START WORK" button
    Then I wait for page to load
    Then I take a screenshot
    Then I click on "PAUSE ICON" button
    Then I click on "PAUSE" button
    Then I take a screenshot
    Then I click on "SELECT USERS" button
    Then I click on "USER 2" button
    Then I click on "USER 1" button
    Then I take a screenshot
    Then I click on "SELECT OUTCOME" option
    Then I click on "ON HOLD" button
    Then I click on "PAUSE WORK ORDER" button
    Then I navigate "Work" tab
    When I press "TIME ENTRIES" widget
    Then I wait for page to load
    Then I take a screenshot
    

  Examples:
    | country | EnvCode | username | password |
    | Europe  | polite-lion-52 | craig.fisher@keolisameydlr.co.uk | Maximo2026 |
