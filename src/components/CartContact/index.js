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
          <View>
            <Text style={styles.category}>{contactItem.category}</Text>
            <Text style={styles.category}>{contactItem.category2}</Text>
            <Text style={styles.category}>{contactItem.category4}</Text>
            <Text style={styles.category}>{contactItem.category4}</Text>
            <Text style={styles.category}>{contactItem.category5}</Text>
          </View>
        </View>

        <View>
          <Image
            style={styles.img}
            source={{
              uri: contactItem.imgUrl,
            }}
          />
        </View>
      </LinearGradient>
      <View style={styles.icon}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Edit', {id: id});
          }}>
          <Text style={styles.editAction}>
            {/* <FontAwesomeIcon icon={faEdit} color={'white'} size={25} /> */}
            Edit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            removeData(id);
          }}>
          <Text style={styles.deleteAction}>
            {/* <FontAwesomeIcon icon={faTimes} color={'white'} size={25} /> */}
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default CardContact;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 15,
    shadowColor: '#000',
    // elevation: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.85,
  },
  editAction: {
    backgroundColor: COLORS.primary,
    fontSize: 18,
    width: 120,
    textAlign: 'center',
    margin: 5,
    borderRadius: 8,
    color: 'white',
  },

  deleteAction: {
    backgroundColor: 'red',
    fontSize: 18,
    width: 120,
    textAlign: 'center',
    margin: 5,
    borderRadius: 8,
    color: 'white',
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
    color: 'white',
    width: Dimensions.get('window').width / 3,
  },
  category: {
    fontSize: 14,
    color: COLORS.primary,
    width: Dimensions.get('window').width / 3,
  },
  img: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderColor: 'white',
    borderWidth: 2,
  },

  icon: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // alignItems: 'center',
    backgroundColor: 'grey',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});
