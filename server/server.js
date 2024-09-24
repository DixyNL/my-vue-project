const express = require('express')
const path = require('path');
const fs = require('fs');
const app = express()
const cors = require('cors')
const port = 3000

app.use(cors());
app.use(express.json());

app.get('/api/data', (req, res) => {
    const filePath = path.join(__dirname, 'mock.json')
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err){
            return res.status(500).send('error reading file')
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(data)
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})