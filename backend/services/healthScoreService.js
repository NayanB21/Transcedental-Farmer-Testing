function calculateHealthScore(analytics){

  let score = 100;

  //ndvi
    if(
        analytics.ndvi < 0.3
        ){
        score -= 40;
        }

        else if(
        analytics.ndvi < 0.5
        ){
        score -= 20;
        }


        //ndwi

        if(
            analytics.ndwi < 0.2
            ){
            score -= 15;
        }

        //msi
        if(
            analytics.msi > 1.2
            ){
            score -= 15;
        }

        //ndre
        if(
            analytics.ndre < 0.3
            ){
            score -= 20;
        }

        //gci
        if(
            analytics.gci < 1
            ){
            score -= 10;
        }

  return Math.max(
    0,
    Math.round(score)
  );

}

module.exports = {
  calculateHealthScore
};