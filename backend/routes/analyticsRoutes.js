const express =
require("express");

const {
 getAnalytics
}
=
require(
 "../services/analyticsService"
);

const {
 detectStress
}
=
require(
 "../services/stressService"
);


const {
 generateRecommendations
}
=
require(
 "../services/recommendationService"
);

const {
 getCropAdvice
}
=
require(
 "../services/cropAdviceService"
);


const FarmAnalytics =
require(
 "../models/FarmAnalytics"
);

const {
 predictYield
}
=
require(
 "../services/yieldPredictionService"
);


const {
 askAgronomist
}
=
require(
 "../services/geminiService"
);

const {
 getHealthTimeline
}
=
require(
 "../services/timelineService"
);

const router =
express.Router();

router.post(
 "/farm",
 async(req,res)=>{

  try{

    const existing =
      await FarmAnalytics.findOne({
        farmId:
        req.body.farmId
      });


    if(existing){
      const ageHours =
      (
        Date.now()
        -
        new Date(existing.updatedAt))/(1000 * 60 * 60);
      if(ageHours < 72){
        const timeline =
          existing.timeline?.length
          ? existing.timeline
          : await getHealthTimeline(
            req.body.geoJson
          );

        if(!existing.timeline?.length){
          await FarmAnalytics.findOneAndUpdate(
            {
              farmId:
              req.body.farmId
            },
            {
              $set:{
                timeline
              }
            }
          );
        }

        console.log(
          "Returning Cached Analytics"
        );
        return res.json({

          analytics:
          existing.analytics,

          stresses:
          existing.stresses,

          recommendations:
          existing.recommendations,

          cropAdvice:
          existing.cropAdvice,

          yieldData:
          existing.yieldData,

          aiAnalysis:
          existing.aiAnalysis,

          timeline

        });


      }
    }

          const data =
    await getAnalytics(
      req.body.geoJson
    );

    const recommendations =
      generateRecommendations(
      data.analytics
      );
    
    const stresses =
      detectStress(
      data.analytics
      );

    const cropAdvice =
      getCropAdvice(
      req.body.crop,
      stresses
      );


    const healthScore =recommendations.score;

      

      const yieldData =

      predictYield(

      req.body.crop,

      healthScore

      );

      const aiAnalysis =
        await askAgronomist({

        question:
        `
        Crop:
        ${req.body.crop}

        Health Score:
        ${healthScore}/100

        Expected Yield:
        ${yieldData.predictedYield}
        Quintal/Acre

        Explain:

        1. Current crop condition
        2. Yield outlook
        3. Main concerns
        4. Recommended actions

        Return plain text.

        Do NOT use:

        emojis,
        markdown,
        special symbols,
        bullet icons.

        Use only normal English text.

        Keep answer simple.

        Use farmer-friendly language.

        `
        });

    const timeline =
      await getHealthTimeline(
      req.body.geoJson
      );

  
    await FarmAnalytics.findOneAndUpdate(
      {
        farmId:
        req.body.farmId
      },
      {
        farmId:
        req.body.farmId,
        analytics: data.analytics,
        imageDate:data.imageDate,
        stresses,
        recommendations,
        cropAdvice,
        yieldData,
         aiAnalysis,
         timeline
      },
      {
        upsert:true,
        returnDocument:"after"
      }
    );
  

   return res.json({

    analytics:
  data.analytics,

    stresses,

    recommendations,

    cropAdvice,

    yieldData,

      aiAnalysis,

      timeline

  });


  }
  catch(err){

   res.status(500)
   .json({
     message:err.message
   });

  }

 });

module.exports =
router;