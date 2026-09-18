Feature: MWE_RS_060 - Complete Work For Other People

Scenario Outline: Complete Work For Other People
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
    Then I navigate "Work" tab
    When I press "FAILURE INFORMATION" widget
    Then I wait for page to load
    Then I take a screenshot
  # Then I click on "FAILURE CLASS" option
  #  Then I click on "171-SQR-022: HEATING & LIGHTING" button
    Then I click on "PROBLEM CLASS" option
    Then I click on "Controller Defective" button
    Then I click on "CAUSE CLASS" option
    Then I click on "Faulty Components" button
    Then I click on "REMEDY CLASS" option
    Then I click on "Replaced" button
    Then I click on "SAVE" button
    Then I click on "MORE ACTION ICON" button
    Then I click on "ADD COMMENT" button
    Then I click on "TYPE FIELD" button
    Then I click on "UPDATE" button
    And I set "Summary" value field to "KAD MWE  1.13.1 TESTING"
    And I set "Details" value field to "KAD MWE  1.13.1 TESTING"
    Then I click on "ADD COMMENT BUTTON" button
    When I press "TASKS" widget
    When I tap on task with number "10."
    And I set "comments" value field to "KAD MWE  1.13.1 TESTING"
    Then I click on "" button
    When I click on "SIGN & COMPLETE" button
    Then I take a screenshot
    When I navigate to "back"
    When I tap on task with number "20."
    And I set "measurement input" value field to "1500"
    And I set "comments" value field to "KAD MWE  1.13.1 TESTING"
    Then I click on "" button
    When I click on "SIGN & COMPLETE" button
    Then I take a screenshot
    When I navigate to "back"
    When I navigate to "back" 
    Then I click on "PAUSE ICON" button
    When I click on "Complete" button
    Then I click on "SELECT OUTCOME" option
    Then I click on "PERMANENT FIX" button
    Then I click on "COMPLETE WORK ORDER" button
    Then I wait for page to load
    Then I take a screenshot
    Then I navigate to "back"
  

    Examples:
    | country | EnvCode        | username | password |
    | Europe  | lucky-liger-8  | ian.scott@gtrailway.com | maximo  |