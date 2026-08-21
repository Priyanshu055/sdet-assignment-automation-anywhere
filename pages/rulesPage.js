// pages/rulesPage.js
// Page Object for the "Form rules" tab: adding rules, conditions, AND/OR mode,
// and actions (Set Value / Append Value / Show error).
// Update selectors after inspecting the real DOM.

class RulesPage {
  constructor(page) {
    this.page = page;

    this.formRulesTab = page.locator('text=/Form rules/');
    this.addRuleButton = page.locator('button:has-text("Add rule")');

    // Within a rule card
    this.selectElementDropdown = page.locator('text=Select element').first();
    this.addConditionButton = page.locator('button:has-text("Add condition")');
    this.andToggle = page.locator('text=AND').first();
    this.orToggle = page.locator('text=OR').first();
    this.addActionButton = page.locator('button:has-text("Add action")');

    // Rule card context menu ( ⋮ ) -> "Add Rule Below"
    this.ruleContextMenuButton = (ruleName) =>
      this.page.locator(`text=${ruleName}`).locator('xpath=../..').locator('[aria-label="more options"], button:has-text("⋮")');
    this.addRuleBelowOption = page.locator('text=Add Rule Below');
  }

  async openRulesTab() {
    await this.formRulesTab.click();
  }

  async addNewRule() {
    await this.addRuleButton.click();
  }

  async addRuleBelow(existingRuleName) {
    await this.ruleContextMenuButton(existingRuleName).click();
    await this.addRuleBelowOption.click();
  }

  /**
   * Selects an element + condition type for a condition row.
   * elementDropdown / conditionDropdown are Locators passed in from the spec
   * (there can be multiple condition rows on the page, so the spec is
   * responsible for scoping to the right row).
   */
  async setCondition(elementDropdown, elementName, conditionDropdown, conditionType, value) {
    await elementDropdown.click();
    await this.page.locator(`text=${elementName}`).click();

    await conditionDropdown.click();
    await this.page.locator(`text=${conditionType}`).click();

    if (value) {
      await this.page.locator('input[type="text"]').last().fill(value);
    }
  }

  async setAndMode() {
    await this.andToggle.click();
  }

  async setAction(targetElement, actionType, value) {
    await this.selectElementDropdown.click();
    await this.page.locator(`text=${targetElement}`).click();

    // action type dropdown (Set Value / Append Value / Show error)
    await this.page.locator('text=Set value, text=Append value, text=Show error').first().click();
    await this.page.locator(`text=${actionType}`).click();

    await this.page.locator('input[placeholder=""]').last().fill(value);
  }
}

module.exports = { RulesPage };
