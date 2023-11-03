const express = require('express');
const mysqul2 = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const database = mysqul2.createConnection(

    {
        host: 'localhost',
        user: 'root',
        password: '02Co:v!L$dk7#p5',
        database: ''
    }
)