const express = require('express');
const cors = require('cors');
require('dotenv').config();

//For Middleware
const app = express();
app.use(cors());
app.use(express.json());


/********************************************\
            MongoDB Connection Start
\********************************************/



/********************************************\
            MongoDB Connection End
\********************************************/



// Create Root API
app.get('/', (req, res)=>{
    res.send("Running eTools Server")
});

// For Port & Listening
const port = process.env.PORT || 8080;
app.listen(port, (req, res)=>{
    console.log("Listening to port: ", port);
});