import { PaymentMethod, PaymentStatus } from "./../../globals/types/index";

import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "payment",
  modelName: "Payment",
  timestamps: true,
})
class Payment extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUID,
  })
  declare id: string;

  @Column({                                                                                                                                                                                                     
    type: DataType.ENUM(
      PaymentMethod.COD,
      PaymentMethod.Esewa,
      PaymentMethod.Khalti
    ),
    defaultValue: PaymentMethod.COD,
  })
  declare paymentMethod: string;

  @Column({
    type:DataType.ENUM(PaymentStatus.Paid,PaymentStatus.Unpaid),
    defaultValue:PaymentStatus.Unpaid
  })
  declare paymentStatus:string
}

export default Payment