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
import DatePicker from 'react-native-datepicker';
import {InputData} from '../../components';
import WarningMessage from '../../components/Alert/warningMessage';
import COLORS from '../../components/colors/color';
import FIREBASE from '../../config/FIREBASE';

export default class holiday extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAlert: false,
      successAlertMsg: false,
      DupAlerMsg: false,
      oldDates: [],
      date: '',
    };
  }

  async get_firebase_list() {
    return FIREBASE.database()
      .ref('holidays')
      .once('value')
      .then(function (snapshot) {
        var items = [];
        snapshot.forEach(function (childSnapshot) {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          items.push(childData);
        });
        return items;
      });
  }
  async componentWillMount() {
    this.setState({
      oldDates: await this.get_firebase_list(),
    });
  }

  onChangeText = (nameState, value) => {
    this.setState({
      [nameState]: value,
    });
  };

  onSubmit = () => {
    let duplicate = false;
    if (this.state.date) {
      this.state.oldDates.map((item, index) => {
        if (item.holidayDate === this.state.date) {
          duplicate = true;
        }
      });
    } else {
      this.showAlert();
    }

    if (this.state.date) {
      if (!duplicate) {
        const addHolidays = FIREBASE.database().ref('holidays');
        const holidays = {
          holidayDate: this.state.date,
        };
        addHolidays
          .push(holidays)
          .then(data => {
            this.successShowAlert();
            this.setState({
              date: '',
            });
          })

          .catch(error => {
            console.log('Error :', error);
          });
      } else {
        this.showDupAlerMsg();
      }
    } else {
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

  // DUPLICATE ALERT FUNCTIONS
  showDupAlerMsg = () => {
    this.setState({
      DupAlerMsg: true,
    });
  };

  hideDupAlerMsg = () => {
    this.setState({
      DupAlerMsg: false,
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
    this.props.navigation.navigate('OrderQueue');
  };

  render() {
    const {DupAlerMsg, showAlert, successAlertMsg} = this.state;
    var today = new Date();
    return (
      <SafeAreaView style={styles.conatiner}>
        <View style={styles.header}>
          <View style={styles.title}>
            <Text style={styles.headerText}>Add Holiday</Text>
          </View>
        </View>

        <View style={styles.pages}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <DatePicker
              style={styles.datePickerStyle}
              date={this.state.date}
              mode="date"
              placeholder="Select Your Order date"
              format="DD-MM-YYYY"
              minDate={today}
              maxDate="01-01-2051"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  marginLeft: 10,
                },
                dateInput: {
                  marginLeft: 0,
                  backgroundColor: 'grey',
                  borderColor: 'red',
                  borderWidth: 10,
                  height: 45,
                  marginBottom: 10,
                  borderWidth: 0,
                },
              }}
              onDateChange={date => {
                this.setState({
                  date: date,
                });
              }}
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
          message="Please Select Holiday Date"
          hideAlert={this.hideAlert}
          showAlert={showAlert}
        />

        <WarningMessage
          title="Successfull!"
          message="Your New Holiday Assigned"
          hideAlert={this.hideAlertSuccessMsg}
          showAlert={successAlertMsg}
        />

        <WarningMessage
          title="Sorry!"
          message="This Holiday Already Assigned"
          hideAlert={this.hideDupAlerMsg}
          showAlert={DupAlerMsg}
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
  datePickerStyle: {
    width: 300,
    marginTop: 10,
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
