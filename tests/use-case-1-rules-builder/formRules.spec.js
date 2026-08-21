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

  test('should create a form with two textboxes and persist 3 rules', async ({ page }) => {
    const formBuilder = new FormBuilderPage(page);
    const rulesPage = new RulesPage(page);
    const formName = `RulesBuilder_TextboxValidation_Form_${Date.now()}`;

    await formBuilder.createNewForm(formName);

    await formBuilder.addTextBox();
    await formBuilder.setTextBoxProperties({
      label: 'First Name',
      min: 2,
      max: 50,
      hint: 'Enter your first name',
      tooltip: 'This field accepts only alphabetic characters',
    });

    await formBuilder.addTextBox();
    await formBuilder.setTextBoxProperties({
      label: 'Last Name',
      min: 2,
      max: 50,
      hint: 'Enter your last name',
      tooltip: 'This field accepts only alphabetic characters',
    });

    await formBuilder.saveForm();

    await rulesPage.openRulesTab();
    await rulesPage.addNewRule();

    await expect(rulesPage.addRuleButton).toBeVisible();

    await rulesPage.addRuleBelow('Rule1');
    await rulesPage.addRuleBelow('Rule2');

    await formBuilder.saveForm();
    await page.reload();
    await rulesPage.openRulesTab();

    await expect(page.locator('text=Rule1')).toBeVisible();
    await expect(page.locator('text=Rule2')).toBeVisible();
    await expect(page.locator('text=Rule3')).toBeVisible();
  });

  test('each rule card should have an Edit button', async ({ page }) => {
    const rulesPage = new RulesPage(page);
    await rulesPage.openRulesTab();

    const editIcons = page.locator('[aria-label="Edit"], text=✏️');
    await expect(editIcons.first()).toBeVisible();
  });
});