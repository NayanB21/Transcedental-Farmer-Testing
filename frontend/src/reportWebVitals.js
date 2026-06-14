const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {   //onPerfEntry is mail/data carrier fn to cansole/log
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      //measurement parameters
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
