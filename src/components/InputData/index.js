import React from 'react';
import {StyleSheet, Text, TextInput} from 'react-native';

const InputData = ({
  label,
  placeholder,
  keyboardType,
  onChangeText,
  nameState,
  value,
}) => {
  return (
    <>
      <Text style={styles.label}>{label} </Text>
      <TextInput
        placeholderTextColor="grey"
        placeholder={placeholder}
        style={styles.textInput}
        keyboardType={keyboardType}
        onChangeText={text => onChangeText(nameState, text)}
        value={value}

      />
    </>
  );
};

export default InputData;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
  },

  textInput: {
    borderWidth: 1,
    borderColor: 'white',
    color: 'white',
    borderRadius: 5,
    marginBottom: 10,
  },
});
