Feature: MWE_RS_037 - Complete an Assigned Meter Task on Work Order

  Scenario Outline: Complete an Assigned Meter Task on Work Order
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
    When I tap on task with number "20."
    Then I take a screenshot
    And I set "measurement input" value field to "1500"
    And I set "comments" value field to "TEST"
    # this symbol is for circle button in task
    Then I click on "" button
    When I click on "SIGN & COMPLETE" button
   # Then "TASK IS COMPLETED" button is displayed
    Then I take a screenshot
    When I navigate to "back"
    When I navigate to "back" 
   Then The status of the work Order is in "In Progress"
    Then I click on "PAUSE ICON" button
    When I click on "Complete" button
    Then I click on "COMPLETE WORK ORDER" button
    Then I wait for page to load
    Then I take a screenshot
    # its the back button
   # When I click on "" button
   # Then I click at button next to "In Progress"
   # When I click on "Complete" button
   # When I select "Start" date field
   # Then I set date as "yesterdays" date
   # Then I click on "Done" button
   # When I select "End" date field
   # Then I click on "Done" button
   # Then I set date as "todays" date
  #  Then I click on "COMPLETE WORK ORDER" button

    Examples:
    | country | EnvCode | username | password |
    | Europe  | polite-lion-52 | craig.fisher@keolisameydlr.co.uk | Maximo2026 |
