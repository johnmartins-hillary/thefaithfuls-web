//Require all that's needed to power this App
//adding a few documentation
const express = require("express");
const path = require("path");
const app = express();
const cors = require('cors');
app.use(express.static("static"));
app.use('/static', express.static('./../build;'));

// allow cors
app.use(cors());

//default landing:
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./../build", "index.html"));
});
//Running the server on Port 3000 default
let PORT = 3001;
app.listen(PORT, () => {console.log(`App is running on Port ${PORT}`)});
