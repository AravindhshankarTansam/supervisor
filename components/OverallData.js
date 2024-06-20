import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const OverallData = ({ route }) => {
  const { latestBluetoothData } = route.params;

  // Extract data from latestBluetoothData
  const { farmerID, imageUri } = latestBluetoothData;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Overall Data</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.farmerIdContainer}>
          <Text style={styles.label}>Farmer ID:</Text>
          <Text style={styles.value}>{farmerID}</Text>
        </View>

        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.noImageText}>No image available</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  farmerIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  value: {
    fontSize: 18,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  noImageText: {
    fontSize: 16,
    color: '#555',
  },
});

export default OverallData;
