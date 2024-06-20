import React, { useRef, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/authContext';

export default function SignUp() {
  const navigation = useNavigation();
  const { register } = useAuth();

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const usernameRef = useRef("");
  const employeeIDRef = useRef("");

  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!emailRef.current || !passwordRef.current || !usernameRef.current || !employeeIDRef.current) {
      Alert.alert('Sign Up', "Please fill all the fields!");
      return;
    }

    setLoading(true);

    let response = await register(emailRef.current, passwordRef.current, usernameRef.current, employeeIDRef.current);

    setLoading(false);

    if (response.success) {
      navigation.navigate('signIn'); // Navigate to signIn screen on successful registration
    } else {
      Alert.alert('Sign Up', response.msg);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <View style={{ paddingTop: hp(9), paddingHorizontal: wp(5), flex: 1, justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', marginBottom: hp(5) }}>
          <Image style={{ height: hp(15), width: wp(70) }} resizeMode='contain' source={require('../assets/images/logo2.0.png')} />
        </View>

        <View style={{ paddingHorizontal: wp(5), marginBottom: hp(3) }}>
          <Text style={{ fontSize: hp(4), fontWeight: 'bold', textAlign: 'center', marginBottom: hp(3) }}>Sign Up</Text>

          <View style={{ marginBottom: hp(5) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(4), paddingVertical: hp(2), backgroundColor: '#E5E7EB', borderRadius: 10, marginBottom: 20 }}>
              <Octicons name="person" size={24} color="black" />
              <TextInput
                style={{ flex: 1, fontSize: hp(2), marginLeft: wp(3) }}
                onChangeText={value => usernameRef.current = value}
                placeholder='Enter Your User name'
                placeholderTextColor={'grey'} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: wp(4), paddingVertical: hp(2), backgroundColor: '#E5E7EB', borderRadius: 10, marginBottom: 20 }}>
              <Entypo name="user" size={24} color="black" />
              <TextInput
                style={{ flex: 1, fontSize: hp(2), marginLeft: wp(3) }}
                onChangeText={value => employeeIDRef.current = value}
                placeholder='Enter Your Employee ID number'
                placeholderTextColor={'grey'} />
            </View>

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
          </View>

          <View style={{ marginTop: hp(1) }}>
            {
              loading ? (
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <ActivityIndicator size="large" color="#6366F1" />
                </View>
              ) : (
                <TouchableOpacity onPress={handleSignUp} style={{ height: hp(5), backgroundColor: '#6366F1', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: hp(2), fontWeight: 'bold', color: 'white' }}>Sign Up</Text>
                </TouchableOpacity>
              )
            }
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: hp(2) }}>
            <Text style={{ fontSize: hp(1.8), fontWeight: 'bold' }} className="text-neutral-500">Already have an Account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('signIn')}>
              <Text style={{ fontSize: hp(1.8), fontWeight: 'bold', color: '#6366F1', marginLeft: wp(1) }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
