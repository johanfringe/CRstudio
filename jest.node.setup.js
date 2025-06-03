// /jest.node.setup.js :
// Alleen voor node-omgeving (bv. Supabase / Gatsby Functions)
import { fetch, Request, Response, Headers } from "undici";

globalThis.fetch = fetch;
globalThis.Request = Request;
globalThis.Response = Response;
globalThis.Headers = Headers;
