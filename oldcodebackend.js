const bluetooth = require('bluetooth-serial-port');
const readline = require('readline');
const express = require('express');

let buttonTriggered = 0;

function onDataReceived(buffer) {
    const dataString = buffer.toString();
    const entries = dataString.split(/\r?\n/).filter(entry => entry.trim().length > 0);
    const timestamp = new Date().toLocaleString();
    entries.forEach(entry => {
        const lines = entry.split('\n').filter(line => line.trim().length > 0);
        const values = {};
        lines.forEach(line => {
            const parts = line.split(':').map(value => value.trim());
            if (parts.length === 2) {
                values[parts[0].toLowerCase()] = parts[1];
            }
        });
        if (values['moisture'] && values['distance'] && values['sack height']) {
            const moisture = values['moisture'].replace('%', '');
            const distance = values['distance'].replace('cm', '');
            const sackHeight = values['sack height'].replace('cm', '');
            console.log(`Timesnap: ${timestamp}, Moisture: ${moisture}, Distance: ${distance}, Sack Height: ${sackHeight}`);
        } else {
            console.log(`${entry}`);
        }
    });
}

function onButtonTrigger() {
    buttonTriggered++;
    console.log(`Button triggered ${buttonTriggered} time(s)`);
}

const bluetoothSerial = new bluetooth.BluetoothSerialPort();
bluetoothSerial.on('found', (address, name) => {
    if (name.includes('HC-05')) {
        console.log(`Found HC-05 Bluetooth device: ${name} (${address})`);
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

bluetoothSerial.inquire();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Press Enter to simulate button trigger...', () => {
    onButtonTrigger();
    rl.close();
});
