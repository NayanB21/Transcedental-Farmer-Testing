const express =
require("express");

const PDFDocument =
require("pdfkit");

const router =
express.Router();

router.post(
 "/farm-report",

 (req,res)=>{

  const doc =
  new PDFDocument();

  res.setHeader(
   "Content-Type",
   "application/pdf"
  );

  res.setHeader(
   "Content-Disposition",
   "attachment; filename=farm-report.pdf"
  );

  doc.pipe(res);

  doc.fontSize(22);

  doc.text(
   "Farm Health Report"
  );

  doc.moveDown();

  doc.fontSize(14);

  doc.text(
   `Crop: ${req.body.crop}`
  );

  doc.text(
   `Village: ${req.body.village}`
  );

  doc.text(
   `Health Score: ${req.body.healthScore}/100`
  );

  doc.text(
   `Expected Yield: ${req.body.predictedYield} Quintal/Acre`
  );

  doc.moveDown();

  doc.text(
   "AI Analysis:"
  );

  doc.moveDown();

  const cleanAnalysis =

    req.body.analysis

    .replace(
    /🌾/g,
    ""
    )

    .replace(
    /✅/g,
    ""
    )

    .replace(
    /⚠️/g,
    ""
    )

    .replace(
    /📈/g,
    ""
    );

    doc.text(
    cleanAnalysis
    );


    
  doc.end();

 }

);

module.exports =
router;