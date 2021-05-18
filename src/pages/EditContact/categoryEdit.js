import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import {InputData} from '../../components';
import WarningMessage from '../../components/Alert/warningMessage';
import COLORS from '../../components/colors/color';
import FIREBASE from '../../config/FIREBASE';

export default class categoryEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Name: '',
      showAlert: false,
      successAlertMsg: false,
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
          this.successShowAlert();
        })

        .catch(error => {
          console.log('Error :', error);
        });

      console.log('updated');
      console.log(this.state);
    } else {
      // Alert.alert('Error', 'Please Input here');
      this.showAlert();
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
            <Text style={styles.headerText}>Edit Category</Text>
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
              value={this.state.Name}
              nameState="Name"
            />

            <TouchableOpacity
              style={styles.touch}
              onPress={() => this.onSubmit()}>
              <Text style={styles.submit}>Submit</Text>
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
