import express from "express";
import "./database/connection";
import userRoute from "./routes/userRoutes";
// import User from "./database/models/userModel";
import categoryRoute from "./routes/categoryRoute";
import productRoute from "./routes/productRoute"
const app = express();
app.use(express.json());

app.use("/api/auth", userRoute);
app.use('/api/category',categoryRoute)
app.use("/api/product",productRoute)

// const schedule = require('node-schedule');

// const job = schedule.scheduleJob('*/5 * * * *',  async function(){
//     await User.findAll()
// });

export default app;
