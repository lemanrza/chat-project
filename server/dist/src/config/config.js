import dotenv from "dotenv";
dotenv.config();
export default {
    PORT: process.env.PORT || 3000,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_URL: process.env.DB_URL,
<<<<<<< HEAD
    JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,
    JWT_ACCESS_SECRET_KEY: process.env.JWT_ACCESS_SECRET_KEY
=======
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASS: process.env.GMAIL_PASS,
>>>>>>> d41ad8225c96c6d3b81e52740db065599d081806
};
