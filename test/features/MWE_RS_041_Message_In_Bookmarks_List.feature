Feature: MWE_RS_041 - Message in bookmarks list 

  Scenario Outline: Message in bookmarks list 
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
    Then I take a screenshot
    Then The Worklist page is open
    Then I click on "BOOKMARK ICON" button
    Then I take a screenshot
    Then I press the Hamburger icon
    Then I click on "Logout" button
    Then signIn option shows up


    Examples:
    | country | EnvCode        | username | password |
    | Europe  | lucky-liger-8  | CBRUNS   | cbruns   |