Feature: MWE_RS_046 - No files attached is shown in the Files tab when there are no files attached

  Scenario Outline: No files attached is shown in the Files tab when there are no files attached
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
    When I click at "first" WO
    Then I take a screenshot
    Then I click on "START ICON" button
    Then I click on "START WORK" button
    Then The status of the work Order is in "In Progress"
    Then I take a screenshot
    Then I navigate "Files" tab
    Then I wait for page to load
    Then I take a screenshot
    Then I click on "PAUSE ICON" button
    Then I click on "PAUSE" button
    Then I click on "PAUSE WORK ORDER" button
    Then I wait for page to load
    Then I take a screenshot

  Examples:
    | country | EnvCode        | username | password |
    | Europe  | lucky-liger-8  | CBRUNS   | cbruns   |