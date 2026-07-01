Feature: MWE_RS_031 - Bookmark Work Order on mobile

  Scenario Outline: Bookmark Work Order on mobile
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
    Then I click on "BOOKMARK ICON" button
    Then I take a screenshot
    Then I click on "BOOKMARK ICON" button
    Then I "Bookmark" first work order
    Then I "Bookmark" second work order
    Then I "Bookmark" third work order
    Then I "Bookmark" fourth work order
    Then I "Bookmark" fifth work order
    Then I click on "BOOKMARK ICON" button
    Then I click on "Start Date" sort by option and select "Compliance Date"
    Then I take a screenshot
    Then I click on "Compliance Date" sort by option and select "Status"
    Then I take a screenshot
    Then I click on "Status" sort by option and select "Location"
    Then I take a screenshot
    Then I click on "Location" sort by option and select "Priority"
    Then I take a screenshot
    Then I press the Hamburger icon
    Then I click on "Logout" button
    Then signIn option shows up


    Examples:
    | country | EnvCode | username | password |
    | Europe  | polite-lion-52 | yinka.oludipe@keolisameydlr.co.uk | yo2026!! |