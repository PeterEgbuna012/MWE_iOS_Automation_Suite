Feature: MWE_RS_001 - Login and Logout from the Application

  Scenario Outline: Login and logout from the application
    Given I am on the Init page
    When I set Region select field
    When I set Region as "<country>"
    When I set "<EnvCode>" into Environment Code input field
    Then I can connect to the Environment
    Then signIn option shows up
   #  When I switch to the web view context
    Then I enter username as "<username>"
    And I enter password as "<password>"
    And I click on "Sign In" button
    And I switch to native view context
    And I see allow button
    Then I wait for page to load
    Then I take a screenshot
    When I click on "Reject" button
    Then The Worklist page is open
    Then I take a screenshot
    Then I press the Hamburger icon
    Then I click on "Logout" button
    Then signIn option shows up
    Then I take a screenshot

    Examples:
      | country | EnvCode        | username | password |
      | Europe  | lucky-liger-8  | ian.scott@gtrailway.com | maximo  |
