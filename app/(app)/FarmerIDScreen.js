import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useIPAddress } from './IPAddressContext';

const FarmerIDScreen = ({ navigation }) => {
  const { ipAddress } = useIPAddress();
  const [farmerID, setFarmerID] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!farmerID) {
      setError('Farmer ID is required');
    } else {
      setError('');
      // Navigate to the next screen with farmerID
      navigation.navigate('ImageCapture', { farmerID, ipAddress });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>IP Address: {ipAddress}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Farmer ID"
        onChangeText={setFarmerID}
        value={farmerID}
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
