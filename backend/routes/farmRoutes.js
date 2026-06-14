const express = require("express");
const Farm = require("../models/Farm");

const router = express.Router();

const auth =
require(
 "../middleware/authMiddleware"
);

router.post("/",auth, async (req,res)=>{

  try{

    const farm =
      await Farm.create({
      ...req.body,
      userId:
      req.user.id
      });

    res.status(201).json(farm);

  }catch(err){

    res.status(500).json({
      message: err.message
    });

  }

});


router.get("/", async (req, res) => {

  try {

    const farms =
      await Farm.find()
      .sort({ createdAt: -1 });

    res.json(farms);

  }
  catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});


router.get("/user/:userId", async (req, res) => {

  try {

    const farms =
      await Farm.find({
        userId: req.params.userId
      })
      .sort({ createdAt: -1 });

    res.json(farms);

  }
  catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});

module.exports = router;