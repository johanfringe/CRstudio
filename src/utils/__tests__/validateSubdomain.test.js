// __tests__/validateSubdomain.test.js

// Mock logger om testoutput proper te houden
jest.mock("../logger", () => ({
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

// ✅ Correcte relatieve imports
import {
  validateSubdomain,
  getSubdomainValidationSteps,
  MIN_LENGTH,
  MAX_LENGTH,
} from "../validateSubdomain.js";

import { subdomainBlocklist } from "../subdomainBlocklist.js";

describe("validateSubdomain()", () => {
  test("✅ Geldige subdomeinen", () => {
    expect(validateSubdomain("kunstenaars")).toBeNull();
    expect(validateSubdomain("abcde")).toBeNull(); // MIN_LENGTH
    expect(validateSubdomain("a12345-z")).toBeNull();
    expect(validateSubdomain("a".repeat(MAX_LENGTH))).toBeNull(); // MAX_LENGTH
    expect(validateSubdomain("abc-123")).toBeNull(); // mix letters-cijfers-streepje
  });

  test("❌ Te korte subdomeinen", () => {
    expect(validateSubdomain("abcd")).toBe("auth.subdomainInvalidLength");
    expect(validateSubdomain("")).toBe("auth.subdomainInvalidLength");
  });

  test("❌ Te lange subdomeinen", () => {
    expect(validateSubdomain("a".repeat(MAX_LENGTH + 1))).toBe("auth.subdomainInvalidLength");
  });

  test("❌ Ongeldige karakters (symbolen)", () => {
    expect(validateSubdomain("abcde!")).toBe("auth.subdomainInvalidFormat");
    expect(validateSubdomain("abc$de")).toBe("auth.subdomainInvalidFormat");
    expect(validateSubdomain("abc de")).toBe("auth.subdomainInvalidFormat");
    expect(validateSubdomain("abc_de")).toBe("auth.subdomainInvalidFormat");
    expect(validateSubdomain("a@b#c")).toBe("auth.subdomainInvalidFormat");
  });

  test("❌ Ongeldige karakters (niet-ASCII)", () => {
    expect(validateSubdomain("café")).toBe("auth.subdomainInvalidLength");
    expect(validateSubdomain("straße")).toBe("auth.subdomainInvalidFormat");
    expect(validateSubdomain("emoji😀")).toBe("auth.subdomainInvalidFormat");
    expect(validateSubdomain("üser")).toBe("auth.subdomainInvalidLength");
  });

  test("❌ Ongeldige structuur", () => {
    expect(validateSubdomain("-abcde")).toBe("auth.subdomainInvalidStructure");
    expect(validateSubdomain("abcde-")).toBe("auth.subdomainInvalidStructure");
    expect(validateSubdomain("a--bcde")).toBe("auth.subdomainInvalidStructure");
    expect(validateSubdomain("abc--123")).toBe("auth.subdomainInvalidStructure");
    expect(validateSubdomain("123--abc")).toBe("auth.subdomainInvalidStructure");
  });

  test("❌ Blocklist (case insensitive)", () => {
    for (const blocked of Array.from(subdomainBlocklist).slice(0, 2)) {
      expect(validateSubdomain(blocked)).toBe("auth.subdomainBlocklist");
      expect(validateSubdomain(blocked.toUpperCase())).toBe("auth.subdomainBlocklist");
    }
  });

  test("❌ Escape-karakters", () => {
    expect(validateSubdomain("abc\n")).toBe("auth.subdomainInvalidLength");
    expect(validateSubdomain("abc\tde")).toBe("auth.subdomainInvalidFormat");
    expect(validateSubdomain("abc\rdef")).toBe("auth.subdomainInvalidFormat");
  });

  test("🧽 Input wordt getrimd en lowercased", () => {
    expect(validateSubdomain(" Admin ")).toBe("auth.subdomainBlocklist");
  });

  test("⚠️ Alleen verwachte foutcodes worden geretourneerd", () => {
    const validResults = new Set([
      null,
      "auth.subdomainInvalidLength",
      "auth.subdomainInvalidFormat",
      "auth.subdomainInvalidStructure",
      "auth.subdomainBlocklist",
    ]);

    const inputs = [
      "",
      "ab",
      "abc def",
      "---",
      "a--b",
      "kunstenaars",
      "admin",
      "valid-sub",
      "a".repeat(64),
      "valid123",
      "-start",
      "end-",
      "abc@de",
      "über",
      "emoji😀",
    ];

    for (const input of inputs) {
      const result = validateSubdomain(input);
      expect(validResults.has(result)).toBe(true);
    }
  });

  test("🧪 Crasht niet bij random input", () => {
    const fuzz = [
      "8v6v0kv4e9",
      "5qrtqfv*4&-",
      "z😀gv*g65ü5ki",
      "d-6p47x1@aü*d",
      "slq68i#^97_üy@",
      "vq41ä😀k%d*af_av",
      "-ü_%vold9ft*ül2n",
      "fy90q6%w ne8nv&äl",
      "wj1n*g%@e@&üdnr55*",
      "iv@😀q%tt0iy5!-! &07",
      "😀ny&fv&hhav4210ü&ä o",
      "-@364k790u%uvz77e0i@ ",
      "7qw_7-rj@ii_loa5n7jsi7",
      "7@y3^jw8 ö^äfu!r^&6o__e",
      "!näw*@oaxo#😀p9cr-1-^nxw#",
      "90zü6m3e_h77r9y16@😀8😀a 5_",
      "v6😀pqms*%4😀2nüoe5#n_-yn3y2",
      "ttärd7sh^jcq2gy%n*😀zä%hc!lc",
      "r7 fm-7!2pd@ig9x1wn*-ün@lüu7",
      "ü#6ä^f@33^k-feüms%ma_rvj8h8 4",
    ];
    for (const input of fuzz) {
      expect(() => validateSubdomain(input)).not.toThrow();
    }
  });

  test("❌ null en undefined input", () => {
    expect(validateSubdomain(null)).toBe("auth.subdomainInvalidLength");
    expect(validateSubdomain(undefined)).toBe("auth.subdomainInvalidLength");
  });

  test("✅ Geldig subdomein met enkel cijfers", () => {
    expect(validateSubdomain("12345")).toBeNull();
    expect(validateSubdomain("123-456")).toBeNull();
  });

  test("✅ Subdomeinen met middenstreep, zonder begin/eind", () => {
    expect(validateSubdomain("abc-def-ghi")).toBeNull();
  });

  test("❌ Begin/eind met streep zonder middenvalidatie", () => {
    expect(validateSubdomain("-ab-cbd")).toBe("auth.subdomainInvalidStructure");
    expect(validateSubdomain("ab-cd-")).toBe("auth.subdomainInvalidStructure");
  });
});

describe("getSubdomainValidationSteps()", () => {
  test("✅ Volledig geldig subdomein", () => {
    const input = "kunstenaars";
    const steps = getSubdomainValidationSteps(input);

    expect(steps).toMatchObject({
      notEmpty: true,
      validChars: true,
      correctLength: true,
      startsCorrectly: true,
      endsCorrectly: true,
      matchesStructure: true,
      notInBlocklist: true,
    });
  });

  test("❌ Lege input", () => {
    const steps = getSubdomainValidationSteps("");
    expect(steps).toMatchObject({
      notEmpty: false,
      validChars: false,
      correctLength: false,
      startsCorrectly: false,
      endsCorrectly: false,
      matchesStructure: false,
      notInBlocklist: true,
    });
  });

  test("❌ Blocklist", () => {
    const blocked = Array.from(subdomainBlocklist)[0];
    const steps = getSubdomainValidationSteps(blocked);
    expect(steps.notInBlocklist).toBe(false);
  });

  test("❌ Slechte karakterstructuur", () => {
    const steps = getSubdomainValidationSteps("abc def!");
    expect(steps.validChars).toBe(false);
    expect(steps.matchesStructure).toBe(false);
  });

  test("❌ Goed formaat maar foute structuur", () => {
    const steps = getSubdomainValidationSteps("-abcde-");
    expect(steps.startsCorrectly).toBe(false);
    expect(steps.endsCorrectly).toBe(false);
    expect(steps.matchesStructure).toBe(false);
  });

  test("🔁 Grenswaarden MIN/MAX", () => {
    const tooShort = "a".repeat(MIN_LENGTH - 1);
    const exactMin = "a".repeat(MIN_LENGTH);
    const exactMax = "a".repeat(MAX_LENGTH);
    const tooLong = "a".repeat(MAX_LENGTH + 1);

    expect(validateSubdomain(tooShort)).toBe("auth.subdomainInvalidLength");
    expect(validateSubdomain(exactMin)).toBeNull();
    expect(validateSubdomain(exactMax)).toBeNull();
    expect(validateSubdomain(tooLong)).toBe("auth.subdomainInvalidLength");
  });

  test("🆕 Random numeriek/streep validatie", () => {
    const steps = getSubdomainValidationSteps("123-456");
    expect(steps.validChars).toBe(true);
    expect(steps.matchesStructure).toBe(true);
    expect(steps.notInBlocklist).toBe(true);
  });

  test("🧠 Consistentie tussen steps en final output", () => {
    const input = "abc123-xyz";
    const steps = getSubdomainValidationSteps(input);
    const result = validateSubdomain(input);

    Object.values(steps).forEach(val => expect(val).toBe(true));
    expect(result).toBeNull();
  });

  test("❌ null input geeft alle stappen false behalve blocklist", () => {
    const steps = getSubdomainValidationSteps(null);
    expect(steps.notEmpty).toBe(false);
    expect(steps.validChars).toBe(false);
    expect(steps.correctLength).toBe(false);
    expect(steps.startsCorrectly).toBe(false);
    expect(steps.endsCorrectly).toBe(false);
    expect(steps.matchesStructure).toBe(false);
    expect(steps.notInBlocklist).toBe(true);
  });
});
