const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;

// Create the HTTP Server
const app = express();

// Parse JSON
app.use(bodyParser.json());

app.use(express.static("../ui/build"));

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

app.post("/login", (req, res) => {
  return res.status(200).json({ message: "Hello World" });
});

app.post("/user", (req, res) => {
  return res.send("Got a POST request");
});

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
