// pages/loginPage.js
// Page Object for the Automation Anywhere login page.
// NOTE: Update the selectors below to match the REAL selectors on the login page
// (open the app, right-click the field -> Inspect, and copy the correct id/name).

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[name="submitLogin"]');
    this.homeHeading = page.locator('text=Home');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async assertLoginSuccessful() {
    await this.page.waitForURL('**/home**', { timeout: 20000 });
  }
}

module.exports = { LoginPage };
