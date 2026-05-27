//Loadint the environment variables from .env file at the very top
require('dotenv').config();

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');


//Import the structural factory function
const createCustomerRecord = require('./models/Customer');


//Use process.env to read the PORT variable from hidden .env file
//If something goes wrong with the file, it defaults to 5000 as a fallback
const PORT = process.env.PORT || 5000;


//Basic middleware to parse JSON packets incoming from Seth's frontend
app.use(express.json());

/** API ROUTING*/

app.post('/api/test-structure', (req, res) =>{
    try{
        //pass the incoming request body straight through the model builder
        const structuredCustomer = createCustomerRecord(req.body);

        res.json({
            message: "MEC-12 Object Structure validated succefully",
            isValidated: true,
            structuredData: structuredCustomer
        });
    }catch (error){
        res.status(400).json({
            error: "Data structure processing failed.",
            details: error.message
        });
    }

});

app.post('/api/customers', (req,res)=>{
    try{
        //Run data through corrected model builder
        const structuredCustomer = createCustomerRecord(req.body);

        //Basic validation: Make sure they at least provide a name and phone
        if(!structuredCustomer.customerName || !structuredCustomer.phone){
            return res.status(400).json({error: "Customer Name and Phone number are required"})
        }
        // Define a clean filename using the phone number (Slugging out dashes and spaces)
        const safeFileName = structuredCustomer.phone.replace(/[^0-9]/g,'') + '.json';

        //target path: /data/customers/XXXXXXXXX.json
        const filePath = path.join(__dirname, 'data','customers',safeFileName);

        //Write the structured object to a physical file (formatted with 2-spaces indentation)
        fs.writeFile(filePath, JSON.stringify(structuredCustomer, null, 2), 'utf8', (err)=>{
            if(err){
                console.error("Failed to write customer file:", err);
                return res.status(500).json({error: "Database file write operation failed."});
            }

            //Return success response
            res.status(201).json({
                message: "Customer record created and stored successfully",
                fileNameStored: safeFileName,
                data: structuredCustomer
            });
        })
    }catch (error){
        res.status(400).json({error: "Processing failed.", details:error.message});
    }
})


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