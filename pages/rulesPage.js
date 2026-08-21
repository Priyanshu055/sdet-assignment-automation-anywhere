// pages/rulesPage.js
class RulesPage {
  constructor(page) {
    this.page = page;
    this.editor = page.frameLocator('iframe').first();
    this.addRuleButton = this.editor.getByRole('button', { name: /Add rule/i }).first();
  }

  async openRulesTab() {
    const tab = this.editor.locator('text=/^Form rules \(\d+\)$/').first();
    await tab.waitFor({ state: 'visible', timeout: 10000 });
    await tab.click({ force: true });
    await this.addRuleButton.waitFor({ state: 'visible', timeout: 10000 });
  }

  async addNewRule() {
    await this.addRuleButton.click({ force: true });
    await this.page.waitForTimeout(500);
  }

  async addRuleBelow(ruleName) {
    const moreOptionsBtn = this.editor.locator('[aria-label="More options"], button:has-text("..."), [data-testid="more-options"]').last();
    try {
      if (await moreOptionsBtn.isVisible()) {
        await moreOptionsBtn.click({ force: true });
        await this.editor.getByText('Add rule below', { exact: true }).click({ force: true });
      }
    } catch {
      await this.addNewRule();
    }
    await this.page.waitForTimeout(500);
  }
}

module.exports = { RulesPage };