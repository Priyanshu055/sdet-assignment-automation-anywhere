class RulesPage {
  constructor(page) {
    this.page = page;

    this.formRulesTab = page.locator('text=/Form rules/');
    this.addRuleButton = page.locator('button:has-text("Add rule")');

    // every element/condition/action dropdown in the rules panel uses this
    // same reusable component, so we select them by position (index)
    this.dropdowns = page.locator('[data-path="RioSelectInputQuery"]');

    this.andToggle = page.locator('text=AND').first();
    this.orToggle = page.locator('text=OR').first();
    this.addActionButton = page.locator('button:has-text("Add action")');

    this.addRuleBelowOption = page.locator('text=Add Rule Below');
  }

  async openRulesTab() {
    await this.formRulesTab.click();
  }

  async addNewRule() {
    await this.addRuleButton.click();
  }

  async addRuleBelow(ruleName) {
    const ruleCard = this.page.locator(`text=${ruleName}`).locator('xpath=ancestor::*[3]');
    const menuButton = ruleCard.locator('button', { hasText: '⋮' }).first();
    await menuButton.click();
    await this.addRuleBelowOption.click();
  }

  /**
   * Opens the dropdown at the given position (0-based, in the order they
   * appear on the page) and picks the option matching optionText.
   */
  async selectDropdownOption(index, optionText) {
    const dropdown = this.dropdowns.nth(index);
    await dropdown.click();
    await this.page.getByText(optionText, { exact: true }).last().click();
  }

  async setAndMode() {
    await this.andToggle.click();
  }

  async setOrMode() {
    await this.orToggle.click();
  }

  /**
   * Fully configures Rule1 assuming it's freshly created and empty:
   * condition1: element + "Is not empty"
   * AND
   * condition2: element + "Is not empty"
   * action: target element + "Set Value" + a value
   */
  async configureRule1(condition1Element, condition2Element, actionElement, actionValue) {
    // condition 1
    await this.selectDropdownOption(0, condition1Element);
    await this.selectDropdownOption(1, 'Is not empty');

    await this.setAndMode();

    // condition 2
    await this.selectDropdownOption(2, condition2Element);
    await this.selectDropdownOption(3, 'Is not empty');

    // action
    await this.selectDropdownOption(4, actionElement);
    await this.selectDropdownOption(5, 'Set value');

    const valueInput = this.page.locator('input[type="text"]').last();
    await valueInput.fill(actionValue);
  }
}

module.exports = { RulesPage };