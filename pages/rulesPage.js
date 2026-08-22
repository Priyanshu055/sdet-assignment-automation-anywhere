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
    const tabButton = this.editor.locator('button[data-tab-name="Form rules"]').first();
    await tabButton.waitFor({ state: 'visible', timeout: 15000 });
    
    // Click the rules tab and verify it becomes active (aria-selected="true")
    for (let i = 0; i < 5; i++) {
      await tabButton.click({ force: true });
      await this.page.waitForTimeout(1000);
      const isSelected = await tabButton.getAttribute('aria-selected');
      if (isSelected === 'true') {
        break;
      }
      console.log(`Rules tab not selected on attempt ${i + 1}, retrying click...`);
    }
    
    await this.addRuleButton.waitFor({ state: 'visible', timeout: 15000 });
  }

  async addNewRule() {
    await this.addRuleButton.click({ force: true });
    await this.page.waitForTimeout(1000);
  }

  async addRuleBelow(ruleName) {
    const ruleTitle = this.editor.getByText(ruleName, { exact: true }).first();
    await ruleTitle.waitFor({ state: 'attached', timeout: 10000 });
    await ruleTitle.scrollIntoViewIfNeeded();
    
    // Ancestor 2 is the header container containing the buttons
    const ancestor2 = ruleTitle.locator('xpath=ancestor::*[2]');
    const contextMenuBtn = ancestor2.locator('button[aria-label="More"]').first();
    await contextMenuBtn.waitFor({ state: 'visible', timeout: 10000 });
    await contextMenuBtn.click({ force: true });
    await this.page.waitForTimeout(500);
    
    const addBelowOption = this.editor.getByText('Add rule below', { exact: true }).first();
    await addBelowOption.waitFor({ state: 'visible', timeout: 10000 });
    await addBelowOption.click({ force: true });
    await this.page.waitForTimeout(1000);
  }

  async selectDropdownOption(index, optionText) {
    const dropdown = this.dropdowns.nth(index);
    await dropdown.waitFor({ state: 'visible', timeout: 15000 });
    await dropdown.click();
    await this.page.waitForTimeout(500);
    
    const option = this.editor.getByText(optionText, { exact: true }).last();
    await option.waitFor({ state: 'visible', timeout: 15000 });
    await option.click({ force: true });
    await this.page.waitForTimeout(500);
  }

  async configureRule1(condition1Element, condition2Element, actionElement, actionValue) {
    // 1. Wait for Rule1 card to be visible
    await this.editor.getByText('Rule1', { exact: true }).first().waitFor({ state: 'visible', timeout: 15000 });
    
    // 2. Configure Condition 1
    await this.selectDropdownOption(0, condition1Element);
    await this.selectDropdownOption(1, 'Is not empty');
    
    // 3. Click "Add condition" button to add a second row
    const addConditionBtn = this.editor.getByRole('button', { name: 'Add condition' }).first();
    await addConditionBtn.waitFor({ state: 'visible', timeout: 10000 });
    await addConditionBtn.click();
    await this.page.waitForTimeout(1000);
    
    // 4. Configure Condition 2
    await this.selectDropdownOption(2, condition2Element);
    await this.selectDropdownOption(3, 'Is not empty');
    
    // 5. Verify AND/OR operator toggle selection works
    const andOperator = this.editor.getByText('AND', { exact: true }).first();
    await andOperator.waitFor({ state: 'visible', timeout: 10000 });
    await andOperator.click(); // Toggle to OR
    await this.page.waitForTimeout(500);
    
    const orOperator = this.editor.getByText('OR', { exact: true }).first();
    await orOperator.waitFor({ state: 'visible', timeout: 10000 });
    await orOperator.click(); // Toggle back to AND
    await this.page.waitForTimeout(500);
    
    // 6. Configure Action Target Element (Action 1)
    await this.selectDropdownOption(4, actionElement);
    
    // 7. Configure Action Type (Action 1 Type)
    await this.selectDropdownOption(5, 'Set value');
    
    // 8. Enter the Action Value
    const valueInput = this.editor.locator('input[type="text"]').last();
    await valueInput.waitFor({ state: 'visible', timeout: 10000 });
    await valueInput.fill(actionValue);
    await this.page.waitForTimeout(500);
  }
}

module.exports = { RulesPage };