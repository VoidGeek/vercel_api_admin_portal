const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const mongoose = require("mongoose");

const app = express();

const corsOptions = {
  origin: "https://demo-test-peach.vercel.app", // Replace with your frontend URL
  credentials: true, // Enable sending cookies with the request
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: ["your_cookie_secret_key"], // Replace with your actual secret key
    httpOnly: true,
    secure: true, // Only send cookies over HTTPS
  }));

// Set up the MongoDB connection
mongoose
  .connect("mongodb+srv://pradyumnap6969:4cgMcwdSO2JeO0kI@test.fu9uije.mongodb.net/KKK", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit(1); // Exit the process with an error code
  });

app.get("/", (req, res) => {
  try {
    res.json({ message: "Welcome to bezkoder application." });
  } catch (error) {
    console.error("Error handling the / route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Import the contact and project routers
const contactRouter = require("./routes/contact.routes");
const projectRouter = require("./routes/project.routes");
const postRoutes = require("./routes/postRoutes");
const serviceRouter = require("./routes/service.routes");
const testimonialRouter = require("./routes/testimonial.routes");
const imageRoutes = require('./routes/imageRoutes');
const resetRouter = require('./routes/reset.routes');

app.use("/", contactRouter); // Mount the contact router on the /api/contacts route
app.use("/", projectRouter); // Mount the project router on the /api/projects route

app.use("/", serviceRouter);
app.use("/", testimonialRouter);
app.use('/', postRoutes);
app.use('/api', imageRoutes);
app.use('/api', resetRouter);

// Import the authentication and user routes (replace with actual paths)
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

const PORT = process.env.PORT || 8080; // Use environment variable for port or default to 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Set up the initial roles
function initial() {
  const Role = require("./models/role.model");

  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });
    }
  });
}
