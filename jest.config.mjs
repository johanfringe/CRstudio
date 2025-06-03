// jest.config.mjs :
export default {
  projects: [
    {
      displayName: "node",
      testEnvironment: "node",
      setupFiles: ["<rootDir>/jest.node.setup.js"],
      testMatch: ["**/__tests__/**/!(*ui*).test.js"],
    },
    {
      displayName: "jsdom",
      testEnvironment: "jsdom",
      setupFiles: ["<rootDir>/jest.jsdom.setup.js"],
      testMatch: ["**/__tests__/**/*ui*.test.js"], // alle docs die jsdom nodig hebben een "ui" geven in naam
    },
  ],
};
