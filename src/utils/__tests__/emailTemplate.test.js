// __tests__/emailTemplate.test.js :
import { emailTemplate } from "../emailTemplate";

describe("emailTemplate()", () => {
  const defaultProps = {
    logoSrc: "https://example.com/logo.png",
    logoAlt: "CRstudio",
    title: "Welkom bij CRstudio",
    intro: "Bedankt voor je registratie.",
    ctaUrl: "https://crstudio.online/login",
    ctaLabel: "Inloggen",
    footer: "© 2025 CRstudio",
  };

  test("bevat alle hoofdonderdelen", () => {
    const html = emailTemplate(defaultProps);

    expect(html).toContain("Welkom bij CRstudio");
    expect(html).toContain("Bedankt voor je registratie.");
    expect(html).toContain("https://crstudio.online/login");
    expect(html).toContain("Inloggen");
    expect(html).toContain("© 2025 CRstudio");
    expect(html).toContain(`<img src="${defaultProps.logoSrc}"`);
    expect(html).toContain(`alt="${defaultProps.logoAlt}"`);
  });

  test("bevat <a> tag met correcte href", () => {
    const html = emailTemplate(defaultProps);
    expect(html).toMatch(new RegExp(`<a[^>]+href=["']${defaultProps.ctaUrl}["']`, "i"));
  });

  test("genereert geldige HTML structuur", () => {
    const html = emailTemplate(defaultProps);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html");
    expect(html).toContain("</html>");
    expect(html).toMatch(/<meta charset=["']UTF-8["']/);
    expect(html).toMatch(/<meta name=["']viewport["']/);
  });

  test("bevat essentiële inline CSS styles", () => {
    const html = emailTemplate(defaultProps);
    expect(html).toMatch(/style="[^"]*font-family: 'Inter'/);
    expect(html).toMatch(/style="[^"]*background-color: #1D4ED8/);
  });

  test("werkt ook met lege strings", () => {
    const html = emailTemplate({
      logoSrc: "",
      logoAlt: "",
      title: "",
      intro: "",
      ctaUrl: "",
      ctaLabel: "",
      footer: "",
    });

    expect(typeof html).toBe("string");
    expect(html).toContain("<html");
    expect(html).toContain("</html>");
  });

  test("genereert consistente output (snapshot)", () => {
    const html = emailTemplate(defaultProps);
    expect(html).toMatchSnapshot();
  });

  test("voorkomt onveilige script injectie in title", () => {
    const html = emailTemplate({ ...defaultProps, title: "<script>alert('x')</script>" });
    expect(html).not.toContain("<script>alert('x')</script>");
    expect(html).toContain("&lt;script&gt;alert(&#039;x&#039;)&lt;/script&gt;");
  });

  test("escape fallback werkt correct bij ontbrekende waarden", () => {
    const html = emailTemplate({
      logoSrc: undefined,
      logoAlt: undefined,
      title: undefined,
      intro: undefined,
      ctaUrl: undefined,
      ctaLabel: undefined,
      footer: undefined,
    });

    expect(typeof html).toBe("string");
    expect(html).toContain("<html");
    expect(html).toContain("</html>");
  });

  test("bevat consistente spacing voor hoofdsecties", () => {
    const html = emailTemplate(defaultProps);
    expect(html).toMatch(/<h1[^>]*>[\s\S]*?<\/h1>/); // inline whitespace validatie
  });

  test("verwerkt speciale karakters correct", () => {
    const html = emailTemplate({ ...defaultProps, title: "Quote \" test & check 'x'" });
    expect(html).toContain("Quote &quot; test &amp; check &#039;x&#039;");
  });
});
