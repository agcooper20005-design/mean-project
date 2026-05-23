//Loadint the environment variables from .env file at the very top
require('dotenv').config();

const express = require('express');
const app = express();


//Use process.env to read the PORT variable from hidden .env file
//If something goes wrong with the file, it defaults to 5000 as a fallback
const PORT = process.env.PORT || 5000;

//Basic middleware to parse JSON packets incoming from Seth's frontend
app.use(express.json());

//Simple Test Rout
app.get('/api/hello', (req, res)=> {
    res.json({message: "Hello from the MechanicStream CRM Backend!"})
});

//Startup the server using configured environment port
app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(` Server is running locally on port: ${PORT}`);
    console.log(` Environment configuration loaded successfully!`);
    console.log(`===========================================`);
})