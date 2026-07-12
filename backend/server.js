const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req,res)=>{
    res.send("TransitOps Backend Running");
});


const PORT = 5001;

app.listen(PORT,"0.0.0.0",()=>{
    console.log(`Server running on port ${PORT}`);
});