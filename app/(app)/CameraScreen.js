import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useIPAddress } from './IPAddressContext';

const CameraScreen = ({ navigation }) => {
  const { setIpAddress } = useIPAddress();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    if (!input) {
      setError('IP address is required');
    } else if (!ipRegex.test(input)) {
      setError('Invalid IP address format');
    } else {
      setError('');
      setIpAddress(input);
      navigation.navigate('FarmerID');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter ESP32 IP Address"
        onChangeText={setInput}
        value={input}
      />
      <Button title="Connect" onPress={handleContinue} />
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

export default CameraScreen;
