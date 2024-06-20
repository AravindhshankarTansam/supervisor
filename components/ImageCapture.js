import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, TextInput } from 'react-native';
import axios from 'axios';

const ImageCapture = ({ route, navigation }) => {
  const { ipAddress: initialIpAddress, farmerID } = route.params;
  const [ipAddress, setIpAddress] = useState(initialIpAddress);
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState(null);

  const captureImage = async () => {
    try {
      if (!ipAddress) {
        console.error('IP address is required');
        return;
      }

      const response = await axios.post(`http://192.168.1.220:3007/capture-image`, {
        ip: ipAddress,
        farmerID: farmerID,
        date: getCurrentDate(),
        time: getCurrentTime(),
      });

      console.log('Image captured:', response.data);
      setImageData(response.data.image); // Assuming response.data.image contains image data or URI
      setError(null);
    } catch (error) {
      console.error('Failed to capture image:', error.message);
      setError('Failed to capture image. Please check the IP address and try again.');
    }
  };

  const retakeImage = () => {
    // Clear the imageData state to allow capturing a new image
    setImageData(null);
  };

  const getCurrentDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  };

  const handleNavigateToBluetoothData = () => {
    navigation.navigate('BluetoothDataReading', { farmerID, imageUri: imageData });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {imageData ? (
          <Image source={{ uri: `data:image/jpeg;base64,${imageData}` }} style={styles.image} />
        ) : (
          <Text style={styles.noImageText}>No image captured yet</Text>
        )}
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter IP address"
            value={ipAddress}
            onChangeText={setIpAddress}
          />
          <Button title="Retry Capture" onPress={captureImage} />
        </View>
      )}
      {!error && (
        <View style={styles.buttonContainer}>
          {!imageData && <Button title="Capture Image" onPress={captureImage} />}
          {imageData && (
            <View style={styles.buttonRow}>
              <Button title="Retake Image" onPress={retakeImage} />
              <Button title="View Bluetooth Data" onPress={handleNavigateToBluetoothData} />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  noImageText: {
    fontSize: 18,
    color: '#888',
  },
  buttonContainer: {
    marginBottom: 30,
    justifyContent: 'flex-end',
    width: '100%',
    paddingHorizontal: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default ImageCapture;
