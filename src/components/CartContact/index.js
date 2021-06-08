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
        colors={[COLORS.dark, COLORS.primary]}
        style={styles.linearGradient}>
        <View>
          <Text style={styles.name}>{contactItem.name}</Text>
          <View
            style={{
              backgroundColor: 'red',
              width: Dimensions.get('window').width / 5,
              color: 'white',
              borderBottomRightRadius: 10,
              borderTopRightRadius: 10,
            }}>
            <Text style={styles.unitPrice}>Rs:{contactItem.unitPrice}</Text>
          </View>

          <Text style={styles.description}>{contactItem.description}</Text>
          <View
            style={{
              backgroundColor: 'grey',
              color: 'white',
              paddingLeft: 5,
              paddingRight: 5,
              borderBottomRightRadius: 10,
              borderTopRightRadius: 10,
              width: Dimensions.get('window').width / 3.5,
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
              }}>
              Abilable as
            </Text>
          </View>

          <View>
            {contactItem.category.map((item, key) => {
              return (
                <View key={key}>
                  <Text style={styles.category}>{item}</Text>
                </View>
              );
            })}
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
    color: 'grey',
    fontSize: 20,
    margin: 5,
    width: Dimensions.get('window').width / 3,
  },
  unitPrice: {
    fontSize: 20,
    color: 'white',
  },
  description: {
    fontSize: 12,
    margin: 5,
    color: 'white',
    width: Dimensions.get('window').width / 3,
  },
  category: {
    fontSize: 12,
    color: COLORS.light,
    marginLeft: 15,
  },
  img: {
    margin: 15,
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
