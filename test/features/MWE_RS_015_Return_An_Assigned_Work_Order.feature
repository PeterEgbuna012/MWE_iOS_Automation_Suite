Feature: MWE_RS_015 - Return an Assigned Work Order

  Scenario Outline: Return an Assigned Work Order
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
    Then I take a screenshot
    Then I click on "PAUSE ICON" button
    Then I click on "Return" button
  # Then I select "Return Start Time" date field
  # Then I set date as "yesterdays" date
  # Then I click on "DONE" button
  # Then I select "Return End Time" date field
  # Then I set date as "todays" date
  # Then I click on "DONE" button
    Then I enter "MWE 1.13.0 TESTING" in textfield "Please enter a reason for returning the work..."
    Then I click on "RETURN WORK ORDER" button
    Then I take a screenshot
    Then The Worklist page is open
    Then I wait for page to load
    Then I take a screenshot
    #Then The status of the work Order is in "On Hold"

    Examples:
      | country | EnvCode        | username | password |
      | Europe  | lucky-liger-8  | ian.scott@gtrailway.com | maximo  |
