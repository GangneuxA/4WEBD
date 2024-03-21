const ObjectID = require("mongoose").Types.ObjectId;
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");

const URLUSER = process.env.URLUSER;

exports.index = async (req, res) => {
  // check if user has "admin" role, else send 403
  if (req.auth.user.role !== "admin") {
    return res.status(403).send({
      status: "Error",
      message: "Permission denied. You must be an administrator.",
    });
  }

  try {
    const response = await fetch(
      `${URLUSER}`, //+
      // new URLSearchParams({
      //   perPage: parseInt(req.query.perPage) || 10,
      //   page: parseInt(req.query.page) || 1,
      // })
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );
    const data = await response.json();

    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "An error occurred while fetching users",
      error: error.message,
    });
  }
};

exports.insert = async (req, res) => {
  try {
    const { email, firstname, lastname, password } = req.body;
    const userData = {
      email: email,
      firstname: firstname,
      lastname: lastname,
      password: password,
    };

    const response = await fetch(URLUSER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Data:", data);
      res.status(201).send({
        status: "Success",
        data: data,
      });
    } else {
      throw new Error("Failed to add user");
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send({
      status: "Error",
      message: "An error occurred while inserting new user",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.auth.user._id;
  if (!ObjectID.isValid(id)) {
    return res.status(400).send({
      status: "Error",
      message: `Invalid ID: ${id}`,
    });
  }

  try {
    const { email, firstname, lastname, password } = req.body;

    const userData = {
      email: email,
      firstname: firstname,
      lastname: lastname,
      password: password,
    };

    const response = await fetch(`${URLUSER}${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const updatedUser = await response.json();
      console.log("Data:", updatedUser);
      res.status(200).send({
        status: "Success",
        data: updatedUser,
      });
    } else if (response.status === 404) {
      res.status(404).send({
        status: "Error",
        message: `No user found with id: ${id}`,
      });
    } else {
      throw new Error("Failed to update user");
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send({
      status: "Error",
      message: `An error occurred while updating user with id: ${id}`,
      error: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  const id = req.auth.user._id;
  if (!ObjectID.isValid(id)) {
    return res.status(400).send({
      status: "Error",
      message: `Invalid ID: ${id}`,
    });
  }

  try {
    const response = await fetch(`${URLUSER}${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const deletedUser = await response.json();
      console.log("Data:", deletedUser);
      res.status(200).send({
        status: "Success",
        data: deletedUser,
      });
    } else if (response.status === 404) {
      res.status(404).send({
        status: "Error",
        message: `No user found with id: ${id}`,
      });
    } else {
      throw new Error("Failed to delete user");
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send({
      status: "Error",
      message: `An error occurred while deleting user with id: ${id}`,
      error: error.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userData = {
      email: email,
      password: password,
    };
    console.log(`${URLUSER}check`);
    const response = await fetch(`${URLUSER}check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.check) {
        res.status(200).json({
          user: result.user,
          token: jwt.sign({ user: result.user }, process.env.SECRET, {
            expiresIn: "24h",
          }),
        });
      } else {
        res.status(401).json({ error: "Mot de passe incorrect !" });
      }
    } else if (response.status === 401) {
      res.status(401).json({ error: "Utilisateur non trouvé !" });
    } else {
      throw new Error("Failed to authenticate user");
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send({
      status: "Error",
      message: "An error occurred while login",
      error: error.message,
    });
  }
};
