Feature: MWE_RS_013 - Add Failure Information to the current Work Order

  Scenario Outline: Add Failure Information to the current Work Order
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
    Then WO page is "Shown"
    Then I take a screenshot
    Then I click on "START ICON" button
    Then I click on "START WORK" button
    Then The status of the work Order is in "In Progress"
    Then I take a screenshot
    Then I navigate "Work" tab
    When I press "FAILURE INFORMATION" widget
    Then I wait for page to load
    Then I take a screenshot
   # Then I click on "FAILURE CLASS" option
  #  Then I click on "171-SQR-022: HEATING & LIGHTING" button
    Then I click on "PROBLEM CLASS" option
    Then I click on "Pump Faulty" button
    Then I click on "CAUSE CLASS" option
    Then I click on "Faulty Components" button
    Then I click on "REMEDY CLASS" option
    Then I click on "Replaced" button
    Then I click on "SAVE" button
    Then I wait for page to load
    Then I take a screenshot
    Then I click on "PAUSE ICON" button
    Then I click on "PAUSE" button
    Then I click on "SELECT OUTCOME" option
    Then I click on "ON HOLD" button
    Then I click on "PAUSE WORK ORDER" button
    Then I wait for page to load
    Then I take a screenshot
    
    

    Examples:
    | country | EnvCode | username | password |
    | Europe  | polite-lion-52 | craig.fisher@keolisameydlr.co.uk | Maximo2026 |