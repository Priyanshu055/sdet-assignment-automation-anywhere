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
    this.canvas = page.locator('[class*="canvas"], [data-testid="form-canvas"]');
   this.saveButton = page.locator('button[name="save"]');

    this.elementLabelInput = page.locator('input[name="label"]');
    this.minCharInput = page.locator('label:has-text("Min") + input');
    this.maxCharInput = page.locator('label:has-text("Max") + input');
    this.hintInput = page.locator('label:has-text("Hint below field") + textarea, label:has-text("Hint below field") + input');
    this.tooltipInput = page.locator('label:has-text("Tool tip") + textarea');
  }

  async createNewForm(formName) {
    await this.automationMenu.click();
    await this.createButton.click();
    await this.formOption.click();
    await this.formNameInput.fill(formName);
    await this.createAndEditButton.click();
  }

  async addTextBox() {
    await this.textBoxPaletteItem.dragTo(this.canvas);
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