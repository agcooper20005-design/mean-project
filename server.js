const express = require('express');
const app = express();
const PORT = 3000;


app.get('/api/hello',(req, res) => {
    res.json({
        message: "Hello World from the Backend!",
        status: "Alive",
        timestamp: new Date().toLocaleDateString()
    })
})


app.listen(PORT, () => {
    console.log('\n Server is running!');
    console.log(`Link: http://localhost:${PORT}/api/hello`)
})

