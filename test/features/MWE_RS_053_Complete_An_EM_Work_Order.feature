Feature: MWE_RS_053 - Complete an EM Work Order

  Scenario Outline: Complete an EM Work Order
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
    When I press "FAILURE INFORMATION" widget
   # Then I click on "FAILURE CLASS" option
   # Then I click on "171-SQR-022: HEATING & LIGHTING" option
   # Then I click on "PROBLEM CLASS" option
   # Then I click on "SQR 22(a) - Lighting - failed" option
    Then I click on "CAUSE CLASS" option
    Then I click on "CRACKED" option
    Then I click on "REMEDY CLASS" option
    Then I click on "REPAIR CARRIED OUT" option
    Then I click on "SAVE" button
    Then I click on "MORE ACTION ICON" button
    Then I click on "ADD COMMENT" button
    Then I click on "TYPE FIELD" button
    Then I click on "UPDATE" button
    And I set "Summary" value field to "TEST"
    And I set "Details" value field to "MWE 1.12.0 TESTING"
    Then I click on "ADD COMMENT BUTTON" button
    Then I click on "PAUSE ICON" button
    When I click on "Complete" button
  #  Then I click on "SELECT OUTCOME" option
  #  Then I click on "PERMANENT FIX" button
    Then I click on "COMPLETE WORK ORDER" button
    Then I wait for page to load
    Then I take a screenshot
    
    

    Examples:
      | country | EnvCode        | username | password |
      | Europe  | lucky-liger-8  | ian.scott@gtrailway.com | maximo  |
