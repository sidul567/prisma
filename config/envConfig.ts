import dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});

export const envConfig = {
  PORT: process.env.PORT || 8000,
};
