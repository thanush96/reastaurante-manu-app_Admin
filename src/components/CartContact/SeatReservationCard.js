import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEdit, faTimes} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SeatReservationCard = ({id, bulkItem, navigation}) => {
  return (
    <TouchableOpacity
    // onPress={() => {
    //   navigation.navigate('Details', {id: id});
    // }}
    >
      <LinearGradient
        colors={['#63a4ff', '#045de9']}
        style={styles.linearGradient}>
        <View>
          <Text style={styles.CardTitleText}>{bulkItem.OrderedFood}</Text>
          <Text style={styles.CardText}>
            Name : {bulkItem.NumberOfParcels}
          </Text>
          <Text style={styles.CardText}>
            Delevery Date : {bulkItem.GiveDate}
          </Text>
          <Text style={styles.CardText}>
            Customer Name : {bulkItem.CustomerName}
          </Text>
          <Text style={styles.CardText}>
            Mobile : {bulkItem.CustomerContactNo}
          </Text>
          <Text style={styles.CardText}>
            Ordered date : {bulkItem.OrderderedDate}
          </Text>
        </View>

        {/* <View style={styles.icon}>
          <FontAwesomeIcon
            icon={faEdit}
            color={'white'}
            size={25}
            onPress={() => {
              navigation.navigate('Edit', {id: id});
            }}
          />
          <FontAwesomeIcon
            icon={faTimes}
            color={'white'}
            size={25}
            onPress={() => {
              removeData(id);
            }}
          />
        </View> */}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default SeatReservationCard;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
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
    fontSize: 25,
  },

  CardText: {
    fontSize: 14,
    color: 'white',
  },

  icon: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
