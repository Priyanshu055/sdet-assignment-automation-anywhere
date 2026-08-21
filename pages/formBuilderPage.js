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
    await this.createButton.click();
    await this.formOption.click();
    await this.formNameInput.fill(formName);
    await this.createAndEditButton.click();
  }

async addTextBox() {
  const source = this.textBoxPaletteItem;
  const target = this.canvas;

  await source.scrollIntoViewIfNeeded();
  await target.scrollIntoViewIfNeeded();

  const sourceHandle = await source.elementHandle();
  const targetHandle = await target.elementHandle();

  await this.page.evaluate(
    ([sourceEl, targetEl]) => {
      const dataTransfer = new DataTransfer();

      const fire = (el, type) => {
        const rect = el.getBoundingClientRect();
        const event = new DragEvent(type, {
          bubbles: true,
          cancelable: true,
          dataTransfer,
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2,
        });
        el.dispatchEvent(event);
      };

      fire(sourceEl, 'dragstart');
      fire(targetEl, 'dragenter');
      fire(targetEl, 'dragover');
      fire(targetEl, 'drop');
      fire(sourceEl, 'dragend');
    },
    [sourceHandle, targetHandle]
  );

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