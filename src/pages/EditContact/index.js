import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {InputData} from '../../components';
import FIREBASE from '../../config/FIREBASE';

export default class Edit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      age: '',
      address: '',
    };
  }

  componentDidMount() {
    FIREBASE.database()
      .ref('contact/' + this.props.route.params.id)
      .once('value', querySnapShot => {
        let data = querySnapShot.val() ? querySnapShot.val() : {};
        let contactItem = {...data};

        this.setState({
          name: contactItem.name,
          age: contactItem.age,
          address: contactItem.address,
        });
      });
  }

  onChangeText = (nameState, value) => {
    this.setState({
      [nameState]: value,
    });
  };

  onSubmit = () => {
    if (this.state.name && this.state.age && this.state.address) {
      const AddContact = FIREBASE.database().ref(
        'contact/' + this.props.route.params.id,
      );
      const contact = {
        name: this.state.name,
        age: this.state.age,
        address: this.state.address,
      };

      AddContact.update(contact)
        .then(data => {
          Alert.alert('Success', 'Contact updated');
        })

        .catch(error => {
          console.log('Error :', error);
        });

      console.log('Added');
      console.log(this.state);
    } else {
      Alert.alert('Error', 'Please Input here');
    }
  };

  render() {
    return (
      <View style={styles.pages}>
        <InputData
          label="name"
          placeholder="Name here"
          onChangeText={this.onChangeText}
          value={this.state.name}
          nameState="name"
        />

        <InputData
          label="age"
          placeholder="Age Here"
          keyboardType="number-pad"
          onChangeText={this.onChangeText}
          value={this.state.age}
          nameState="age"
        />

        <InputData
          label="address"
          placeholder="Address here"
          onChangeText={this.onChangeText}
          value={this.state.address}
          nameState="address"
        />

        <TouchableOpacity style={styles.touch} onPress={() => this.onSubmit()}>
          <Text style={styles.submit}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pages: {
    flex: 1,
    padding: 30,
  },

  touch: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  submit: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
