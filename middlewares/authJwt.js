const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
  try {
    const token = req.session.token;

    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        console.error("Error decoding token:", err);
        return res.status(401).send({ message: "Unauthorized!" });
      }
    
      // Store user ID and username in req
      req.userId = decoded.id; // User ID
      req.username = decoded.username; // Username
      next();
    });
  } catch (error) {
    console.error("Error in verifyToken middleware:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).exec();
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const adminRole = await Role.findOne({ name: "admin" }).exec();
    if (!adminRole) {
      return res.status(500).send({ message: "Admin role not found" });
    }

    if (user.roles.includes(adminRole._id)) {
      next();
    } else {
      return res.status(403).send({ message: "Require Admin Role!" });
    }
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
// Custom middleware to check if the user is an admin or moderator
// Modify the route to allow both admins and moderators

const isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};

const hasAdminOrModeratorRole = (req, res, next) => {
  // Use the verifyToken middleware to decode the token and set user information
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if ((roles[i].name === "moderator" ||roles[i].name === "admin")) {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};

module.exports = {
  verifyToken,
  isAdmin,
  isModerator,
  hasAdminOrModeratorRole
};
