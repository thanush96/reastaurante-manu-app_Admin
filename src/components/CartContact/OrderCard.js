import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import COLORS from '../colors/color';

const OrderCard = ({id, bulkItem, navigation, removeData}) => {
  return (
    <TouchableOpacity
    // onPress={() => {
    //   navigation.navigate('Details', {id: id});
    // }}
    >
      <View style={styles.linearGradient}>
        <Text style={styles.CardTitleText}>{bulkItem.OrderedFood}</Text>
        <Text style={styles.CardText}>
          Parcels : {bulkItem.NumberOfParcels}
        </Text>
        <Text style={styles.CardText}>Delevery Date : {bulkItem.GiveDate}</Text>
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
            icon={faAngleDoubleLeft}
            color={'white'}
            size={60}
            onPress={() => {
              removeData(id);
            }}
          />
        </View> */}
    </TouchableOpacity>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    backgroundColor: COLORS.primary,
    // backgroundColor: 'rgba(4, 6, 31, 0.75)',

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
