const express = require("express");
const router = require("./routes");

const port = process.env.PORT || 8080;

// Create the HTTP Server
const app = express();

// Parse JSON - Express 4.x has body-parser bundled together
app.use(express.json());
app.use(express.static("../ui/build"));

// Load the API router
app.use("/api", router);

// Serve the index.html file on get requests
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

app.use((req, res, next) => {
  res.status(404).json({ message: "Sorry can't find that!" });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
