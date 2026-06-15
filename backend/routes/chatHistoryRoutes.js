const express =
require("express");

const Chat =
require("../models/chat");

const router =
express.Router();

router.get(
 "/:farmId",

 async(req,res)=>{

  try{

   const chats =
   await Chat.find({

    farmId:
    req.params.farmId

   })
   .sort({
    createdAt:1
   });

   res.json(chats);

  }
  catch(err){

   res.status(500)
   .json({

    message:
    err.message

   });

  }

 });


 router.post(
 "/",

 async(req,res)=>{

  try{

   const chat =
   await Chat.create(
    req.body
   );

   res.json(chat);

  }
  catch(err){

   res.status(500)
   .json({

    message:
    err.message

   });

  }

 });


 module.exports =
router;