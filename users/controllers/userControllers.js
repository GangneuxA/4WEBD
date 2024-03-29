const { User } = require("../models/userModel");
const ObjectID = require("mongoose").Types.ObjectId;

exports.index = async (req, res) => {
  const perPage = parseInt(req.query.perPage) || 10; // Nombre de résultats par page
  const page = parseInt(req.query.page) || 1; // Numéro de la page

  try {
    const totalCount = await User.countDocuments();
    const totalPages = Math.ceil(totalCount / perPage);

    const users = await User.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).send({
      status: "Success",
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      users: users,
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "An error occurred while fetching users",
      error: error.message,
    });
  }
};

exports.searchById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({
        status: "Error",
        message: `No user found with id: ${id}`,
      });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: `An error occurred while searching for user with id: ${id}`,
      error: error.message,
    });
  }
};

exports.insert = async (req, res) => {
  try {
    const { email, firstname, lastname, password } = req.body;
    const user = new User({ email, firstname, lastname, password });
    user.save();

    res.status(201).send(user);
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "An error occurred while inserting new user",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const { email, firstname, lastname, password } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { email, firstname, lastname, password },
      { new: true, omitUndefined: true }
    );
    if (!updatedUser) {
      return res.status(404).send({
        status: "Error",
        message: `No user found with id: ${id}`,
      });
    }
    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: `An error occurred while updating user with id: ${id}`,
      error: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(400).send({
      status: "Error",
      message: `Invalid ID: ${id}`,
    });
  }
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).send({
        status: "Error",
        message: `No user found with id: ${id}`,
      });
    }
    res.status(200).send(deletedUser);
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: `An error occurred while deleting user with id: ${id}`,
      error: error.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    await User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      user.comparePassword(req.body.password).then((valid) => {
        if (!valid) {
          return res.status(401).json({ error: "Mot de passe incorrect !" });
        }
        res.status(200).json({
          user: user,
          check: true,
        });
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: `An error occurred while login`,
      error: error.message,
    });
  }
};

exports.checkpassword = async (req, res) => {
  try {
    await User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      user.comparePassword(req.body.password).then((valid) => {
        if (!valid) {
          return res.status(401).json({ error: "Mot de passe incorrect !" });
        }
        res.status(200).json({
          userId: user._id,
          check: true,
        });
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: `An error occurred while login`,
      error: error.message,
    });
  }
};
