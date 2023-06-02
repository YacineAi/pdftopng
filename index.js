const { convertPDFtoIMG } = require("pdfiy");
const express = require("express");
const app = express();
const port = process.env.PORT;
const imageCache = {};

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/img', async (req, res) => {
  const requestId = generateRequestId(); // Generate a unique identifier
  const page = parseInt(req.query.page);
  const pdfPath = req.query.book;

  try {
    const conv = await convertPDFtoIMG({
      pge: page,
      pdfPath: pdfPath,
      imagePath: `my-image-${requestId}`, // Include the unique identifier in the image path
      scale: 5,
    });

    const imageResponse = Buffer.from(conv.base64Image, 'base64');
    imageCache[requestId] = imageResponse; // Cache the image data in memory

    res.redirect(`/img/${requestId}`); // Redirect to the endpoint with the unique identifier
  } catch (error) {
    console.error('Error during conversion:', error);
    res.status(500).send('Image conversion failed');
  }
});

app.get('/img/:id', (req, res) => {
  const requestId = req.params.id;
  const imageResponse = imageCache[requestId];

  if (!imageResponse) {
    res.status(404).send('Image not found');
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': imageResponse.length,
  });
  res.end(imageResponse);
});

app.listen(port || 3000, () => {
  console.log(`App listening on port ${port}`);
});

// Helper function to generate a unique identifier
function generateRequestId() {
  return Math.random().toString(36).substr(2, 9);
}
