Feature: MWE_RS_024 - User level Notifications

  Scenario Outline: User level Notifications
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
    Then I navigate to "notifications"
    Then I take a screenshot
    When I click on "All" filter and select "Unread"
    Then I take a screenshot
    Then I click on "Unread" filter and select "Read"
    Then I take a screenshot
    Then I click on "Read" filter and select "All"
    Then I take a screenshot
    Then I click on "Mark All As Read" button
    Then I take a screenshot
    Then I navigate to "back"
    When I navigate to "back"
    Then The Worklist page is open
    Then I take a screenshot

    Examples:
      | country | EnvCode        | username | password |
      | Europe  | lucky-liger-8  | ian.scott@gtrailway.com | maximo  |