import { AllowNull } from "sequelize-typescript";
import { Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config";
import Product from "./models/productModel";
import Category from "./models/categoryModel";
import User from "./models/userModel";
import Order from "./models/orderModel";
import Payment from "./models/paymentModel";
import OrderDetails from "./models/orderDetails";
import Cart from "./models/cartModel";
const sequelize = new Sequelize(envConfig.databaseUrl as string, {
  models: [__dirname + "/models"],
});

try {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connected !!! 😀");
    })
    .catch((err) => {
      console.log("ERROR 😝 : ", err);
    });
} catch (error) {
  console.log(error);
}

sequelize.sync({ force: false, alter: false}).then(() => {
  console.log("synced !!");
});

// trick hai jastai malai category mah Product ko foregin key chiayo bani Category.hasone(Product) , left ko foregin key right mah aauxa

// relationship
Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasOne(Product, { foreignKey: "categoryId" });

// user x order
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

// payment x order

Payment.hasOne(Order, { foreignKey: "paymentId" });
Order.belongsTo(Payment, { foreignKey: "paymentId" });

Order.hasOne(OrderDetails, { foreignKey: "orderId" });
OrderDetails.belongsTo(Order, { foreignKey: "orderId" });

// order detills x product id

Product.hasMany(OrderDetails, { foreignKey: "productId" });
OrderDetails.belongsTo(Product, { foreignKey: "productId" });

// cart x user
Cart.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Cart, { foreignKey: "userId" });

// cart x product
Cart.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Cart, { foreignKey: "productId" });


export default sequelize;
