import React from 'react';
import { SafeAreaView, StyleSheet, Button } from 'react-native';

const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Button title="Scan Bluetooth Devices" onPress={() => navigation.navigate('BluetoothScanner')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
