Feature: MWE_RS_014 - Complete a PM Work Order

  Scenario Outline: Complete a PM Work Order
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
    Then I click on "START ICON" button
    Then I click on "START WORK" button
    Then The status of the work Order is in "In Progress"
    Then I click on "PAUSE ICON" button
    When I click on "Complete" button
    Then I click on "COMPLETE WORK ORDER" button
    Then The status of the work Order is in "In Review"
    Then I take a screenshot
   # When I select "Start" date field
   # Then I set date as "yesterdays" date
   # Then I click on "Done" button
   # When I select "End" date field
   # Then I click on "Done" button
   # Then I set date as "todays" date
    Then I navigate to "back"
    #Then WO page is "Not Shown"

    Examples:
      | country | EnvCode        | username | password |
      | Europe  | lucky-liger-8  | ian.scott@gtrailway.com | maximo  |