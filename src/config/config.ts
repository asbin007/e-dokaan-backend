import { config } from "dotenv"

config()
export const envConfig={
    port: process.env.PORT,
    databaseUrl:process.env.DATABASE_URL,
    jwtSecreteKey:process.env.JWT_SECRETE_KEY,
    jwtExpireIn:process.env.JWT_EXPIRE_IN,
    email:process.env.EMAIL,
    e_password:process.env.E_PASSWORD,
    adminEmail:process.env.ADMIN_EMAIL,
    adminPassword:process.env.ADMIN_PASSWORD,
    adminUsername:process.env.ADMIN_USERNAME,
    live_secrete_key:process.env.LIVE_SECRETE_KEY,
}