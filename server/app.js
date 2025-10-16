const express = require('express')  
const mongoose = require('mongoose')  
const cors = require('cors')
const app = express()
require('dotenv').config();

const routes = require('./routes/appRoutes')

app.use(cors())
app.use(express.json({ limit: '100000mb' }));
app.use(express.urlencoded({ limit: '100000mb', extended: true }));
app.use('/api', routes)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('mongoose connect successes')
    })
    .catch ((err) => {
        console.log(err)
    })

app.listen(process.env.PORT, () => {
    console.log("http://localhost:" + process.env.PORT);
})