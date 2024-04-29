const mongoose = require('mongoose')
const connectionString = "mongodb+srv://ritik:ritik@cluster0.0dezlts.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

async function connectToDatabase ()
{
    await mongoose.connect(connectionString)
    console.log("connect to DB successfully")
}

module.exports = connectToDatabase