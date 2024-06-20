const express = require('express');
const bodyParser = require('body-parser');
const bluetooth = require('bluetooth-serial-port');
const cors = require('cors');
const xlsx = require('xlsx');

// Function to read default data from Excel file
function readDefaultDataFromExcel(filePath) {
  return new Promise((resolve, reject) => {
    try {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const defaultData = xlsx.utils.sheet_to_json(sheet);

      const parsedData = defaultData.map(row => ({
        MOISTURE: parseFloat(row.MOISTURE),
        Distance: parseFloat(row.Distance),
        HEIGHT: parseFloat(row.HEIGHT),
        GRADE: row.GRADE
      }));

      resolve(parsedData);
    } catch (error) {
      reject(error);
    }
  });
}

// Function to find the grade based on real-time data properties
function findRealTimeGrade(realTimeData, defaultData) {
  const grades = [];

  for (let i = 0; i < realTimeData.length; i++) {
    const realTimeObj = realTimeData[i];
    let foundGrade = "Unknown";

    for (let j = 0; j < defaultData.length; j++) {
      const defaultObj = defaultData[j];

      if (Math.abs(defaultObj.MOISTURE - realTimeObj.MOISTURE) <= 1 &&
          Math.abs(defaultObj.HEIGHT - realTimeObj.HEIGHT) <= 0.5) {
        foundGrade = defaultObj.GRADE;
        break;
      }
    }

    grades.push(foundGrade);
  }

  return grades;
}

const app = express();
app.use(bodyParser.json());
app.use(cors());

let foundDevices = [];
let latestReading = null;
let accumulatedData = '';
let defaultData = [];

const onDataReceived = (buffer) => {
  try {
    const rawData = buffer.toString().trim();
    accumulatedData += rawData;
    console.log('Received raw data:', accumulatedData);

    // Extract moisture, distance, and sack height from the accumulated data
    const moistureMatch = accumulatedData.match(/Moisture:\s*([\d.-]+)\s*/);
    const distanceMatch = accumulatedData.match(/D:\s*([\d.-]+)\s*/);
    const sackHeightMatch = accumulatedData.match(/H:\s*([\d.-]+)\s*/);

    if (moistureMatch && distanceMatch && sackHeightMatch) {
      const moisture = parseFloat(moistureMatch[1]);
      const distance = parseFloat(distanceMatch[1]);
      const sackHeight = parseFloat(sackHeightMatch[1]);

      const timestamp = new Date().toLocaleString();
      latestReading = {
        timestamp,
        MOISTURE: moisture,
        Distance: distance,
        HEIGHT: sackHeight
      };

      console.log('Updated Reading:', latestReading);

      // Reset accumulatedData after processing
      accumulatedData = '';
    } else {
      console.error('Incomplete data received:', accumulatedData);
    }
  } catch (error) {
    console.error('Error processing received data:', error);
  }
};

const bluetoothSerial = new bluetooth.BluetoothSerialPort();
bluetoothSerial.on('found', (address, name) => {
  if (name.includes('HC-05')) {
    console.log(`Found HC-05 Bluetooth device: ${name} (${address})`);
    foundDevices.push({ name, address });
    bluetoothSerial.findSerialPortChannel(address, (channel) => {
      bluetoothSerial.connect(address, channel, () => {
        console.log(`Connected to HC-05 device: ${name}`);
        bluetoothSerial.on('data', onDataReceived);
      }, () => {
        console.error(`Failed to connect to HC-05 device: ${name}`);
      });
    });
  }
});

bluetoothSerial.on('finished', () => {
  console.log('Scan finished.');
});

bluetoothSerial.on('failure', (error) => {
  console.error('Bluetooth connection error:', error);
});

bluetoothSerial.inquire();

app.get('/bluetoothDevices', (req, res) => {
  res.json(foundDevices);
});

app.get('/bluetoothData', (req, res) => {
  console.log('Received request for /bluetoothData');
  if (latestReading) {
    const realTimeData = [latestReading];
    const grades = findRealTimeGrade(realTimeData, defaultData);
    res.json({
      ...latestReading,
      GRADE: grades[0]
    });
  } else {
    console.log('No data available to send');
    res.status(404).json({ error: 'No data available' });
  }
});

const PORT = 3004;

readDefaultDataFromExcel('C:/Users/Tansam/OneDrive/Desktop/tea.xlsx')
  .then((data) => {
    defaultData = data;
    console.log('Default data loaded:', defaultData);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log('Initial latestReading:', latestReading);
    });
  })
  .catch((error) => {
    console.error('Error loading default data:', error);
  });
