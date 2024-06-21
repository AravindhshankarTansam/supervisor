import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useIPAddress } from './IPAddressContext';

const FarmerIDScreen = ({ navigation }) => {
  const { ipAddress } = useIPAddress();
  const [farmerID, setFarmerID] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    const farmerIDRegex = /^\d{6}$/; // Regular expression for exactly six digits

    if (!farmerID) {
      setError('Farmer ID is required');
    } else if (!farmerIDRegex.test(farmerID)) {
      setError('Farmer ID must be exactly six digits');
    } else {
      setError('');
      // Navigate to the next screen with farmerID
      navigation.navigate('ImageCapture', { farmerID, ipAddress });
    }
  };

  const handleChangeText = (text) => {
    // Allow only numeric input
    if (/^\d*$/.test(text)) {
      setFarmerID(text);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>IP Address: {ipAddress}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Farmer ID"
        onChangeText={handleChangeText}
        value={farmerID}
        keyboardType="numeric" // Set keyboard type to numeric
        maxLength={6} // Limit input length to 6 characters
      />
      <Button title="Continue" onPress={handleContinue} />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default FarmerIDScreen;
