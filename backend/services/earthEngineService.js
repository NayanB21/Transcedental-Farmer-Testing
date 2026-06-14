const ee = require("@google/earthengine");
const privateKey =
  require("../config/gee-key.json");

async function initializeEE() {

  return new Promise((resolve, reject) => {

    ee.data.authenticateViaPrivateKey(

      privateKey,

      () => {

        ee.initialize(

          null,

          null,

          () => {

            console.log(
              "Earth Engine Initialized"
            );

            resolve();

          },

          reject

        );

      },

      reject

    );

  });

}

module.exports = {
  initializeEE,
  ee
};