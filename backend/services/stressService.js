function detectStress(
 analytics
){

 const stresses = [];

 if(
  analytics.ndwi < 0.2
 ){

  stresses.push(
   "Water Stress"
  );

 }

 if(
  analytics.msi > 1.2
 ){

  stresses.push(
   "Moisture Stress"
  );

 }

 if(
  analytics.ndre < 0.3 &&
  analytics.gci < 1
 ){

  stresses.push(
   "Possible Nitrogen Stress"
  );

 }

 if(
  analytics.ndvi < 0.4
 ){

  stresses.push(
   "Vegetation Stress"
  );

 }

 if(
  stresses.length === 0
 ){

  stresses.push(
   "No Major Stress Detected"
  );

 }

 return stresses;

}

module.exports = {
 detectStress
};