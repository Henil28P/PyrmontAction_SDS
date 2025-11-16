# PyrmontAction_SDS

A community-driven web platform for membership management, secure online payments, and improved communication. Features include member registration and renewals, Stripe payment integration, members-only content access, automated notifications, and an admin dashboard.

# Running Frontend
- `$ cd frontend`
- `$ npm install`
- `$ npm run dev`

# Running Frontend
- `$ cd backend`
- `$ npm install`
- `$ npm run stripe:login` log in to stripe
- `$ npm run dev:with-stripe` log in to stripe

# End-to-End Testing

- `$ npx playwright install` to first install/update the E2E framework (Playwright)
- `$ npx playwright test tests/e2e/<test-file> --headed` to run all tests from specified file with browser visible to viewer while test runs

# Unit Testing

- Vitest is used
- Install relevant dependencies first: `$ npm install -D vitest @vue/test-utils vue-tsc jsdom @vitejs/plugin-vue` in `frontend` folder (where vite.config.js is)
- To run the unit test, first go to the folder where vite.config.js is (ie. `cd frontend`) and then run: `$ npx vitest run ../test/unit`
- `"test:unit": "vitest run unit/JoinUsForm.spec.js"`
