import { config } from "dotenv"

config()
export const envConfig={
    port: process.env.PORT,
    databaseUrl:process.env.DATABASE_URL
}