import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEdit, faTimes} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const CategoryCard = ({id, categoryItem, navigation, removeData}) => {
  return (
    <View style={styles.conatiner}>
      <LinearGradient
        colors={['#045de9', '#045de9']}
        style={styles.linearGradient}>
        {/* onPress=
      {() => {
        navigation.navigate('fire', {id: id});
      }} */}
        <View>
          <Text style={styles.name}>{categoryItem.categoryName}</Text>
        </View>
        <View style={styles.icon}>
          <FontAwesomeIcon
            icon={faEdit}
            color={'white'}
            size={25}
            onPress={() => {
              navigation.navigate('categoryEdit', {id: id});
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
    </View>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    borderRadius: 15,
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
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },

  icon: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
