const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'S3cur3*P@55w0rD_!',
    database: 'my_database',
    port: 3306
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected...');
});

app.get('/api/goals', (req, res) => {
    db.query('SELECT * FROM goals', (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

app.post('/api/goals', (req, res) => {
    const goal = { goal: req.body.goal, start_day: req.body.start_day };
    db.query('INSERT INTO goals SET ?', goal, (err, result) => {
        if (err) throw err;
        res.send('Goal added');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
