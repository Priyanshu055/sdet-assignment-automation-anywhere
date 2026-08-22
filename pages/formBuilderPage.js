class FormBuilderPage {
  constructor(page) {
    this.page = page;
    this.editor = page.frameLocator('iframe').first();

    this.automationMenu = page.locator('a[name="automations"]');
    this.createButton = page.locator('span[data-text="Create"]');
    this.formOption = page.locator('button[name="create-attended-form"]');

    this.formNameInput = page.locator('input[name="name"]');
    this.createAndEditButton = page.locator('button:has-text("Create & edit")');

    this.elementsSection = this.editor.getByRole('button', { name: 'Elements', exact: true });
    this.textBoxPaletteItem = this.editor.getByRole('button', { name: /Text Box/ }).first();
    this.canvas = this.editor.locator('.formcanvas__leftpane').first();
    this.saveButton = this.editor.locator('button[name="save"]').first();

    this.elementLabelInput = this.editor.locator('input[name="label"]').first();
    this.minCharInput = this.editor.locator('input[name="minLength"]').first();
    this.maxCharInput = this.editor.locator('input[name="maxLength"]').first();
    this.hintInput = this.editor.locator('input[name="hintText"]').first();
    this.tooltipInput = this.editor.locator('textarea[name="toolTip"]').first();
    
    this.textboxCount = 0;
  }

  async createNewForm(formName) {
    await this.automationMenu.click();
    await this.dismissPermissionPopupIfPresent();
    await this.createButton.click();
    await this.formOption.click();
    await this.formNameInput.fill(formName);
    await this.createAndEditButton.click();

    await this.page.locator('text=Create form').waitFor({ state: 'hidden', timeout: 30000 });
  }

  async dismissPermissionPopupIfPresent() {
    const blockButton = this.page.locator('button:has-text("Block")');
    try {
      await blockButton.waitFor({ state: 'visible', timeout: 5000 });
      await blockButton.click();
    } catch {
      // popup didn't appear this time - nothing to do
    }
  }

  async addTextBox() {
    const source = this.textBoxPaletteItem;
    const target = this.canvas;

    if (!(await source.isVisible({ timeout: 3000 }).catch(() => false))) {
      await this.elementsSection.click({ force: true });
    }
    await source.waitFor({ state: 'visible', timeout: 60000 });
    await source.scrollIntoViewIfNeeded();
    await target.waitFor({ state: 'visible', timeout: 15000 });
    await target.scrollIntoViewIfNeeded();

    const sourceBox = await source.boundingBox();
    const targetBox = await target.boundingBox();
    if (!sourceBox || !targetBox) {
      throw new Error('Could not locate the Text Box palette item or form canvas');
    }

    const startX = sourceBox.x + sourceBox.width / 2;
    const startY = sourceBox.y + sourceBox.height / 2;
    const endX = targetBox.x + targetBox.width / 2;
    const endY = targetBox.y + Math.min(60, targetBox.height / 2) + (this.textboxCount * 120);

    console.log(`Dragging textbox #${this.textboxCount} to offset endY: ${endY}`);
    this.textboxCount++;

    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.waitForTimeout(300);
    await this.page.mouse.move(endX, endY, { steps: 30 });
    await this.page.waitForTimeout(300);
    await this.page.mouse.up();
    await this.page.waitForTimeout(1000);
  }

  async setTextBoxProperties({ label, min, max, hint, tooltip }) {
    if (label) await this.elementLabelInput.fill(label);
    if (min) await this.minCharInput.fill(String(min));
    if (max) await this.maxCharInput.fill(String(max));
    if (hint) await this.hintInput.fill(hint);
    if (tooltip) await this.tooltipInput.fill(tooltip);
  }

  async saveForm() {
    await this.saveButton.click();
    await this.page.waitForTimeout(5000);
  }

  async closeEditor() {
    const closeBtn = this.editor.locator('button:has-text("Close"), button:has-text("Cancel")').first();
    await closeBtn.waitFor({ state: 'visible', timeout: 10000 });
    await closeBtn.click({ force: true });
    await this.page.waitForTimeout(3000);
  }

  async reopenForm(formName) {
    const searchInput = this.page.locator('input[placeholder*="Search"]').first();
    await searchInput.waitFor({ state: 'visible', timeout: 15000 });
    await searchInput.fill(formName);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(3000);

    const formLink = this.page.locator('a').filter({ hasText: /RulesBuilder_Form_/ }).first();
    await formLink.waitFor({ state: 'visible', timeout: 15000 });
    await formLink.click();
    await this.page.waitForTimeout(5000);
  }
}

module.exports = { FormBuilderPage };