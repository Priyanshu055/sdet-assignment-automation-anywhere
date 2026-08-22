# Automation Anywhere Community Edition - SDET Automation Assignment

Automated tests for two use cases in Automation Anywhere Community Edition:
1. **Use Case 1**: Form with Rules Builder (UI Automation)
2. **Use Case 2**: Learning Instance API Flow (API Automation)

## Framework & Tools Used
- **Playwright** (JavaScript) — chosen for its built-in support for both UI and API testing in a single framework
- **Page Object Model (POM)** design pattern for UI automation
- **dotenv** for managing credentials securely

## Project Structure
```
/pages              -> Page Object classes (Login, Form Builder, Rules)
/api                -> API helper modules (auth, Learning Instance)
/tests
  /use-case-1-rules-builder   -> UI automation specs
  /use-case-2-learning-instance -> API automation specs
playwright.config.js
.env.example
```

## Setup Instructions

1. **Clone the repository**
   ```
   git clone <repo-url>
   cd aa-automation-project
   ```

2. **Install dependencies**
   ```
   npm install
   npx playwright install
   ```

3. **Configure environment variables**
   - Copy  `.env`
   - Fill in your Automation Anywhere Community Edition credentials:
     ```
     BASE_URL=https://community.cloud.automationanywhere.digital
     AA_USERNAME=your_email@example.com
     AA_PASSWORD=your_password
     ```
   - **Never commit the `.env` file** (already in `.gitignore`)

## Running the Tests

Run all tests:
```
npm test
```

Run only UI tests (Use Case 1):
```
npm run test:ui
```

Run only API tests (Use Case 2):
```
npm run test:api
```

Run in headed mode (see the browser):
```
npm run test:headed
```

View the HTML report after a run:
```
npm run report
```

## Environment / Configuration Notes
- Selectors in the Page Object files are illustrative placeholders and were
  updated after inspecting the live DOM in Chrome DevTools.
- The Learning Instance API endpoint was identified via the browser Network tab:
  `POST https://community.cloud.automationanywhere.digital/cognitive/v3/learninginstances`
- Community Edition accounts are limited to 5 Learning Instances, so API tests
  create instances with a timestamp-based unique name to avoid clashes on reruns.

## Assumptions
- "At least two textboxes" was interpreted as exactly two (First Name, Last Name).
- Rule2 and Rule3 use different condition types (Does not contain / Ends with)
  and different actions (Append Value / Show error) to demonstrate broader
  coverage of the Rules Builder's capabilities beyond the minimum requirement.
