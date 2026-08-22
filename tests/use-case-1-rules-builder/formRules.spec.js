require('dotenv').config();
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/loginPage');
const { FormBuilderPage } = require('../../pages/formBuilderPage');
const { RulesPage } = require('../../pages/rulesPage');

test.describe('Use Case 1: Form with Rules Builder (UI Automation)', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.AA_USERNAME, process.env.AA_PASSWORD);
    await loginPage.assertLoginSuccessful();
  });

  test('should create a form with two textboxes, configure rules, and verify persistence', async ({ page }) => {
    test.setTimeout(120000);
    const formBuilder = new FormBuilderPage(page);
    const rulesPage = new RulesPage(page);
    const formName = `RulesBuilder_Form_${Date.now()}`;

    // 1. Create Form
    await formBuilder.createNewForm(formName);

    // 2. Add Textbox 1 & Set Properties
    await formBuilder.addTextBox();
    await formBuilder.setTextBoxProperties({
      label: 'First Name',
      min: 2,
      max: 50,
      hint: 'Enter your first name',
      tooltip: 'This field accepts only alphabetic characters',
    });

    // 3. Add Textbox 2 & Set Properties
    await formBuilder.addTextBox();
    await formBuilder.setTextBoxProperties({
      label: 'Last Name',
      min: 2,
      max: 50,
      hint: 'Enter your last name',
      tooltip: 'This field accepts only alphabetic characters',
    });

    // 4. Save Form
    await formBuilder.saveForm();

    // 5. Open Rules Tab & Verify Add Rule Button is visible
    await rulesPage.openRulesTab();
    await expect(rulesPage.addRuleButton).toBeVisible();

    // 6. Create Rule1 and configure its condition, AND mode, and action
    await rulesPage.addNewRule();
    await rulesPage.configureRule1('First Name - TextBox0', 'Last Name - TextBox1', 'Last Name - TextBox1', 'Verified');

    // Assert Rule1 is visible in expanded mode (by verifying its 'Then' block is visible)
    const thenHeader = rulesPage.editor.getByText('Then', { exact: true }).first();
    await expect(thenHeader).toBeVisible();

    // Assert Conditions are correctly configured
    await expect(rulesPage.dropdowns.nth(0)).toContainText('First Name - TextBox0');
    await expect(rulesPage.dropdowns.nth(1)).toContainText('Is not empty');
    await expect(rulesPage.dropdowns.nth(2)).toContainText('Last Name - TextBox1');
    await expect(rulesPage.dropdowns.nth(3)).toContainText('Is not empty');

    // Assert Action (Set Value) is properly assigned to the target element
    await expect(rulesPage.dropdowns.nth(4)).toContainText('Last Name - TextBox1');
    await expect(rulesPage.dropdowns.nth(5)).toContainText('Set value');
    const valueInput = rulesPage.editor.locator('input[type="text"]').last();
    await expect(valueInput).toBeVisible();
    await expect(valueInput).toHaveValue('Verified');

    // 7. Create Rule2 and Rule3 via context menu ("Add rule below")
    await rulesPage.addRuleBelow('Rule1');
    await rulesPage.addRuleBelow('Rule2');

    // 8. Assert all rules are visible in the rules list after creation and edit buttons are present on each
    for (const ruleName of ['Rule1', 'Rule2', 'Rule3']) {
      const ruleTitle = rulesPage.editor.getByText(ruleName, { exact: true }).first();
      await ruleTitle.scrollIntoViewIfNeeded();
      await expect(ruleTitle).toBeVisible();
      
      // Find the card container and assert the edit button is present
      const ruleCard = ruleTitle.locator('xpath=ancestor::*[2]');
      const editBtn = ruleCard.locator('button[aria-label="edit"]').first();
      await expect(editBtn).toBeVisible();
    }

    // 9. Save Form and Verify Persistence by Reopening Form
    await formBuilder.saveForm();
    await formBuilder.closeEditor();
    await formBuilder.reopenForm(formName);
    await rulesPage.openRulesTab();

    // Verify Rule1, Rule2, and Rule3 persist and are displayed
    await expect(rulesPage.editor.getByText('Rule1', { exact: true }).first()).toBeVisible();
    await expect(rulesPage.editor.getByText('Rule2', { exact: true }).first()).toBeVisible();
    await expect(rulesPage.editor.getByText('Rule3', { exact: true }).first()).toBeVisible();
  });
});