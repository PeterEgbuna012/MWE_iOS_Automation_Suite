Feature: MWE_RS_022 - Check out Materials and make Reservations

  Scenario Outline: Checkout Materials and make Reservations
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
    Then WO page is "Shown"
    Then I take a screenshot
    Then I click on "START ICON" button
    Then I click on "START WORK" button
    Then The status of the work Order is in "In Progress"
    Then I take a screenshot
    Then I navigate "Work" tab
    When I press "MATERIALS" widget
    Then I click on "SEARCH ALL PARTS" button
    Then I click on "SEARCH BY PART CODE OR DESCRIPTION" field
    And I enter "3000890" in the Inventory search field
    When I select the first item "3000890" from the search results
    When I select the second item "3000890" from the search results
    When I select the third item "3000890" from the search results
    When I select the fourth item "3000890" from the search results
    When I select the fifth item "3000890" from the search results
    Then I click on "ADD TO LIST" button
    Then I take a screenshot
    Then I click on "SEARCH" button
   # Then I select Inventory material with available balance
    Then I click on "RESERVE" button
    Then I click on "PLUS" button
    Then I click on "CONFIRM" button
    Then I take a screenshot
   # Then I select second Inventory material with available balance
   # Then I click on "PLUS" button
   # Then I click on "CONFIRM" button
  #  Then I take a screenshot
    Then I navigate to "back"
    Then I navigate to "back"
    Then I navigate to "back"
    Then I wait for page to load
    Then I take a screenshot
    Then I navigate to "back"
    Then I click on "PAUSE ICON" button
    Then I click on "PAUSE" button
    Then I click on "SELECT OUTCOME" option
    Then I click on "ON HOLD" button
    Then I click on "PAUSE WORK ORDER" button
    Then I wait for page to load
    Then I take a screenshot
    Then I navigate to "back"
    Then The Worklist page is open
    

    Examples:
    | country | EnvCode | username | password |
    | Europe  | polite-lion-52 | craig.fisher@keolisameydlr.co.uk | Maximo2026 |






