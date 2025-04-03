import express from "express";

const app = express();
const port = process.env.PORT || 4000;

// Simple test route
app.get("/test", (req, res) => {
  res.json({ message: "Test server is working!" });
});

app.get("/", (req, res) => {
  res.send("Hello from test server!");
});

app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
});
