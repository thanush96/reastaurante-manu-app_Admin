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

export default class categoryEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: '',
    };
  }

  componentDidMount() {
    FIREBASE.database()
      .ref('categories/' + this.props.route.params.id)
      .once('value', querySnapShot => {
        let data = querySnapShot.val() ? querySnapShot.val() : {};
        let categoryItem = {...data};

        this.setState({
          Name: categoryItem.categoryName,
        });
      });
      
  }

  onChangeText = (nameState, value) => {
    this.setState({
      [nameState]: value,
    });
  };

  onSubmit = () => {
    if (this.state.Name) {
      const AddCategory = FIREBASE.database().ref(
        'categories/' + this.props.route.params.id,
      );
      const category = {
        categoryName: this.state.Name,
      };

      AddCategory.update(category)
        .then(data => {
          Alert.alert('Success', 'Category updated');
        })

        .catch(error => {
          console.log('Error :', error);
        });

      console.log('updated');
      console.log(this.state);
    } else {
      Alert.alert('Error', 'Please Input here');
    }
  };

  render() {
    return (
      <View style={styles.pages}>
        <InputData
          label="categoryName"
          placeholder="categoryName here"
          onChangeText={this.onChangeText}
          value={this.state.Name}
          nameState="Name"
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
