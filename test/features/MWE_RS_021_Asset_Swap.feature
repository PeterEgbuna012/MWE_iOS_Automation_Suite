Feature: MWE_RS_021 - Asset Swap

  Scenario Outline: Asset Swap
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
    When I click at "first" WO
    Then WO page is "Shown"
    Then I take a screenshot
    Then I click on "START ICON" button
    Then I click on "START WORK" button
    Then The status of the work Order is in "In Progress"
    Then I take a screenshot 
    Then I navigate "Work" tab
    When I press "MATERIALS" widget
    Then I take a screenshot 
    Then I click on "GO TO ASSET SWAP" button
    When I press "Tap to select Outbound Asset" widget
    Then I wait for page to load
    Then I take a screenshot 
    Then I click on "SELECT ASSET" button
    When I press "Tap to select Inbound Asset" widget
    Then I wait for page to load
    Then I take a screenshot 
    Then I click on "SELECT" button
    Then I take a screenshot 
    Then I click on "RETURN LOCATION SELECT" button
    Then I enter "BED WORKSHOP" in the select location search field
    Then I select "BED WORKSHOP" location
    Then I take a screenshot 
    Then I "CONFIRM" asset swap
    Then I wait for page to load
    Then I "SWAP" asset swap 
    Then I wait for page to load
    Then I take a screenshot 
    Then I "CONFIRM" asset swap
    Then I click on "YES" button
    Then I wait for page to load
    Then I take a screenshot 
    Then I navigate to "back"
    Then I click on "PAUSE ICON" button
    Then I click on "PAUSE" button
    Then I click on "SELECT OUTCOME" option
    Then I click on "ON HOLD" button
    Then I click on "PAUSE WORK ORDER" button
    Then The status of the work Order is in "On Hold"
    Then I take a screenshot
    Then I navigate to "back"
    Then The Worklist page is open
  

  Examples:
    | country | EnvCode | username | password |
    | Europe  | polite-lion-52 | craig.fisher@keolisameydlr.co.uk | Maximo2026 |