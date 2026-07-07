const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 8080;

// Serve all static files
app.use(express.static(__dirname));

// Default page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});