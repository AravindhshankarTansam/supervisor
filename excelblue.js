import { BluetoothSerialPort } from 'bluetooth-serial-port';
import { createInterface } from 'readline';

let buttonTriggered = 0; // Counter to track the number of times the button is triggered

// Function to handle button trigger event
function onButtonTrigger() {
    buttonTriggered++;
    console.log(`Button triggered ${buttonTriggered} time(s)`);
}



// List nearby Bluetooth devices
const bluetoothSerial = new BluetoothSerialPort(); // BluetoothSerialPort instance
bluetoothSerial.on('found', (address, name) => {
    // Check if the name matches HC-05
    if (name.includes('HC-05')) {
        console.log(`Found HC-05 Bluetooth device: ${name} (${address})`);
         // Connect to the HC-05 device
        bluetoothSerial.findSerialPortChannel(address, (channel) => {
            bluetoothSerial.connect(address, channel, () => {
                console.log(`Connected to HC-05 device: ${name}`);
                // Start listening for data from the HC-05 device
                bluetoothSerial.on('data', onDataReceived);
            }, () => {
                console.error(`Failed to connect to HC-05 device: ${name}`);
            });
        });
    }
});

// Event listener for the 'finished' event of the Bluetooth inquiry
bluetoothSerial.on('finished', () => {
    console.log('Scan finished.');
});

// Initiate the Bluetooth inquiry
bluetoothSerial.inquire();

// Code to listen for button trigger event
// Replace this with your actual code to listen for button events
const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Press Enter to simulate button trigger...', () => {
    onButtonTrigger();
    rl.close();
});
