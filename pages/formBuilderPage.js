// pages/formBuilderPage.js
// Page Object for creating a new Form and dragging Textbox elements onto the canvas.
// Selectors are illustrative — update them once you inspect the real DOM
// (right-click element -> Inspect -> copy the right locator).

class FormBuilderPage {
  constructor(page) {
    this.page = page;

    this.automationMenu = page.locator('a[name="automations"]');
   this.createButton = page.locator('span[data-text="Create"]');
    this.formOption = page.locator('button[name="create-attended-form"]');

    this.formNameInput = page.locator('input[name="name"]');
    this.createAndEditButton = page.locator('button:has-text("Create & edit")');

    this.textBoxPaletteItem = page.locator('span[data-text="Text Box"]').first();
   this.canvas = page.locator('.formcanvas__leftpane');
   this.saveButton = page.locator('button[name="save"]');

    this.elementLabelInput = page.locator('input[name="label"]');
   this.minCharInput = page.locator('input[name="minLength"]');
this.maxCharInput = page.locator('input[name="maxLength"]');
  this.hintInput = page.locator('input[name="hintText"]');
this.tooltipInput = page.locator('textarea[name="toolTip"]');
  }

 async createNewForm(formName) {
  await this.automationMenu.click();
  await this.dismissPermissionPopupIfPresent();
  await this.createButton.click();
  await this.formOption.click();
  await this.formNameInput.fill(formName);
  await this.createAndEditButton.click();
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

  // make sure the form editor has fully loaded before looking for the palette item
  await this.page.locator('text=Elements').first().waitFor({ state: 'visible', timeout: 20000 });
  await source.waitFor({ state: 'visible', timeout: 20000 });
  await source.scrollIntoViewIfNeeded();
  await target.scrollIntoViewIfNeeded();

  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error('Could not get bounding box for source or target element');
  }

  const startX = sourceBox.x + sourceBox.width / 2;
  const startY = sourceBox.y + sourceBox.height / 2;
  const endX = targetBox.x + targetBox.width / 2;
  const endY = targetBox.y + Math.min(60, targetBox.height / 2);

  await this.page.mouse.move(startX, startY);
  await this.page.mouse.down();
  await this.page.waitForTimeout(300);

  const steps = 25;
  for (let i = 1; i <= steps; i++) {
    const x = startX + ((endX - startX) * i) / steps;
    const y = startY + ((endY - startY) * i) / steps;
    await this.page.mouse.move(x, y);
    await this.page.waitForTimeout(30);
  }

  await this.page.waitForTimeout(300);
  await this.page.mouse.up();
  await this.page.waitForTimeout(500);
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
  }
}

module.exports = { FormBuilderPage };