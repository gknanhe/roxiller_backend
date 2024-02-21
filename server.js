import express from "express";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import { data } from "./data.js";
import Transaction from "./models/transaction.js";
import allRoutes from "./routes/allRoutes.js";
import cors from "cors";

const app = express();
dotenv.config();
// console.log(process.env.PORT);
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true, //for headers cookies
  })
);
connectMongoDB();
app.use(express.json());

// Store data in MongoDB
// Transaction.insertMany(data)
//   .then(() => {
//     console.log("Data inserted into MongoDB successfully!");
//   })
//   .catch((error) => {
//     console.error("Error inserting data into MongoDB:", error);
//   });

// function addMonthFieldToObjectArray(objectArray) {
//   // Loop through each object in the array
//   objectArray.forEach((obj) => {
//     // Extract the month from the dateOfSale field
//     const dateOfSale = new Date(obj.dateOfSale);
//     const month = dateOfSale.getMonth() + 1; // getMonth() returns zero-based month index

//     // Add the month field to the object
//     obj.month = month;
//   });
// }

// addMonthFieldToObjectArray(data);
// console.log(data);

// app.get("/", (req, res) => {
//   res.send(data);
// });

app.use("/api/transactions", allRoutes);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
