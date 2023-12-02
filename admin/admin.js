// const { Axios } = require("axios");
// import axios from "axios";
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
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
