const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  try {
    const { username, email, password,phoneNo,fullName, roles, images } = req.body;
    
    if (!username || !email || !password || !phoneNo || !fullName) {
      return res.status(400).send({ message: "All fields are required for signup." });
    }

    const user = new User({
      username,
      email,
      password: bcrypt.hashSync(password, 8),
      phoneNo,
      fullName,
      images,
    });

    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (roles) {
        Role.find(
          {
            name: { $in: roles },
          },
          (err, roles) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            user.roles = roles.map((role) => role._id);
            user.save((err) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }

              res.send({ message: "User was registered successfully!" });
            });
          }
        );
      } else {
        Role.findOne({ name: "user" }, (err, role) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = [role._id];
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        });
      }
    });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).send({ message: "An error occurred during signup." });
  }
};

exports.signin = (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({ message: "Username and password are required for signin." });
    }

    User.findOne({
      username,
    })
      .populate("roles", "-__v")
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
          return res.status(401).send({ message: "Invalid Password!" });
        }

        const token = jwt.sign({ id: user.id, username: user.username,},
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: 86400, // 24 hours
                              });

        var authorities = [];

        for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }

        req.session.token = token;

        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          roles: authorities,
          phoneNo:user.phoneNo,
          fullName:user.fullName,
          createdAt:user.createdAt,
        });
      });
  } catch (error) {
    console.error("Error in signin:", error);
    return res.status(500).send({ message: "An error occurred during signin." });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    console.error("Error in signout:", err);
    return res.status(500).send({ message: "An error occurred during signout." });
  }
};
