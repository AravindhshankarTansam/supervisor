import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { print } from 'react-native-print';

const BluetoothDataReading = ({ route }) => {
  const { farmerID, imageUri, latestBluetoothData } = route.params || {};
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bluetoothData, setBluetoothData] = useState(null);

  useEffect(() => {
    if (latestBluetoothData) {
      setBluetoothData(latestBluetoothData);
    } else {
      fetchBluetoothData();
    }
  }, []);

  const fetchBluetoothData = () => {
    setLoading(true);
    fetch('http://192.168.1.220:3004/bluetoothData')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setBluetoothData(data);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching latest Bluetooth data:', error);
        setError(error.message);
      })
      .finally(() => setLoading(false));
  };

  const handleRefresh = () => {
    fetchBluetoothData();
  };

  const handleSaveData = () => {
    if (!bluetoothData || !imageUri) {
      Alert.alert('Error', 'Bluetooth data or image not available to save.');
      return;
    }

    // Simulate saving data to database
    saveDataToDatabase({
      farmerID,
      bluetoothData,
      imageUri,
      ipAddress: '192.168.1.220' // Assuming ipAddress is hardcoded or retrieved elsewhere
    });
  };

  const saveDataToDatabase = async (data) => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.1.220:3007/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save data.');
      }

      Alert.alert('Success', 'Data saved successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('FarmerID', { ipAddress: data.ipAddress }), // Pass ipAddress to FarmerIDScreen
        },
      ]);

    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    try {
      const content = generatePrintContent();

      const options = {
        html: content,
      };

      const response = await print(options);
      console.log('Print response:', response);
    } catch (error) {
      console.error('Error printing:', error);
      Alert.alert('Error', 'Failed to print. Please try again later.');
    }
  };

  const generatePrintContent = () => {
    let content = `
      <html>
        <head><title>Bluetooth Data Dashboard</title></head>
        <body>
          <h1>Bluetooth Data Dashboard</h1>
          <h2>Latest Bluetooth Data</h2>
          <p>Timestamp: ${bluetoothData.timestamp}</p>
          <p>Moisture: ${bluetoothData.MOISTURE}</p>
          <p>Distance: ${bluetoothData.Distance}</p>
          <p>Height: ${bluetoothData.HEIGHT}</p>
          <p>Grade: ${bluetoothData.GRADE}</p>
          <h2>Farmer ID</h2>
          <p>${farmerID}</p>
          <h2>Image</h2>
          <img src="data:image/jpeg;base64,${imageUri}" style="width: 200px; height: 200px;"/>
        </body>
      </html>
    `;

    return content;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Bluetooth Data Dashboard</Text>
      </View>
    
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <Text style={styles.buttonText}>Refresh Data</Text>
      </TouchableOpacity>
    
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loadingIndicator} />
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : bluetoothData ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Farmer ID: {farmerID}</Text>
          <View style={styles.dataContainer}>
            <Text style={styles.dataText}>Timestamp: {bluetoothData.timestamp}</Text>
            <Text style={styles.dataText}>Moisture: {bluetoothData.MOISTURE}</Text>
            <Text style={styles.dataText}>Distance: {bluetoothData.Distance}</Text>
            <Text style={styles.dataText}>Height: {bluetoothData.HEIGHT}</Text>
            <Text style={styles.dataText}>Grade: {bluetoothData.GRADE}</Text>
          </View>
          <View style={styles.imageContainer}>
            {imageUri ? (
              <Image source={{ uri: `data:image/jpeg;base64,${imageUri}` }} style={styles.image} />
            ) : (
              <Text style={styles.dataText}>No image available</Text>
            )}
          </View>
        </View>
      ) : (
        <Text style={styles.noDataText}>No data available</Text>
      )}
    
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveData}>
        <Text style={styles.buttonText}>Save Data</Text>
      </TouchableOpacity>
    
      <TouchableOpacity style={styles.printButton} onPress={handlePrint}>
        <Text style={styles.buttonText}>Print Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
  
  
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  printButton: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
  card: {
    width: '90%',
    borderRadius: 15,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
    alignItems: 'center',  // Center aligns all content horizontally
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  dataContainer: {
    alignItems: 'flex-start',
  },
  dataText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  noDataText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#999',
  },
  infoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: 'center',  // Center aligns image horizontally
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});


export default BluetoothDataReading;
