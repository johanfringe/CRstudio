// __tests__/statusMap.test.js :
import { createStatusConfig } from "../statusMap";

describe("createStatusConfig()", () => {
  test("gebruikt default fallbacks bij ontbrekende props", () => {
    const config = createStatusConfig({
      statusCode: "TEST_CODE",
      translationKey: "test.translation",
    });

    expect(config.originContext).toBe(null);
    expect(config.isFallback).toBe(false);
    expect(config.logToSentry).toBe(false);
  });
});
