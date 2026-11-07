// Shared by the form and the server, so the browser stops an over-long paste
// before it costs a Mistral call.
export const MAX_MESSAGE_LENGTH = 4000;

// The browser shrinks screenshots to well under 1 MB first; this guards
// uploads that skip that step. It must stay below the Server Action body limit
// in next.config.ts.
export const MAX_SCREENSHOT_BYTES = 3 * 1024 * 1024;
