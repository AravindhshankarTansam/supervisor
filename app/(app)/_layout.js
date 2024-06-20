import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform, Button } from 'react-native';
import Home from './home';
import BluetoothList from '../../components/BluetoothList';
import BluetoothDataReading from '../../components/BluetoothDataReading';
import FarmerIDScreen from './FarmerIDScreen';
import CameraScreen from './CameraScreen';
import { useAuth } from '../../context/authContext';
import ImageCapture from '../../components/ImageCapture';
import OverallData from '../../components/OverallData';
import { IPAddressProvider } from './IPAddressContext'; 

const Stack = createStackNavigator();

const Layout = () => {
  const { logout } = useAuth();

  return (
    <IPAddressProvider>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Supervisor Dashboard" 
          component={Home} 
          options={{
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: 'bold',
              fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif',
            },
            headerRight: () => (
              <Button
                onPress={() => logout()}
                title="Logout"
                color="red"
              />
            ),
          }}
        />
        <Stack.Screen name="BluetoothScanner" component={BluetoothList} />
        <Stack.Screen name="FarmerID" component={FarmerIDScreen} />
        <Stack.Screen name="BluetoothDataReading" component={BluetoothDataReading} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen name="ImageCapture" component={ImageCapture} />
        <Stack.Screen name="OverallData" component={OverallData} />
      </Stack.Navigator>
    </IPAddressProvider>
  );
};

export default Layout;
