Feature: MWE_RS_010 - Fail an assigned Task

  Scenario Outline: Fail an assigned Task on Work Order
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
    Then The status of the work Order is in "In Progress"
    Then I navigate "Work" tab
    When I press "TASKS" widget
    Then I wait for page to load
    Then I take a screenshot
    When I tap on task with number "10."
    Then I take a screenshot
    And I set "comments" value field to "MWE KAD 1.13.0 TESTING"
    Then I click on "" button
    When I click on "FAIL TASK" button
    And I set "fail task reason" value field to "MWE KAD 1.13.0 TESTING"
    Then I take a screenshot
    Then I click on "OK" button
    Then I wait for page to load
    Then I take a screenshot
    Then I click on "Add to backlog" outcome and select "Add to backlog"
    Then I verify location field is populated
    Then I click on "SELECT A TEMPLATE " button 
    Then I click on "Assign to Backlog" button
    Then I take a screenshot
    Then I click on "NEXT" button
    Then I wait for page to load
    Then I click on "PROBLEM CLASS" option
    Then I click on "Pump Faulty" button
    Then I click on "CAUSE CLASS" option
    Then I click on "Faulty Components" button
    Then I click on "REMEDY CLASS" option
    Then I click on "Replaced" button
    Then I wait for page to load
    Then I click on "" button
    Then I click on "CREATE FOLLOW-ON" button
    Then I take a screenshot
    When I navigate to "back"
    When I navigate to "back"
    Then I click on "PAUSE ICON" button
    Then I click on "PAUSE" button
    Then I click on "SELECT OUTCOME" option
    Then I click on "ON HOLD" button
    Then I click on "PAUSE WORK ORDER" button
    Then I wait for page to load
    Then I take a screenshot

    Examples:
    | country | EnvCode | username | password |
    | Europe  | polite-lion-52 | craig.fisher@keolisameydlr.co.uk | Maximo2026 |