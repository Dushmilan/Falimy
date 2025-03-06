const userHandler = require("../Model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretCode = "falimy";
const passwordSalt = 10;
 
//user login controller
const loginHandler = async (req, res) => {
    const { familycode,email, password } = req.body;
  
    try {
        const family = await userHandler.findFamily({ familycode });

      if (!family) {
        return res.status(401).json({ message: "No family found"});
      }
      const isExists = await userHandler.isExists({ email });
  
      if (!isExists) {
        return res.status(401).json({ message: "Incorrect username or password."});
      }
  
      const valid = await bcrypt.compare(password, isExists.password);
      if (!valid) {
        return res.status(401).json({ message: "Incorrect username or password."});
      }

      const token = jwt.sign(
        { 
          email: isExists.email,
          username: isExists.username
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );
      return res.status(200).send({
  
        user: {
          email: isExists.email,
          familycode: isExists.familycode,
          username: isExists.username,
        },
        token,
      });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send("internal server error");
    }

};

// new family user signup controller
const NewsignupHandler = async (req, res) => {
    const { familycode, username, email, password } = req.body;

    try {
      const isExists = await userHandler.isExists({ email });

      if (isExists) {
        return res.status(401).json({ message: "Email already exists."});
      }
      const isfamily= await userHandler.findFamily({ familycode });
      if (isfamily) {
        return res.status(401).json({ message: "Family already exists."});
      }
      const hashedPassword = await bcrypt.hash(password, passwordSalt);
      const user = await userHandler.NewsignupModel({
        familycode,
        username,
        email,
        password: hashedPassword,
      });

      const token = jwt.sign(
        { email: user.email, id: user.user_id },
        secretCode,
      );
      return res.status(200).send({
        user: {
          email: user.email,
          familycode: user.familycode,
          username: user.username,
        },
        token,
      });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send("internal server error");
    }
  };



  // Existing Family user signup controller
  const ExistingSignUpHandler = async (req, res) => {
    const { familycode, username, email, password } = req.body;

    try {
      const isExists = await userHandler.isExists({ email });

      if (isExists) {
        return res.status(401).json({ message: "Email already exists."});
      }
      const isfamily= await userHandler.findFamily({ familycode });
      if (!isfamily) {
        return res.status(401).json({ message: "Family doesn't exist."});
      }
      const hashedPassword = await bcrypt.hash(password, passwordSalt);
      const user = await userHandler.ExistSignupModel({
        familycode,
        username,
        email,
        password: hashedPassword,
      });

      const token = jwt.sign(
        { email: user.email, id: user.user_id },
        secretCode,
      );
      return res.status(200).send({
        user: {
          email: user.email,
          familycode: user.familycode,
          username: user.username,
        },
        token,
      });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send("internal server error");
    }
  };
      
module.exports = { NewsignupHandler,ExistingSignUpHandler, loginHandler };