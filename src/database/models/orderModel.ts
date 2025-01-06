import { OrderStatus } from "./../../globals/types/index";
import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "orders",
  modelName: "Order",
  timestamps: true,
})
class Order extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [10, 10],
        msg: "Phone number must be 10 digits, neither less nor more.",
      },
    },
  })
  declare phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare shippingAddress: string; // Fixed typo

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare totalAmount: number;

  @Column({
    type: DataType.ENUM(
      OrderStatus.Cancelled,
      OrderStatus.Delivered,
      OrderStatus.Ontheway,
      OrderStatus.Pending,
      OrderStatus.Preparation
    ),
    allowNull: false, // Ensure OrderStatus is always set
    defaultValue: OrderStatus.Pending,
  })
  declare orderStatus: OrderStatus; // Changed to use the enum type
}

export default Order;