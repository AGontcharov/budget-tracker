const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("../ui/build"));

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

console.log(__dirname);

app.listen(port, () => console.log(`Listening on port ${port}!`));
