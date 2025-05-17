// __tests__/validateTurnstile.test.js :

import { validateTurnstile } from '../validateTurnstile';

global.fetch = jest.fn();

// 🔧 Mock logger en captureApiError
jest.mock('../logger', () => ({
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  captureApiError: jest.fn(),
}));

describe('validateTurnstile()', () => {
  const { warn, error, log, captureApiError } = require('../logger');

  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, TURNSTILE_SECRET: 'mocked-secret' };
    fetch.mockClear();
    warn.mockClear();
    error.mockClear();
    log.mockClear();
    captureApiError.mockClear();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('❌ Geen token', async () => {
    const result = await validateTurnstile(undefined);
    expect(result).toEqual({ success: false, message: 'Turnstile token is missing' });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Geen token ontvangen!'), expect.anything());
  });

  test('❌ Geen TURNSTILE_SECRET in env', async () => {
    delete process.env.TURNSTILE_SECRET;
    const result = await validateTurnstile('some-token');
    expect(result).toEqual({ success: false, message: 'Internal config error' });
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.mock.calls[0][0]).toContain('secret ontbreekt');
  });

  test('❌ Cloudflare response = success: false', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ success: false, "error-codes": ['invalid-input-response'] }),
    });

    const result = await validateTurnstile('some-token');
    expect(result).toEqual({ success: false, message: 'Turnstile verification failed' });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('verificatie mislukt!'), expect.anything());
    expect(captureApiError).toHaveBeenCalledWith(
      'turnstile.siteverify',
      expect.anything(),
      expect.objectContaining({ errorCode: 'TURNSTILE_FAILED' })
    );
  });

  test('✅ Geldige respons van Cloudflare', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ success: true }),
    });

    const result = await validateTurnstile('valid-token');
    expect(result).toEqual({ success: true });
    expect(log).toHaveBeenCalledWith(expect.stringContaining('validatie geslaagd'), expect.anything());
  });

  test('❌ Netwerkfout / Fetch crasht', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await validateTurnstile('token123');
    expect(result).toEqual({ success: false, message: 'Turnstile validation error' });
    expect(error).toHaveBeenCalledWith(expect.stringContaining('netwerkfout'), expect.anything());
    expect(captureApiError).toHaveBeenCalledWith(
      'Turnstile siteverify',
      undefined,
      expect.objectContaining({ errorCode: 'TURNSTILE_NETWORK_ERROR' })
    );
  });

  test('🧪 JSON zonder success-veld', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ challenge_ts: "2021-01-01T00:00:00Z" }), // geen `success`
    });

    const result = await validateTurnstile('token-without-success');
    expect(result).toEqual({ success: false, message: 'Turnstile verification failed' });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('verificatie mislukt!'), expect.anything());
    expect(captureApiError).toHaveBeenCalledWith(
      'turnstile.siteverify',
      expect.anything(),
      expect.objectContaining({ errorCode: 'TURNSTILE_FAILED' })
    );
  });

  test('🧪 JSON parsing error (ongeldige JSON)', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => { throw new SyntaxError("Unexpected token"); },
    });

    const result = await validateTurnstile('invalid-json-token');
    expect(result).toEqual({ success: false, message: 'Turnstile validation error' });
    expect(error).toHaveBeenCalledWith(expect.stringContaining('netwerkfout'), expect.anything());
    expect(captureApiError).toHaveBeenCalledWith(
      'Turnstile siteverify',
      undefined,
      expect.objectContaining({ errorCode: 'TURNSTILE_NETWORK_ERROR' })
    );
  });

  test('🧪 Cloudflare response met foutcodes', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({
        success: false,
        "error-codes": ["timeout-or-duplicate", "invalid-input-secret"],
      }),
    });

    const result = await validateTurnstile('token-with-errors');
    expect(result).toEqual({ success: false, message: 'Turnstile verification failed' });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('verificatie mislukt!'), expect.anything());
    expect(captureApiError).toHaveBeenCalledWith(
      'turnstile.siteverify',
      expect.anything(),
      expect.objectContaining({
        errorCode: 'TURNSTILE_FAILED',
        cloudflareResponse: expect.objectContaining({
          "error-codes": expect.arrayContaining(["timeout-or-duplicate"]),
        }),
      })
    );
  });
});
