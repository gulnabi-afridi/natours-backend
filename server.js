const mongoose = require('mongoose');
const dotenv = require('dotenv');

// HOW TO CATCH UNCAUGHT EXCEPTION
// All errors that occur in our Synchronous code but are not handled anywhere are called UNCAUGHT EXCEPTION.
// this code should be at the top.

process.on('uncaughtException', (err) => {
  console.log('uncaught Exception 🔥 SHUTTING DOWN ..... ');
  console.log(err.name, err.message);
  process.exit(1);
});

// 👉 read the file and save the varialbles to node environment.
dotenv.config({ path: './config.env' });
// console.log(process.env);

const app = require('./app');

// =============================connection with database====================================
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

const LOCALDATABASE = process.env.DATABASE_LOCAL;

mongoose
  .connect(LOCALDATABASE, {
    // .connect(process.env.DATABASE_LOCAL, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connection successfully created');
  })
  .catch((e) => console.log('error 🔥 while in connecting to DATABASE'));
// =================================================
// 👉 konsa enviroment chal raha hein
// console.log(app.get("env"));
// 👉 will gave you all the enviromental varialble
// console.log(process.env);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App is running ${port}`);
});

//LAST SAFTY NET
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLER REJECTION 🔥 SHUTTING DOWN ..... ');
  // before crashing the app first close the server so that all requests ends and then crash the app.
  server.close(() => {
    process.exit(1);
  });
});

// console.log(x);
