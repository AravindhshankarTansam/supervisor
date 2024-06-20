import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const BluetoothList = ({ navigation }) => {
  const [devices, setDevices] = useState([]);

  const fetchDevices = async () => {
    try {
      const response = await axios.get('http://192.168.1.220:3004/bluetoothDevices'); // Replace with your server IP and port
      setDevices(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.deviceItem}>
      <Text style={styles.deviceName}>{item.name}</Text>
      <Text style={styles.deviceAddress}>{item.address}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bluetooth Devices:</Text>
      <Button title="Refresh" onPress={fetchDevices} />
      <FlatList
        data={devices}
        keyExtractor={(item) => item.address}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <Button title="Enter IP Address" onPress={() => navigation.navigate('CameraScreen')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  list: {
    marginBottom: 20,
  },
  deviceItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceAddress: {
    fontSize: 14,
    color: '#666',
  },
});

export default BluetoothList;
