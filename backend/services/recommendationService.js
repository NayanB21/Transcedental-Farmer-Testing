function generateRecommendations(
  analytics
){

    const advice = [];

    let health =
    "Healthy";

    let risk =
    "Low";

    let score = 100;

    //ndvi
    if(
        analytics.ndvi < 0.3
        ){

        health =
        "Poor";

        risk =
        "High";

        score -= 40;

        advice.push(
        "Vegetation growth is very low."
        );

        }
        else if(
        analytics.ndvi < 0.5
        ){

        health =
        "Moderate";

        risk =
        "Medium";

        score -= 20;

        advice.push(
        "Crop growth is below optimal."
        );

        }


        //ndwi

        if(
            analytics.ndwi < 0.2
            ){
            score -= 15;

            advice.push(
            "Possible water stress detected."
        );

        }

        //msi
        if(
            analytics.msi > 1.2
            ){
            score -= 15;
            advice.push(
            "Moisture stress detected."
        );

        }

        //ndre
        if(
            analytics.ndre < 0.3
            ){
            score -= 20;
            advice.push(
            "Possible nitrogen deficiency."
        );

        }

        //gci
        if(
            analytics.gci < 1
            ){
            score -= 10;
            advice.push(
            "Chlorophyll level appears low."
        );

        }

        //healthy rules
        if(

            analytics.ndvi > 0.6 &&

            analytics.ndre > 0.4 &&

            analytics.ndwi > 0.2

        ){

            advice.push(
            "Crop appears healthy."
            );

        }

        score = Math.max(0,Math.min(100,score));
        
        if(score >= 80){
            health ="Excellent";
        }
        else if(score >= 60){
        health ="Good";
        }
        else if(score >= 40){
        health ="Moderate";
        }
        else{
        health ="Poor";
        }


        if(score >= 80){
            risk =
            "Low";
        }
        else if(score >= 60){
        risk =
        "Medium";
        }
        else{
        risk =
        "High";
        }


        return {

            score,

            health,

            risk,

            recommendations:
            advice

        };

}

module.exports = {
 generateRecommendations
};