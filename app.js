const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const { writeFileSync, readFileSync } = require("fs");

async function createPDF() {
    const document = await PDFDocument.load(readFileSync("routes/certi.pdf"));
  
    const courierBoldFont = await document.embedFont(StandardFonts.Courier);
    const firstPage = document.getPage(0);
  
    firstPage.moveTo(72, 570);
    firstPage.drawText(new Date().toUTCString(), {
      font: courierBoldFont,
      size: 30,
    });
  
    writeFileSync("jane-doe.pdf", await document.save());
  }
  
  createPDF().catch((err) => console.log(err));