const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT || 3001; // Use the PORT environment variable or default to 3001

app.use(bodyParser.json()); // Add this line to parse JSON requests

mongoose.connect('mongodb://127.0.0.1:27017/lappy', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB'); // Log a successful MongoDB connection
    startServer(); // Start the Express server after a successful MongoDB connection
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Define the UserSchema
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: Number,
  password: String,
});

// Create a userModel based on the UserSchema
const userModel = mongoose.model("users", UserSchema); // Keep "users" as the collection name

// Define your routes before starting the server
app.post('/signup', (req, res) => {
  const userData = req.body;

  // Create a new user document and save it
  const user = new userModel(userData);
  user.save((err, newUser) => {
    if (err) {
      console.error("Error inserting user data:", err);
      if (err.code === 11000) {
        // Handle duplicate key error (e.g., duplicate email)
        res.status(400).send("Email already exists. Please use a different email.");
      } else {
        res.status(500).send("Error signing up. Please try again later.");
      }
    } else {
      console.log("User data inserted:", newUser);
      res.status(201).send("Sign-up successful!");
    }
  });
});


app.get("/getUsers", (req, res) => {
  userModel.find({}).then(function (users) {
    res.json(users);
  }).catch(function (err) {
    console.log(err);
    res.status(500).send("Error fetching users");
  });
});

function startServer() {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}
