export default function polygonToGeoJson(
  polygon
){

  const coordinates =
    polygon.map(point => [  //The arr.map() method in JavaScript loops through
                            //every element in an array, transforms it using a function you provide, and returns a brand-new array
      point.lng,
      point.lat

    ]);

  coordinates.push(  //to complete the linear ring
    coordinates[0] 
  );

  return {

    type:"Polygon",

    coordinates:[
      coordinates
    ]

  };

}