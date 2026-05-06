export async function Log(
  stack: string,
  level: string,
  pkg: string,
  message: string,
  token: string
) {
  try {
    await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
  } catch (e) {
    // silent fail
  }
}