import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEdit, faTimes} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import COLORS from '../colors/color';

const CardContact = ({id, contactItem, navigation, removeData}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Details', {id: id});
      }}>
      <LinearGradient
        colors={['rgba(4, 6, 31, 0.8)', '#899DB0']}
        style={styles.linearGradient}>
        <View>
          <Text style={styles.name}>{contactItem.name}</Text>
          <Text style={styles.unitPrice}>Rs:{contactItem.unitPrice}</Text>
          <Text style={styles.description}>{contactItem.description}</Text>
          <Text style={styles.category}>{contactItem.category}</Text>
        </View>
        <View>
          <Image
            style={styles.img}
            source={{
              uri: contactItem.imgUrl,
            }}
          />
        </View>
        <View style={styles.icon}>
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
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CardContact;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    // elevation: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.85,
  },

  name: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
    width: Dimensions.get('window').width / 3,
  },
  unitPrice: {
    fontSize: 12,
    color: 'white',
  },
  description: {
    fontSize: 12,
    // backgroundColor: 'red',
    color: 'white',
    width: Dimensions.get('window').width / 3,
  },
  category: {
    fontSize: 14,
    color: COLORS.primary,
    width: Dimensions.get('window').width / 3,
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },

  icon: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
