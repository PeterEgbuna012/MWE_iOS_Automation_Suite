Feature: MWE_RS_026 - Sort By Filter in My Work List

  Scenario Outline: Sort My Work List By Filter 
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
    When I click on "Reject" button
    Then The Worklist page is open
    Then I take a screenshot
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
    | Europe  | polite-lion-52 | craig.fisher@keolisameydlr.co.uk | Maximo2026 |