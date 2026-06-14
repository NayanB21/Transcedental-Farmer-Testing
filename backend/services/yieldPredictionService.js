const cropYieldData = {

  potato: 100,
  paddy: 25,
  rice: 25,
  wheat: 18,
  maize: 22,
  corn: 22

};

function predictYield(

  crop,

  healthScore

){

  const avgYield =

    cropYieldData[
      crop.toLowerCase()
    ] || 20;

  const predictedYield =

    (
      avgYield *
      (healthScore+20)
    ) / 100;

  return {

    avgYield,

    predictedYield:
    Number(
      predictedYield
      .toFixed(1)
    )

  };

}

module.exports = {
  predictYield
};