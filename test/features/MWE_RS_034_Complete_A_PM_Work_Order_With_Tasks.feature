Feature: MWE_RS_034 - Complete a PM Work Order With Tasks

Scenario Outline: Complete a PM Work Order With Tasks
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
    When I click on "Reject" button
    Then The Worklist page is open
    When I click at "first" WO
    Then WO page is "Shown"
    Then I take a screenshot
    Then I click on "START ICON" button
    Then I click on "START WORK" button
    Then The status of the work Order is in "In Progress"
    Then I take a screenshot
    Then I navigate "Work" tab
    When I press "TASKS" widget
    Then I take a screenshot
    When I tap on task with number "10."
    And I set "comments" value field to "TEST"
    Then I click on "" button
    When I click on "SIGN & COMPLETE" button
    Then I take a screenshot
    When I navigate to "back"
    When I tap on task with number "20."
    And I set "measurement input" value field to "1500"
    And I set "comments" value field to "TEST"
    Then I click on "" button
    When I click on "SIGN & COMPLETE" button
    Then I take a screenshot
    When I navigate to "back"
    When I navigate to "back" 
    Then I click on "PAUSE ICON" button
    When I click on "Complete" button
    Then I click on "COMPLETE WORK ORDER" button
    Then I navigate "History" tab
    Then I take a screenshot
    Then I navigate to "back"
    Then The Worklist page is open



Examples:
    | country | EnvCode | username | password |
    | Europe  | polite-lion-52 | craig.fisher@keolisameydlr.co.uk | Maximo2026 |