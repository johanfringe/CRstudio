// __tests__/checkHIBPPassword.test.js

// src/utils/__tests__/checkHIBPPassword.test.js

import { checkHIBPPassword } from "../checkHIBPPassword";

describe("checkHIBPPassword", () => {
  test("moet een geldige string aanvaarden", async () => {
    const result = await checkHIBPPassword("superveilig123");
    expect(typeof result).toBe("boolean");
  });
});
