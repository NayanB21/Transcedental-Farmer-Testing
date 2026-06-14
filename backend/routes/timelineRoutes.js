const express =
require("express");

const {
  getHealthTimeline
}
=
require(
 "../services/timelineService"
);

const FarmAnalytics =
require(
 "../models/FarmAnalytics"
);




const router =
express.Router();
router.post(
 "/healthScore",
 async(req,res)=>{
  try{
   const analytics =
   await FarmAnalytics.findOne({
    farmId:
    req.body.farmId
   });
   if(
    analytics?.timeline?.length
   ){
    console.log(
    "Returning Cached Timeline"
    );
  return res.json({
   points: analytics.timeline
  });
   }
   const data =
   await getHealthTimeline(
    req.body.geoJson
   );


   await FarmAnalytics.findOneAndUpdate(
    {
      farmId:
      req.body.farmId
    },
    {
      $set:{
        timeline:data
      }
    },
    {
      upsert:true
    }
    );



    res.json({
     points:data
    });
  }
  catch(err){
   res.status(500)
   .json({
    message:
    err.message
   });
  }
 }
);

module.exports =
router;