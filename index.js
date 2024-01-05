const express = require('express');
const cors = require('cors');
const { connect } = require('./connection');
const userRouter = require('./routes/user.route');
const productRouter = require('./routes/product.route');
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRouter)
app.use("/products", productRouter)

app.listen(process.env.port, async()=>{
    try {
        await connect
        console.log("connection established...")
        console.log(`http://localhost:${process.env.port}`)
    } catch (error) {
        console.log("Error in established connection")
        console.log(error)
    }
})