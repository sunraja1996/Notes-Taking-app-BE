var express = require('express');
const {mongoose} = require('mongoose');
const {dbUrl} = require('../config/dbConfig');
const {noteModel} = require('../config/auth')
const {hashPassword, hashCompare, createToken, decodeToken, validate} = require('../config/auth')

var router = express.Router();

mongoose.connect(dbUrl,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));


router.post('/create', validate, async(req, res, next)=>{
    try {
      let newnote = await noteModel.create({
        ...req.body,
        owner: req.body.user._id
      })      
      res.send({
        statusCode:200,
        message:"Note Created Successfully"
      })
    } catch (error) {
      console.log('error');
      res.send({statusCode:500, message:"Internal server Error"})
    }
})


router.get('/all', async(req, res)=>{
  try {
   let notes = await noteModel.find();
   res.send({statusCode:200, notes, message:"All Notes fetched Successfull"})

  } catch (error) {
    console.log('error');
    res.send({statusCode:500, message:"Internal server Error"})
  }
}) 


router.post('/note/:id', async(req, res)=>{
  try {
    let note = await userModel.findById({_id:req.params.id})
    if(note){
      res.send({
        statusCode:200,
        message:`Note ${_id}`
      })
    }
    else 
    res.send({statusCode:400, message:"Note Not Found"})
   
  } catch (error) {
    console.log('error');
    res.send({statusCode:500, message:"Internal server Error"})
  }
})


router.delete('/deletenote/:id', async (req, res) => {
  try {
    const deletednote = await noteModel.findOneAndDelete({_id:req.params.id});

    if (!deletednote) {
      res.send({statusCode:400, message:"No Notes to Delete"})
    } else
    res.send({
      statusCode: 200,
      message: `Note ${req.params.id} Deleted Successfully`
    });
    
    

  } catch (error) {
    console.log('error');
    res.send({statusCode:500, message:"Internal server Error"})
  }
});


module.exports = router;
