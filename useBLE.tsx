import { PermissionsAndroid, Platform } from "react-native";


type PermissionsCallback = (result : boolean) => void;


interface bluetoothApi {
    requestPermissions(callback: PermissionsCallback): Promise<void>;
}

export default function useBLE() : bluetoothApi {
    const requestPermissions = async (callback: PermissionsCallback) => {
        if (Platform.OS === 'android') {
            const grantedStatus = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'Bluetooth Connection Needs Location Permission',
                    buttonNegative:'Cancel',
                    buttonPositive: 'OK',
                    buttonNeutral: 'Maybe Later',
                },
            );
            callback(grantedStatus === PermissionsAndroid.RESULTS.GRANTED);
        } else {
            callback(true);
        }
    };

    return {
        requestPermissions,
    };
}