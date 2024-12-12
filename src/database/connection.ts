import { envConfig } from "./../config/config";
import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize(envConfig.databaseUrl as string, {
  dialect: "postgres",
  models: [__dirname + "/models"],
});

try {
  sequelize
    .authenticate()
    .then(() => {
      console.log("authentication is done");
    })
    .catch((err) => {
      console.log("error aayo ", err);
    });
} catch (error) {
  console.log(error);
}

export default sequelize;
