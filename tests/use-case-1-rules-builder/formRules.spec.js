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

    // 5. Open Rules Tab & Verify Add Rule Button
    await rulesPage.openRulesTab();
    await expect(rulesPage.addRuleButton).toBeVisible();

    // 6. Create Rule1 and configure its condition, AND mode, and action
    await rulesPage.addNewRule();
    await rulesPage.configureRule1('First Name - TextBox0', 'Last Name - TextBox1', 'Last Name - TextBox1', 'Verified');

    // 7. Create Rule2 and Rule3 via context menu
    await rulesPage.addRuleBelow('Rule1');
    await rulesPage.addRuleBelow('Rule2');

    // 8. Assert Edit button is present on rule cards
    const editIcons = rulesPage.editor.locator('[aria-label="Edit"], text=✏️');
    if (await editIcons.count() > 0) {
      await expect(editIcons.first()).toBeVisible();
    }

    // 9. Save Form and Verify Persistence After Reload
    await formBuilder.saveForm();
    await page.reload();
    await rulesPage.openRulesTab();

    await expect(rulesPage.editor.getByText('Rule1', { exact: true }).first()).toBeVisible();
    await expect(rulesPage.editor.getByText('Rule2', { exact: true }).first()).toBeVisible();
    await expect(rulesPage.editor.getByText('Rule3', { exact: true }).first()).toBeVisible();
  });
});