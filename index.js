const { convertPDFtoIMG } = require("pdfiy");
const express = require("express");
const app = express();
const port = process.env.PORT
app.get('/', (req, res) => {
    res.send('Hello, World!');
  });
  
  app.get('/img', async (req, res) => {
    //console.log(12)
    try {
      const conv = await convertPDFtoIMG({
        pge: parseInt(req.query.page),
        pdfPath: req.query.book,
        imagePath: 'my-image', // or 'my-image.png'
        scale: 5, 
        // png: true, optional - default value true (if false will convert to Jpeg)
      })
        const imageResposne = Buffer.from(conv.base64Image, 'base64');
        res.writeHead(200, {
                  'Content-Type': 'image/png',
                  'Content-Length': imageResposne.length
              });
              res.end(imageResposne);
        //res.json(conv)
    } catch (error) {
      console.error('Error during conversion:', error)
    }
  });
  
  app.listen(port || 3000, () => {
    console.log(`App listening on port ${port}`)
  })