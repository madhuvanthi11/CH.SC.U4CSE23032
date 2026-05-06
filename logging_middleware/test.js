const { Log, setAuthToken } = require("./index");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJjaC5zYy51NGNzZTIzMDMyQGNoLnN0dWRlbnRzLmFtcml0YS5lZHUiLCJleHAiOjE3NzgwNjAyOTUsImlhdCI6MTc3ODA1OTM5NSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjUzYWVkNzI3LTBlNDQtNGEyOC05NWFmLTRiN2NlMWY4ZmQ4ZSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im1hZGh1dmFudGhpIiwic3ViIjoiNDM3MGRkMDMtODgxNy00YzBlLTk3ZjQtMGY2MjUyNjY2ODY1In0sImVtYWlsIjoiY2guc2MudTRjc2UyMzAzMkBjaC5zdHVkZW50cy5hbXJpdGEuZWR1IiwibmFtZSI6Im1hZGh1dmFudGhpIiwicm9sbE5vIjoiY2guc2MudTRjc2UyMzAzMiIsImFjY2Vzc0NvZGUiOiJQVEJNbVEiLCJjbGllbnRJRCI6IjQzNzBkZDAzLTg4MTctNGMwZS05N2Y0LTBmNjI1MjY2Njg2NSIsImNsaWVudFNlY3JldCI6ImF2WFh0QnNaek1aRFdCZGQifQ.2PN0Rf8_FaIuhyZfa80xyA4ovyspYKjsNC5HON1yP3o";

async function main() {
  console.log("Starting test...");

  setAuthToken(TOKEN);

  const result = await Log("frontend", "info", "page", "Test log from middleware");
  
  console.log("Response:", result);
}

main().catch(err => console.log("Caught error:", err));