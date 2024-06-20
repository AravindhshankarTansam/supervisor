import React, { useRef, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/authContext';

export default function SignIn() {
  const navigation = useNavigation();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert('Sign In', "Please fill all the fields!");
      return;
    }

    setLoading(true);
    const response = await login(emailRef.current, passwordRef.current);
    setLoading(false);

    if (!response.success) {
      Alert.alert('Sign In', response.msg);
    } else {
      navigation.replace('Home'); // Corrected path
    }
  }

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <View style={{ paddingTop: hp(9), paddingHorizontal: wp(5), flex: 1, justifyContent: 'center' }}>
        {/* SignIn Image */}
        <View style={{ alignItems: 'center', marginBottom: hp(5) }}>
          <Image style={{ height: hp(25), width: wp(70) }} resizeMode='contain' source={require('../assets/images/indcosup.png')} />
        </View>

        {/* SignIn input */}
        <View style={{ paddingHorizontal: wp(5) }}>
          <Text style={{ fontSize: hp(4), fontWeight: 'bold', textAlign: 'center', marginBottom: hp(3) }}>Sign In</Text>
          {/* Inputs */}
          <View style={{ marginBottom: hp(3) }}>

            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(4), paddingVertical: hp(2), backgroundColor: '#E5E7EB', borderRadius: 10 }}>
              <Octicons name="mail" size={24} color="black" />
              <TextInput
                style={{ flex: 1, fontSize: hp(2), marginLeft: wp(3) }}
                onChangeText={value => emailRef.current = value}
                placeholder='Enter Your Mail-ID'
                placeholderTextColor={'grey'} />
            </View>

            <View style={{ marginTop: hp(2), flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(4), paddingVertical: hp(2), backgroundColor: '#E5E7EB', borderRadius: 10 }}>
              <Octicons name="lock" size={24} color="black" />
              <TextInput
                style={{ flex: 1, fontSize: hp(2), marginLeft: wp(3) }}
                onChangeText={value => passwordRef.current = value}
                placeholder='Password'
                secureTextEntry
                placeholderTextColor={'grey'} />
            </View>
            <Text style={{ fontSize: hp(1.8), fontWeight: 'bold', textAlign: 'right', marginTop: hp(2) }}>Forgot Password?</Text>
          </View>

          {/* Submit Button */}
          <View>
            {
              loading ? (
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <ActivityIndicator size="large" color="#6366F1" />
                </View>
              ) : (
                <TouchableOpacity onPress={handleLogin} style={{ height: hp(5), backgroundColor: '#6366F1', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: hp(2), fontWeight: 'bold', color: 'white' }}>Sign In</Text>
                </TouchableOpacity>
              )
            }
          </View>

          {/* SignUp text */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: hp(2) }}>
            <Text style={{ fontSize: hp(1.8), fontWeight: 'bold' }} className="text-neutral-500">Don't have an Account?</Text>
            <TouchableOpacity onPress={navigateToSignUp}>
              <Text style={{ fontSize: hp(1.8), fontWeight: 'bold', color: '#6366F1', marginLeft: wp(1) }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
