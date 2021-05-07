import React from 'react';
import {StyleSheet} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

const CustomAlert = ({
  title,
  message,
  confirmText,
  hideAlert,
  showAlert,
  confirmAlert,
}) => {
  return (
    <AwesomeAlert
      style={styles.alert}
      show={showAlert}
      showProgress={false}
      title={title}
      message={message}
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={false}
      showCancelButton={true}
      showConfirmButton={true}
      cancelText="No, cancel"
      confirmText={confirmText}
      confirmButtonColor="#DD6B55"
      onCancelPressed={() => {
        hideAlert();
      }}
      onConfirmPressed={() => {
        confirmAlert();
      }}
    />
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  button: {
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5,
    backgroundColor: '#AEDEF4',
  },
  text: {
    color: '#fff',
    fontSize: 15,
  },
});
