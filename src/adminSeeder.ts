import { envConfig } from "./config/config";
import User from "./database/models/userModel";
import bcrypt from "bcrypt";
const adminSeeder = async () => {
  const [data] = await User.findAll({
    where: {
      email: envConfig.adminEmail,
    },
  });
  if (!data) {
    await User.create({
      username: envConfig.adminUsername,
      password: bcrypt.hashSync(envConfig.adminPassword as string, 8),
      email: envConfig.adminEmail,
      role: "admin",
    });
    console.log("admin seeeder!");
  } else {
    console.log("admin already seeded");
  }
};
export default adminSeeder;
