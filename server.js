const dotenv = require("dotenv");

// 👉 read the file and save the varialbles to node environment
dotenv.config({ path: "./config.env" });
// console.log(process.env);

const app = require("./app");

// 👉 konsa enviroment chal raha hein
console.log(app.get("env"));
// 👉 will gave you all the enviromental varialble
// console.log(process.env);

// port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server is running ${port}`);
});
