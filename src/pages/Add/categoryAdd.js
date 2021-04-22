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

export default class Add extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categoryName: '',
    };
  }

  onChangeText = (nameState, value) => {
    this.setState({
      [nameState]: value,
    });
  };

  onSubmit = () => {
    if (this.state.categoryName) {
      const addCategory = FIREBASE.database().ref('categories');
      const category = {
        categoryName: this.state.categoryName,
      };

      addCategory
        .push(category)
        .then(data => {
          Alert.alert('Success', 'category added');
          this.setState({
            categoryName: '',
          });
        })

        .catch(error => {
          console.log('Error :', error);
        });

      console.log('Added');
      // console.log(this.state);
    } else {
      Alert.alert('Error', 'Please Input here');
    }
  };

  render() {
    return (
      <View style={styles.pages}>
        <InputData
          label="category Name"
          placeholder="category Name here"
          onChangeText={this.onChangeText}
          value={this.state.categoryName}
          nameState="categoryName"
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
