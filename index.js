const express = require("express");
const { userController } = require("./controllers/userController");
const { connection } = require("./configs/db");
const cors = require("cors");
const { authorization } = require("./middleware/authorization");
const { productsController } = require("./controllers/ProductsController");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ massege: "Server is working" });
});

app.use("/user", userController);
app.use("/products", productsController);

app.get(
  "/protected",
  authorization(["buyer", "admin", "seller"]),
  (req, res) => {
    res.json({ message: "good" });
  }
);

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB successfully");
  } catch (error) {
    console.log("error while connection to DB");
    console.log(error);
  }
  console.log(`Server is running at port ${PORT}`);
});
