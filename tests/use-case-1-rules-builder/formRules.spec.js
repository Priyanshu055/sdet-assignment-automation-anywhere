// tests/use-case-1-rules-builder/formRules.spec.js
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

    // Step 1-4: create form and add two textboxes with properties
    await formBuilder.createNewForm('RulesBuilder_TextboxValidation_Form_Auto');

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

    // Step 5-6: open Rules tab, add Rule1
    await rulesPage.openRulesTab();
    await rulesPage.addNewRule();

    // Assert Add Rule button is visible and functional
    await expect(rulesPage.addRuleButton).toBeVisible();

    // Step 7-9: add condition, AND condition, action (Rule1)
    // NOTE: fill in the actual condition/action calls once selectors are
    // confirmed against the real DOM - see rulesPage.js setCondition/setAction.

    // Step 10: use context menu "Add Rule Below" to create Rule2 and Rule3
    await rulesPage.addRuleBelow('Rule1');
    await rulesPage.addRuleBelow('Rule2');

    // Step 11: save and verify all 3 rules persist
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
