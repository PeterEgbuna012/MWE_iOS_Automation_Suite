Feature: MWE_RS_017 - Add Manual Time Entry

  Scenario Outline: Add Manual Time Entry
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
    Then I take a screenshot
    Then I click on "START ICON" button
    Then I click on "START WORK" button
    Then The status of the work Order is in "In Progress"
    Then I take a screenshot
    Then I navigate "Work" tab
    When I press "TIME ENTRIES" widget
    Then I take a screenshot
    Then I click on "Add Manual Time Entry" button
    Then I select "Start Time" date field
    Then I set date as "yesterdays" date
    Then I select "End Time" date field
    Then I set date as "todays" date
    Then I take a screenshot
    Then I click on "CONFIRM" button
    Then I compare the time value "1d 0h 0m"
    Then I take a screenshot
    When I navigate to "back"
    Then I click on "PAUSE ICON" button
    Then I click on "PAUSE" button
   # Then I click on "SELECT OUTCOME" option
   # Then I click on "ON HOLD" button
    Then I click on "PAUSE WORK ORDER" button
    Then I wait for page to load
    Then I take a screenshot
    When I navigate to "back"
    Then The Worklist page is open
  
    
    Examples:
    | country | EnvCode | username | password |
    | Europe  | polite-lion-52 | craig.fisher@keolisameydlr.co.uk | Maximo2026 |