import { config } from "dotenv"

config()
export const envConfig={
    port: process.env.PORT,
    databaseUrl:process.env.DATABASE_URL,
    jwtSecreteKey:process.env.JWT_SECRETE_KEY,
    jwtExpireIn:process.env.JWT_EXPIRE_IN
}