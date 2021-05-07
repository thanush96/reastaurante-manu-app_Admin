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
      />
    </>
  );
};

export default OtpInputData;

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: '#D3D3D3',
    color: 'black',
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 25,
    textAlign: 'center',
    letterSpacing: 20,
    fontWeight:'bold'
  },
});
