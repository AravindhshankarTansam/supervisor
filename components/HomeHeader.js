import { View, Text, Platform, TouchableOpacity } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native'; 
import { useAuth } from '../context/authContext'; 

export default function HomeHeader() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const { logout } = useAuth(); 

    const handleLogout = async () => {
        try {
            await logout(); 
            navigation.navigate('signIn'); 
        } catch (error) {
            console.error('Logout Error:', error);
        }
    };

    return (
        <View style={{ paddingTop: insets.top + 20, paddingHorizontal: wp(5), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#6D28D9', paddingBottom: hp(2), borderBottomLeftRadius: wp(10), borderBottomRightRadius: wp(10), ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, }, android: { elevation: 5 } }) }}>
            <View>
                <Text style={{ fontSize: hp(3), fontWeight: 'bold', color: 'white' }}>Supervisor Dashboard</Text>
            </View>

            {/* Logout icon */}
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: wp(3) }}>
                <AntDesign name="logout" size={24} color="white" />
            </TouchableOpacity>
        </View>
    )
}
