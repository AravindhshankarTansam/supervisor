const bluetoothSerialPort = require('bluetooth-serial-port');
const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer();
const io = socketIO(server);

const btSerial = new bluetoothSerialPort.BluetoothSerialPort();

// Replace with the MAC address of your HC-05 module
// const hc05Address = '98:D3:71:FE:7D:CC';
// const channel = 1; // HC-05 typically uses channel 1

btSerial.on('found', (address, name) => {
    console.log(`Found device: ${name} with address: ${address}`);
    if (address === hc05Address) {
        btSerial.findSerialPortChannel(address, (channel) => {
            console.log(`Found serial port channel: ${channel}`);
            btSerial.connect(address, channel, () => {
                console.log('Connected to HC-05');

                btSerial.on('data', (buffer) => {
                    console.log('Received data:', buffer.toString('utf-8')); // Log received data for debugging
                    const data = buffer.toString('utf-8').split(',');
                    if (data.length === 3) {
                        const moisture = parseFloat(data[0]);
                        const distance = parseFloat(data[1]);
                        const sackHeight = parseFloat(data[2]);

                        io.emit('data', { moisture, distance, sackHeight });
                    } else {
                        console.error('Invalid data received:', data);
                    }
                });
            }, () => {
                console.error('Connection failed');
            });
        }, (err) => {
            console.error('Unable to find serial port channel:', err);
        });
    }
});

btSerial.inquire();

const PORT = 3001;

server.listen(PORT, () => {
    console.log(`Node.js server listening on port ${PORT}`);
});
