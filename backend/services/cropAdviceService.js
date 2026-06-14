function getCropAdvice(
 crop,
 stresses
){

 const advice = [];

 crop =
 crop?.toLowerCase();

 if(
  crop === "paddy" ||
  crop === "rice"
 ){

  if(
   stresses.includes(
    "Water Stress"
   )
  ){

   advice.push(
    "Maintain 2-5 cm standing water in field."
   );

  }

  if(
   stresses.includes(
    "Possible Nitrogen Stress"
   )
  ){

   advice.push(
    "Consider urea top dressing after field inspection."
   );

  }

 }

 else if(
  crop === "potato"
 ){

  if(
   stresses.includes(
    "Water Stress"
   )
  ){

   advice.push(
    "Provide irrigation within 48 hours."
   );

  }

  if(
   stresses.includes(
    "Possible Nitrogen Stress"
   )
  ){

   advice.push(
    "Monitor leaf yellowing and nitrogen levels."
   );

  }

 }

 else if(
  crop === "maize"
 ){

  if(
   stresses.includes(
    "Possible Nitrogen Stress"
   )
  ){

   advice.push(
    "Nitrogen top dressing may be required."
   );

  }

 }

 if(
  advice.length === 0
 ){

  advice.push(
   "Continue current farm management practices."
  );

 }

 return advice;

}

module.exports = {
 getCropAdvice
};