const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const payslipRoute = require("./routes/payslip");
const authRoute = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Allow React frontend to access the backend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/", (req, res) => res.json({ message: "Hello from HRCore!" }));
app.use("/api/auth", authRoute);
app.use("/api/payslip", payslipRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App running on port ${port}`));
