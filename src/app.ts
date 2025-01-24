import express from "express";
import "./database/connection";
import userRoute from "./routes/userRoutes";
// import User from "./database/models/userModel";
import categoryRoute from "./routes/categoryRoute";
import productRoute from "./routes/productRoute"
import orderRoute from "./routes/orderRoute"
import cartRoute from "./routes/cartRoute";
import cors from "cors"

const app = express();

app.use(cors({
    origin : "*"
}))
app.use(express.json());

app.use("/api/auth", userRoute);

app.use('/api/category',categoryRoute)
app.use("/api/product",productRoute)
app.use("/api/order",orderRoute)
app.use("/api/cart",cartRoute)

// const schedule = require('node-schedule');

// const job = schedule.scheduleJob('*/5 * * * *',  async function(){
//     await User.findAll()
// });
// permission given to uploads
app.use(express.static('./src/uploads'))
export default app;
