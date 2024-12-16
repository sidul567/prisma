import express from "express";
import routes from "./routes";

export const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Define routes
app.use(routes);
