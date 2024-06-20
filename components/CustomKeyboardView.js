import { View, Text } from 'react-native'
import React, { Children } from 'react'
import { KeyboardAvoidingView } from 'react-native-web'

export default function CustomKeyboardView() {
  return (
    <KeyboardAvoidingView style={{flex:1}}>

        <ScrollView style={{flex:1}} bounces={false} showsVerticalScrollIndicator={true}>
            {
                Children
            }
        </ScrollView>
    </KeyboardAvoidingView>
  )
}