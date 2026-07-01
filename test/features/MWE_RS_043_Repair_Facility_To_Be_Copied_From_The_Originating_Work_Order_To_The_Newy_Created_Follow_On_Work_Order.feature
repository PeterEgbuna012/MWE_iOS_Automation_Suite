Feature: MWE_RS_044 - Repair facility to be copied from the originating work order to the newly created follow on work order

Scenario Outline: Repair facility to be copied from the originating work order to the newly created follow on work order
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
    When I click on "Reject" button
    Then The Worklist page is open
    Then I click on "first" WO
    Then WO page is "Shown"
    Then I click on "START ICON" button
    Then I click on "START WORK" button
    Then The status of the work Order is in "In Progress"
    Then I click on "MORE ACTION ICON" button
    Then I click on "CREATE FOLLOW-ON WORK ORDER" button
    Then the Follow-On page should be "Shown"
    Then I click on "Add to backlog" outcome and select "Add to backlog"
    Then I verify location field is populated
   # Then I verify asset field is populated
    Then I click on "SELECT A TEMPLATE " button 
    Then I click on "Assign To Me Work Priority 1 - Unit Withdrawn from Service" button
    Then I take a screenshot
   # And I set "Description" value field to "TESTING"
    Then I click on "NEXT" button
    Then I click on "FAILURE CLASS" option
    Then I click on "171-SQR-022: HEATING & LIGHTING" button
    Then I click on "PROBLEM CLASS" option
    Then I click on "SQR 22(a) - Lighting - failed" button
    Then I click on "CAUSE CLASS" option
    Then I click on "Service Quality Fault Reported" button
    Then I click on "REMEDY CLASS" option
    Then I click on "Service Quality Fault Rectified" button
    Then I click on "" button
    Then I click on "CREATE FOLLOW-ON" button
    Then I take a screenshot
    Then I click on "PAUSE ICON" button
    Then I click on "PAUSE" button
    Then I click on "PAUSE WORK ORDER" button
    Then I click on "HISTORY TAB" button
    Then I wait for page to load
    Then I take a screenshot
    

    
    Examples:
    | country | EnvCode        | username | password |
    | Europe  | lucky-liger-8  | CBRUNS   | cbruns   |