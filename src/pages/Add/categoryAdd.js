import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {InputData} from '../../components';
import WarningMessage from '../../components/Alert/warningMessage';
import COLORS from '../../components/colors/color';
import FIREBASE from '../../config/FIREBASE';

export default class Add extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categoryName: '',
      showAlert: false,
      successAlertMsg: false,
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
          this.successShowAlert();
          // Alert.alert('Success', 'category added');
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
      this.showAlert();
      // Alert.alert('Error', 'Please Input here');
    }
  };

  // ALERT FUNCTIONS
  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  // SUCCESSFULL ALERT FUNCTIONS
  successShowAlert = () => {
    this.setState({
      successAlertMsg: true,
    });
  };

  hideAlertSuccessMsg = () => {
    this.setState({
      successAlertMsg: false,
    });
    this.props.navigation.navigate('Category');
  };

  render() {
    const {showAlert, successAlertMsg} = this.state;

    return (
      <SafeAreaView style={styles.conatiner}>
        <View style={styles.header}>
          <View style={styles.title}>
            <Text style={styles.headerText}>Add New Category</Text>
          </View>
        </View>

        <View style={styles.pages}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <InputData
              label="Category Name"
              placeholder="Category Name here"
              onChangeText={this.onChangeText}
              value={this.state.categoryName}
              nameState="categoryName"
            />

            <TouchableOpacity
              style={styles.touch}
              onPress={() => this.onSubmit()}>
              <Text style={styles.submit}>Add</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <WarningMessage
          title="Sorry!"
          message="Please input suitable field"
          // confirmText="Yes, Delete"
          hideAlert={this.hideAlert}
          showAlert={showAlert}
          // confirmAlert={this.hideAlert}
        />

        {/* SUCCESS MESSAGE ALERT */}
        <WarningMessage
          title="Successfull!"
          message="Your New Menu Uploaded"
          // confirmText="Yes, Delete"
          hideAlert={this.hideAlertSuccessMsg}
          showAlert={successAlertMsg}
          // confirmAlert={this.hideAlert}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  conatiner: {flex: 1, backgroundColor: 'white'},
  header: {
    height: 200,
  },
  pages: {
    flex: 1,
    padding: 30,
    backgroundColor: 'rgba(4, 6, 31, 0.75)',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginHorizontal: 15,
  },
  title: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
    backgroundColor: COLORS.secondary,
  },

  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    top: Dimensions.get('window').width / 4,
  },

  touch: {
    backgroundColor: COLORS.primary,
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
