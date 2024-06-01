import { User } from "../model/user.model.js";

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) {
      return res.status(400).send("Name is required");
    }
    if (!email) {
      return res.status(400).send("Email is required");
    }
    if (!password) {
      return res.status(400).send("Password is required");
    }

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(409).send("User already exists");
    }

    const newUser = await User.create({
      name,
      email,
      password,
    });

    res.status(201).send("Successfully Created");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const loginUser = async (req, res) => {

  try {
    const { email, password } = req.body;

    if (!password) {
      return res.status(401).send("password is requires");
    }
    if (!email) {
      return res.status(401).send("name is requires");
    }
    const user = await User.findOne({ email : email });
    if (!user) {
      return res.status(401).send("User dose't exist");
    }
    const validatePassword = await user.isPasswordCorrect(password);
    if (!validatePassword) {
      return res.status(401).send("Password Incorrect");
    }
    const token = await user.generateAccesstoken(user._id);
    if (!token) {
      return res.status(500).send("Token generation failed");
    }
    user.accesstoken = token;
    user.save({ validateBeforeSave: false });
    res.status(200).send("ok");
  } catch (error) {
    res.status(500).send("Internal Server Error while login try again" );
  }

};



const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).send("Unauthorized Credentials");
    }
    user.accesstoken = "";
    await user.save({ validateBeforeSave: false });
    res.status(200).send("Logout successful");
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).send("Internal Server Error");
  }
};


export { createUser, loginUser, logoutUser };
