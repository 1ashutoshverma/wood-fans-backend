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
    const res = await axios.get("/products");
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}
