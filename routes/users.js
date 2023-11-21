var express = require('express');
const {mongoose} = require('mongoose');
const {dbUrl} = require('../config/dbConfig');
const {userModel} = require ('../schema/userSchema');
const {hashPassword, hashCompare, createToken, decodeToken, validate} = require('../config/auth')

var router = express.Router();

mongoose.connect(dbUrl,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));





router.get('/allusers', async(req, res)=>{
  try {
   let users = await userModel.find();
   res.send({statusCode:200, users, message:"All DATA fetched Successfull"})

  } catch (error) {
    console.log('error');
    res.send({statusCode:500, message:"Internal server Error"})
  }
}) 




router.get('/userprofile', async (req, res) => {

  try {
    const { email, firstName, lastName, role, imageUrl} = req.body;

    console.log(email, firstName, lastName, role, imageUrl);

    let user = await userModel.findOne({ email }, { password: 0 });

    if (!user) 
    {
    return res.send({statusCode:400, message:"user not Found"})
  } else {

  res.send({statusCode:200, message:"Profile fetched Successfully", user: { email, firstName, lastName, role, imageUrl: user.imageUrl }})
  }

  } catch (error) {

    res.send({statusCode:500, message:"Internal server Error"})
    
  }
})



router.post('/signup', async (req, res) => {
  try {
    let usersignup = await userModel.findOne({ email: req.body.email });

    if (!usersignup) {
      let hashedPassword = await hashPassword(req.body.password);
      req.body.password = hashedPassword;
      
      let newUser = await userModel.create(req.body);

      res.send({
        statusCode: 200,
        message: 'User Signed up Successfully',
      });
    } else {
      res.send({ statusCode: 400, message: 'User Already Exists' });
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.send({ statusCode: 500, message: 'Internal server Error' });
  }
});



router.post('/login', async (req, res) => {
  try {
    let loginuser = await userModel.findOne({ email: req.body.email });

    if (loginuser) {
      if (await hashCompare(req.body.password, loginuser.password)) {
        let token = await createToken(loginuser);
        let role = loginuser.role; 
        let firstName = loginuser.firstName;

        res.send({
          statusCode: 200,
          token,
          role,
          firstName,
          message: "Login Successful"
        });
      } else {
        res.send({ statusCode: 400, message: "Invalid Credentials" });
      }
    } else {
      res.send({ statusCode: 400, message: "User doesn't Exist" });
    }

  } catch (error) {
    console.error(error); // Log the actual error for debugging
    res.send({ statusCode: 500, message: "Internal Server Error" });
  }
});



router.delete('/deleteuser/:email', validate, async (req, res) => {
  try {
    const deletedUser = await userModel.findOneAndDelete({ email: req.params.email });

    if (!deletedUser) {
      res.send({statusCode:400, message:"User doesn't Exists"})
    } else
    res.send({statusCode:200, user: deletedUser, message: "User deleted successfully"})

  } catch (error) {
    console.log('error');
    res.send({statusCode:500, message:"Internal server Error"})
  }
});


router.put('/updateuser/:email', async (req, res) => {
  try {

    const updatedUser = await userModel.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true } 
    );

    console.log(updatedUser);
    
    if (!updatedUser) {
      res.send({ statusCode: 404, message: "User not found" });
    }

    res.send({
      statusCode: 200,
      user: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.send({ statusCode: 500, message: "Internal server error" });
  }
});





module.exports = router;
