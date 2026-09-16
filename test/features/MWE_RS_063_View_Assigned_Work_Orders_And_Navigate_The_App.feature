# A Maintainer has successfully logged into the Mobile EAM Application and needs to view all of their assigned Work Orders.
Feature: MWE_RS_063 - View Assigned Work Orders and Navigate the App

  Scenario Outline: View Assigned Work Orders and Navigate the App
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
    And I Filter work order table by "Rolling Stock"
    Then I take a screenshot
    Then I click on "CLEAR" button
    And I Filter work order table by "MWE TEST"
    Then I take a screenshot
    Then I click on "CLEAR" button
    And I Filter work order table by "387102"
    Then I take a screenshot
    Then I click on "CLEAR" button
    Then I wait for page to load
    When I click at "first" WO
    Then WO page is "Mobile Work Execution"
    Then I take a screenshot
    Then I navigate "Details" tab
    Then I take a screenshot
    Then I navigate "Work" tab
    Then I take a screenshot
    Then I navigate "Files" tab
    Then I take a screenshot
    Then I click on "HISTORY TAB" button
    Then I take a screenshot
    Then I click on "START ICON" button
    Then I click on "START WORK" button
    Then The status of the work Order is in "In Progress"
    Then I take a screenshot
    When I navigate to "back"
    Then I wait for page to load
    When I click at "second" WO 
    Then I take a screenshot
    Then I click on "RETURN ICON" button
    Then I click on "PAUSE ICON" button
    Then I click on "PAUSE" button
  #  Then I click on "SELECT OUTCOME" option
  #  Then I click on "ON HOLD" button
    Then I click on "PAUSE WORK ORDER" button
    Then I wait for page to load
    Then I take a screenshot



  Examples:
      | country | EnvCode        | username | password |
      | Europe  | lucky-liger-8  | ian.scott@gtrailway.com | maximo  |
