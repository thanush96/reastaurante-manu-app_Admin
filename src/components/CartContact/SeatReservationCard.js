import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEdit, faTimes} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SeatReservationCard = ({id, seatReservation, reserved}) => {
  return (
    <View
    // onPress={() => {
    //   navigation.navigate('Details', {id: id});
    // }}
    >
      <LinearGradient
        colors={['#63a4ff', '#045de9']}
        style={styles.linearGradient}>
        <View>
          <Text style={styles.CardTitleText}>OTP - {seatReservation.otp}</Text>

          <Text style={styles.CardText}>Seat : {seatReservation.Seat}</Text>

          <Text style={styles.CardText}>
            Booking Seat for : {seatReservation.GiveDate}
          </Text>
          <Text style={styles.CardText}>
            Customer Name : {seatReservation.CustomerName}
          </Text>
          <Text style={styles.CardText}>
            Mobile : {seatReservation.CustomerContactNo}
          </Text>
          <Text style={styles.CardText}>
            Ordered date : {seatReservation.OrderderedDate}
          </Text>
        </View>

        <View style={styles.icon}>
          {/* <FontAwesomeIcon
            icon={faEdit}
            color={'white'}
            size={25}
            onPress={() => {
              navigation.navigate('Edit', {id: id});
            }}
          /> */}
          {/* <FontAwesomeIcon
            icon={faTimes}
            color={'white'}
            size={25}
            onPress={() => {
              reserved(id);
            }}
          /> */}
        </View>
      </LinearGradient>
      <TouchableOpacity style={styles.touch} onPress={() => reserved(id)}>
        <Text style={styles.submit}>DONE</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SeatReservationCard;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginBottom: 1,
    shadowColor: '#000',
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.85,
  },

  CardTitleText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 27,
    textAlign: 'center',
  },

  CardText: {
    fontSize: 17,
    color: 'white',
    marginTop: 10,
  },

  icon: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  touch: {
    backgroundColor: 'green',
    padding: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  submit: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
