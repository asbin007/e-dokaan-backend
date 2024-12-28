import adminSeeder from "./src/adminSeeder";
import app from "./src/app";
import { envConfig } from "./src/config/config";
import categoryContoller from "../server/src/controllers/categoryContoller";
function startServer() {
  const port = envConfig.port || 4000;
  app.listen(port, () => {
    categoryContoller.seedCategory();

    console.log(`Sever has been started at ${port}`);
    adminSeeder();
  });
}
startServer();
