const express =
require("express");

const Chat =
require(
 "../models/Chat"
);

const {
 askAgronomist
}
=
require(
 "../services/geminiService"
);

const router =
express.Router();

router.post(
 "/",
 async(req,res)=>{

  try{
    await Chat.create({

        farmId:
        req.body.farmId,

        role:"user",

        message:
        req.body.question

    });

    console.log(
 "Question saved"
);

    const answer =
    await askAgronomist(
        req.body
    );

    console.log(
 "Assistant answer saved"
);

    await Chat.create({

        farmId:
        req.body.farmId,

        role:"assistant",

        message:
        answer

    });

    console.log(
 "Assistant answer saved"
);

   res.json({

    answer

   });

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