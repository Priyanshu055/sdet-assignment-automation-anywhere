// pages/formBuilderPage.js
const { expect } = require('@playwright/test');

class FormBuilderPage {
  constructor(page) {
    this.page = page;
    this.editor = page.frameLocator('iframe').first();

    this.automationMenu = page.locator('a[name="automations"]');
    this.createButton = page.locator('span[data-text="Create"]');
    this.formOption = page.locator('button[name="create-attended-form"]');
    this.formNameInput = page.locator('input[name="name"]');
    this.createAndEditButton = page.locator('button:has-text("Create & edit")');

    // The editor exposes palette controls as buttons inside its iframe.
    this.textBoxPaletteItem = this.editor.getByRole('button', { name: /Text Box/ }).first();

    // Canvas drop zone (confirmed from DevTools)
    this.canvas = this.editor.locator('.formcanvas__leftpane').first();

    this.saveButton = this.editor.locator('button:has-text("Save")').first();

    this.elementLabelInput = this.editor.locator('input[name="label"]').first();
    this.minCharInput = this.editor.locator('input[name="minLength"]').first();
    this.maxCharInput = this.editor.locator('input[name="maxLength"]').first();
    this.hintInput = this.editor.locator('input[name="hintText"]').first();
    this.tooltipInput = this.editor.locator('textarea[name="toolTip"], input[name="toolTip"]').first();
  }

  async handleBlockPopup() {
    try {
      const blockBtn = this.page.locator('button:has-text("Block")');
      await blockBtn.waitFor({ state: 'visible', timeout: 2000 });
      await blockBtn.click();
    } catch (_) {}
  }

  async createNewForm(formName) {
    await this.automationMenu.click();
    await this.handleBlockPopup();

    await this.createButton.click();
    await this.formOption.click();

    await this.formNameInput.fill(formName);
    await this.page.waitForTimeout(1500);

    await this.createAndEditButton.waitFor({ state: 'visible', timeout: 10000 });
    await expect(this.createAndEditButton).toBeEnabled({ timeout: 15000 });
    await this.createAndEditButton.click();

    // SPA URL change hone ka wait (hash routing)
    await this.page.waitForURL('**/form/edit**', { timeout: 20000 });
    await this.handleBlockPopup();
    await this.page.waitForTimeout(3000);
  }

  async addTextBox() {
    await this.textBoxPaletteItem.waitFor({ state: 'visible', timeout: 15000 });
    await this.textBoxPaletteItem.scrollIntoViewIfNeeded();

    try {
      await this.textBoxPaletteItem.dragTo(this.canvas, {
        force: true,
        timeout: 8000,
      });
    } catch (_) {
      const sourceBox = await this.textBoxPaletteItem.boundingBox();
      const targetBox = await this.canvas.boundingBox();
      if (sourceBox && targetBox) {
        await this.page.mouse.move(
          sourceBox.x + sourceBox.width / 2,
          sourceBox.y + sourceBox.height / 2
        );
        await this.page.mouse.down();
        await this.page.waitForTimeout(400);
        await this.page.mouse.move(
          targetBox.x + targetBox.width / 2,
          targetBox.y + targetBox.height / 2,
          { steps: 30 }
        );
        await this.page.waitForTimeout(400);
        await this.page.mouse.up();
      }
    }

    await this.page.waitForTimeout(1500);
  }

  async setTextBoxProperties({ label, min, max, hint, tooltip }) {
    if (label && await this.elementLabelInput.isVisible()) await this.elementLabelInput.fill(label);
    if (min && await this.minCharInput.isVisible()) await this.minCharInput.fill(String(min));
    if (max && await this.maxCharInput.isVisible()) await this.maxCharInput.fill(String(max));
    if (hint && await this.hintInput.isVisible()) await this.hintInput.fill(hint);
    if (tooltip && await this.tooltipInput.isVisible()) await this.tooltipInput.fill(tooltip);
  }

  async saveForm() {
    if (await this.saveButton.isVisible()) {
      await this.saveButton.click();
    }
    await this.page.waitForTimeout(1000);
  }
}

module.exports = { FormBuilderPage };