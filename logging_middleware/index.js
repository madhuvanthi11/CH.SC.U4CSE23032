const http = require("http");

let authToken = null;

// Call this once at the start of your app with your token
function setAuthToken(token) {
  authToken = token;
}

// Valid values as per the spec
const VALID_STACKS = ["backend", "frontend"];
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const VALID_PACKAGES = ["api", "component", "hook", "page", "state", "style",];

function Log(stack, level, package_, message) {
  return new Promise((resolve, reject) => {

    // Validate inputs
    if (!VALID_STACKS.includes(stack)) {
      console.error(`[Logger] Invalid stack: "${stack}"`);
      return resolve(null);
    }
    if (!VALID_LEVELS.includes(level)) {
      console.error(`[Logger] Invalid level: "${level}"`);
      return resolve(null);
    }
    if (!VALID_PACKAGES.includes(package_)) {
      console.error(`[Logger] Invalid package: "${package_}"`);
      return resolve(null);
    }
    if (!authToken) {
      console.error("[Logger] No auth token set. Call setAuthToken() first.");
      return resolve(null);
    }

    const body = JSON.stringify({
      stack: stack,
      level: level,
      package: package_,
      message: message
    });

    const options = {
      hostname: "20.207.122.201",
      path: "/evaluation-service/logs",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + authToken,
        "Content-Length": Buffer.byteLength(body)
      }
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on("error", (err) => {
      console.error("[Logger] Failed to send log:", err.message);
      resolve(null); // don't crash the app if logging fails
    });

    req.write(body);
    req.end();
  });
}

module.exports = { Log, setAuthToken };