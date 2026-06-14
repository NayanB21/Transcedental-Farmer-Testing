const express =
require("express");

const FarmAnalytics =
require(
 "../models/FarmAnalytics"
);

const router =
express.Router();

router.post(
 "/save",

 async(req,res)=>{

  await FarmAnalytics.findOneAndUpdate(

   {
    farmId:
    req.body.farmId
   },

   {

    yieldData:
    req.body.yieldData,

    aiAnalysis:
    req.body.aiAnalysis

   }

  );

  res.json({
   success:true
  });

 }

);

module.exports =
router;