import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

export default function Startpage() {
  return (
    <View className="flex-1 justify-center pt-35">
      <ActivityIndicator size="large" color="grey" />
    </View>
  )
}
