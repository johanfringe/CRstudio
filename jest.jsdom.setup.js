// jest.jsdom.setup.js :
// Alleen voor jsdom-omgeving (bv. Turnstile / document-tests)
import { TextEncoder, TextDecoder } from "util";
import { ReadableStream, WritableStream } from "stream/web";

globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;
globalThis.ReadableStream = ReadableStream;
globalThis.WritableStream = WritableStream;
