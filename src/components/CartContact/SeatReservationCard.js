import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEdit, faTimes} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import COLORS from '../../components/colors/color';

const SeatReservationCard = ({id, seatReservation, reserved}) => {
  return (
    <View
    // onPress={() => {
    //   navigation.navigate('Details', {id: id});
    // }}
    >
      <LinearGradient
        colors={[COLORS.primary, COLORS.primary]}
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
        <Text style={styles.submit}>GIVEN</Text>
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
  },

  CardTitleText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 14,
    textAlign: 'right',
  },

  CardText: {
    fontSize: 14,
    color: 'white',
  },

  touch: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  submit: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
});
