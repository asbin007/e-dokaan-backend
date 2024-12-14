import jwt from "jsonwebtoken";
import { envConfig } from "../config/config";
const generateToken = (userId: string) => {
  //jwt takes three argymnet i.e payload,secrete key, expireIn

  const token=jwt.sign({ userId: userId }, envConfig.jwtSecreteKey as string, {
    expiresIn: envConfig.jwtExpireIn,
  });
  return token;
};

export default generateToken;
