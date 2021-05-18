import React from 'react';
import {StyleSheet} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

const WarningMessage = ({
  title,
  message,
  confirmText,
  hideAlert,
  showAlert,
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
      showConfirmButton={false}
      cancelText="Ok"
      confirmText={confirmText}
      cancelButtonColor="#DD6B55"
      onCancelPressed={() => {
        hideAlert();
      }}
    />
  );
};

export default WarningMessage;

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
