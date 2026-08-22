// pages/rulesPage.js
class RulesPage {
  constructor(page) {
    this.page = page;
    this.editor = page.frameLocator('iframe').first();
    this.addRuleButton = this.editor.locator('button').filter({ hasText: /Add rule/i }).first();
    this.dropdowns = this.editor.locator('[data-path="RioSelectInputQuery"]');
    this.andToggle = this.editor.getByText('AND', { exact: true }).first();
  }

  async openRulesTab() {
    const tab = this.editor.getByText(/Form rules \(\d+\)/).first();
    await tab.waitFor({ state: 'visible', timeout: 10000 });
    await tab.click({ force: true });
    await this.addRuleButton.waitFor({ state: 'visible', timeout: 10000 });
  }

  async addNewRule() {
    await this.addRuleButton.click({ force: true });
    await this.page.waitForTimeout(500);
  }

  async addRuleBelow(ruleName) {
    const ruleCard = this.editor.getByText(ruleName, { exact: true }).locator('xpath=ancestor::*[3]');
    const moreOptionsBtn = ruleCard.locator('button').last();
    try {
      await moreOptionsBtn.click({ force: true });
      await this.editor.getByText('Add rule below', { exact: true }).click({ force: true });
    } catch {
      await this.addNewRule();
    }
    await this.page.waitForTimeout(500);
  }

  async selectDropdownOption(index, optionText) {
    await this.dropdowns.nth(index).click();
    await this.editor.getByText(optionText, { exact: true }).last().click();
  }

  async configureRule1(condition1Element, condition2Element, actionElement, actionValue) {
    await this.editor.getByText('Rule1', { exact: true }).first().waitFor({ state: 'visible' });
    await this.selectDropdownOption(0, condition1Element);
    await this.selectDropdownOption(1, 'Is not empty');
    await this.andToggle.click();
    await this.selectDropdownOption(2, condition2Element);
    await this.selectDropdownOption(3, 'Is not empty');
    await this.selectDropdownOption(4, actionElement);
    await this.selectDropdownOption(5, 'Set value');
    await this.editor.locator('input[type="text"]').last().fill(actionValue);
  }
}

module.exports = { RulesPage };