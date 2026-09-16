# This feature file Logs in app and navigate through all tabs, notification and also 
#checks for attachment in files tab along with reservation made through materials widget
Feature: MWE_RS_030 - Application Navigation Test

  Scenario Outline: Navigate in the App, file attached in files tab and reservation made
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
    Then I wait for page to load
    Then I take a screenshot
    Then I navigate to "notifications"
    Then I wait for page to load
    Then I take a screenshot
    Then I navigate to "back"
    Then I navigate "Work" tab
    Then I wait for page to load
    Then I take a screenshot
    Then I navigate "Files" tab
    Then I take a screenshot
    Then I click on "All Files" sort by option and select "Photographs"
    Then I take a screenshot
    Then I click on "Photographs" sort by option and select "Videos"
    Then I take a screenshot
    Then I click on "Videos" sort by option and select "Documents"
    Then I take a screenshot
    Then I click on "Documents" sort by option and select "Links"
    Then I take a screenshot
    Then I navigate "Details" tab
    Then I take a screenshot
    Then I navigate "History" tab
    Then I take a screenshot
    Then I click on "All Updates" sort by option and select "Comments"
    Then I take a screenshot
    Then I click on "Comments" sort by option and select "Follow-Ons"
    Then I take a screenshot
    Then I click on "Follow-Ons" sort by option and select "Workflow"
    Then I take a screenshot
    Then I navigate to "back"
    #Then I navigate to "back"
    Then The Worklist page is open
    Then I press the Hamburger icon
    Then I click on "Logout" button
    

    Examples:
    | country | EnvCode | username | password |
    | Europe  | polite-lion-52 | craig.fisher@keolisameydlr.co.uk | Maximo2026 |