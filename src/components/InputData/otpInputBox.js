import React from 'react';
import {StyleSheet, Text, TextInput} from 'react-native';

const OtpInputData = ({
  label,
  placeholder,
  keyboardType,
  onChangeText,
  nameState,
  value,
}) => {
  return (
    <>
      <TextInput
        placeholderTextColor="white"
        placeholder={placeholder}
        style={styles.textInput}
        keyboardType={keyboardType}
        onChangeText={text => onChangeText(nameState, text)}
        value={value}
        maxLength={6}
      />
    </>
  );
};

export default OtpInputData;

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: '#D3D3D3',
    color: 'black',
    borderRadius: 50,
    marginBottom: 10,
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: 25,
    fontWeight:'bold'
  },
});
