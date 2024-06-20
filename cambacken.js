const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3007;

app.use(bodyParser.json());
app.use(cors()); // Adjust CORS settings as per your environment

// Function to fetch image from ESP32
async function fetchImageFromESP32(ip) {
  try {
    console.log(`Attempting to fetch image from ESP32 at IP: ${ip}`);
    const response = await axios.get(`http://${ip}`, { responseType: 'arraybuffer' });
    if (response.status === 200) {
      console.log('Image captured successfully from ESP32');
      return Buffer.from(response.data, 'binary').toString('base64');
    } else {
      const errorMessage = `Failed to capture image from ESP32 - Status code: ${response.status}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessage = `Error capturing image from ESP32: ${error.message}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}

// Endpoint to capture image and save details
app.post('/capture-image', async (req, res) => {
  const { ip, date, time } = req.body;

  if (!ip) {
    const errorMessage = 'IP address is required';
    console.error(errorMessage);
    return res.status(400).send(errorMessage);
  }

  if (!date || !time) {
    const errorMessage = 'Date and time are required';
    console.error(errorMessage);
    return res.status(400).send(errorMessage);
  }

  try {
    const imageData = await fetchImageFromESP32(ip);

    // Log the details being saved
    console.log(`Saving image captured on ${date} at ${time}`);

    res.json({ image: imageData, date, time });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Failed to capture image from ESP32');
  }
});

// New endpoint to check connection status to ESP32
app.post('/check-connection', async (req, res) => {
  const { ip } = req.body;

  if (!ip) {
    const errorMessage = 'IP address is required';
    console.error(errorMessage);
    return res.status(400).send(errorMessage);
  }

  try {
    // Perform a simple check or ping to the ESP32 device
    const response = await axios.get(`http://${ip}`);
    if (response.status === 200) {
      console.log(`Successfully connected to ESP32 at ${ip}`);
      res.json({ message: 'Connection successful' });
    } else {
      console.error(`Failed to connect to ESP32 at ${ip}`);
      res.status(500).json({ error: 'Connection failed' });
    }
  } catch (error) {
    console.error(`Error connecting to ESP32 at ${ip}: ${error.message}`);
    res.status(500).json({ error: 'Connection failed' });
  }
});
app.post('/save-data', (req, res) => {
  // Handle POST request to save data
  // Example: Save data to database
  res.status(200).json({ message: 'Data saved successfully.' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
