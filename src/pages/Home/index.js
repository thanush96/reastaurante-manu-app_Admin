import React, {Component} from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Alert,ScrollView} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import FIREBASE from '../../config/FIREBASE';
import {CardContact} from '../../components';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contact: {},
      contactKey: [],
    };
  }

  componentDidMount() {
    this.MountData();
  }

  MountData() {
    FIREBASE.database()
      .ref('contact')
      .once('value', querySnapShot => {
        let data = querySnapShot.val() ? querySnapShot.val() : {};
        let contactItem = {...data};

        this.setState({
          contact: contactItem,
          contactKey: Object.keys(contactItem),
        });
      });
  }

  removeData = id => {
    Alert.alert(
      'Alert Title',
      'My Alert Msg',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'ok',
          onPress: () => {
            FIREBASE.database()
              .ref('contact/' + id)
              .remove();
            this.MountData();

            Alert.alert('Succes', 'Deleted');
          },
          style: 'cancel',
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  render() {
    // console.log('contact : ', this.state.contact);
    // console.log('contactKey : ', this.state.contactKey);

    const {contact, contactKey} = this.state;
    return (
      <View style={styles.page}>
        <ScrollView showsVerticalScrollIndicator={false}>

        {/* <View style={styles.header}>
          <Text style={styles.title}>Menu</Text>
          <View style={styles.grid} />
        </View> */}

        <View style={styles.listContact}>
          {contactKey.length > 0 ? (
            contactKey.map(key => (
              <CardContact
                key={key}
                contactItem={contact[key]}
                id={key}
                {...this.props}
                removeData={this.removeData}
              />
            ))
          ) : (
            <Text>No Items</Text>

          )}
        </View>
        </ScrollView>

        <View style={styles.wrapperButton}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => this.props.navigation.navigate('Add')}>
            <FontAwesomeIcon icon={faPlus} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 30,
    paddingTop: 30,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  grid: {
    borderWidth: 1,
    marginTop: 10,
  },

  listContact: {
    paddingHorizontal: 30,
    marginTop: 20,
  },
  wrapperButton: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 30,
  },

  btn: {
    padding: 20,
    backgroundColor: '#3399ff',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
