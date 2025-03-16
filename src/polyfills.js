// src/polyfills.js
import { Buffer } from "buffer";

window.Buffer = Buffer;
window.global = window;
window.process = window.process || { env: {} };

// Fix for CommonJS modules expecting exports
if (typeof window.exports === "undefined") {
  window.exports = {};
}
