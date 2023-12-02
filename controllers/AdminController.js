const express = require("express");
const path = require("path");

const AdminController = express.Router();

AdminController.get("/", (req, res) => {
  const htmlPath = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin Page</title>
    <style>
      #container {
        max-width: 1250px;
        margin: auto;
        border: 1px solid red;
      }

      form {
        display: flex;
        width: 40%;
        margin: auto;
        /* border: 1px solid red; */
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
      }

      input,
      select {
        width: 90%;
        padding: 10px;
        border-radius: 10px;
        border: 1px solid rgb(177, 174, 174);
      }
      input[type="submit"],
      select {
        width: 95%;
      }
    </style>
  </head>
  <body>
    <div id="container">
      <form>
        <input type="text" placeholder="Name" id="name" />
        <input type="email" placeholder="email" id="email" />
        <select title="Select" id="role">
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
        <input type="password" placeholder="Password" id="password" />
        <input type="submit" />
      </form>
    </div>
  </body>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script type="module">
    let form = document.querySelector("form");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let obj = {
        name: e.target.name.value,
        email: e.target.email.value,
        role: e.target.role.value,
        password: e.target.password.value,
      };
      postData();
    });

    async function postData() {
      try {
        const res = await fetch("/products");
        const data = await res.json();
        console.log(data, "hello");
      } catch (error) {
        console.log(error);
      }
    }
  </script>
</html>

  `;
  res.send(htmlPath);
});

module.exports = { AdminController };
