import express from 'express';
import cors from 'cors';
import { on, startScanning, stopScanning } from 'bluetooth'; // assuming you have bluetooth library

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/scan', (req, res) => {
  let devices = [];
  
  // Start scanning for Bluetooth devices
  on('device', (address, name) => {
    devices.push({ address, name });
  });

  on('error', (error) => {
    console.error('Bluetooth error:', error);
    res.status(500).send('Bluetooth error');
  });

  startScanning({ allowDuplicates: true, duration: 30000 });

  // Send response when scanning is finished
  setTimeout(() => {
    stopScanning();
    res.json(devices);
  }, 30000);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
