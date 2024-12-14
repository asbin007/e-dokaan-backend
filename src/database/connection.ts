import { envConfig } from "./../config/config";
import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize(envConfig.databaseUrl as string, {
  dialect: "postgres",
  models: [__dirname + "/models"],
});

// Function to initialize the database connection
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database authentication successful");

    // Sync the models with the database
    await sequelize.sync({ force: false });
    console.log("Database synchronized successfully");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

// Call the function to initialize the database
initializeDatabase();

export default sequelize;