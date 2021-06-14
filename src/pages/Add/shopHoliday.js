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
import {Calendar} from 'react-native-calendars';
import DateFormat from 'react-native-date-format';

export default class holiday extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAlert: false,
      successAlertMsg: false,
      DupAlerMsg: false,
      days: [],
      day: [],
      marked: null,
      date: '',
      calendarShow: false,
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
      days: await this.get_firebase_list(),
    });

    const dayy = [];
    this.state.days.map((item, index) => {
      dayy.push(item.holidayDate);
      this.setState({
        day: dayy,
      });
    });
  }

  anotherFunc = () => {
    console.log('anotherFunc');
    var obj = this.state.day.reduce(
      (c, v) =>
        Object.assign(c, {
          [v]: {
            disabled: true,
            disableTouchEvent: true,
          },
        }),
      {},
    );
    this.setState({marked: obj, calendarShow: true});
  };

  onChangeText = (nameState, value) => {
    this.setState({
      [nameState]: value,
    });
  };

  onSubmit = () => {
    if (this.state.date) {
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.title}>
              <Text style={styles.headerText}>Add Holiday</Text>
            </View>
          </View>

          <View style={styles.pages}>
            <TextInput
              placeholderTextColor="grey"
              onFocus={this.anotherFunc}
              placeholder="Holiday Date"
              style={styles.textInput}
              onChangeText={text => onChangeText(date, text)}
              value={this.state.date}
            />
            {this.state.calendarShow ? (
              <Calendar
                style={{
                  borderRadius: 8,
                }}
                markedDates={this.state.marked}
                minDate={today}
                onDayPress={day => {
                  this.setState({
                    date: day.dateString,
                  });
                  console.log('selected day', this.state.date);
                }}
                theme={{
                  calendarBackground: '#ffffff',
                  textSectionTitleColor: '#b6c1cd',
                  textSectionTitleDisabledColor: '#d9e1e8',
                  selectedDayBackgroundColor: '#00adf5',
                  selectedDayTextColor: '#ffffff',
                  dayTextColor: COLORS.secondary,
                  dotColor: '#00adf5',
                  selectedDotColor: '#ffffff',
                  arrowColor: COLORS.secondary,
                  monthTextColor: COLORS.secondary,
                  textDayFontFamily: 'monospace',
                  textMonthFontFamily: 'monospace',
                  textDayHeaderFontFamily: 'monospace',
                  textDayFontWeight: '300',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '300',
                  textDayFontSize: 16,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 16,
                }}
              />
            ) : null}

            <TouchableOpacity
              style={styles.touch}
              onPress={() => this.onSubmit()}>
              <Text style={styles.submit}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.touch}
              onPress={() => this.props.navigation.navigate('holidayCalendar')}>
              <Text style={styles.submit}>Show Holiday Calendar</Text>
            </TouchableOpacity>
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
        </ScrollView>
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
    borderRadius: 15,

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

  textInput: {
    borderWidth: 1,
    borderColor: 'white',
    color: 'white',
    borderRadius: 5,
    marginBottom: 10,
  },
});
