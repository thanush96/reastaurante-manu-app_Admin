import React, {Component} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Calendar} from 'react-native-calendars';
import FIREBASE from '../../config/FIREBASE/index';
import DateFormat from 'react-native-date-format';
import COLORS from '../../components/colors/color';

export default class SeatReservationCalendarView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      days: [],
      day: [],
      marked: null,
    };
  }

  async get_firebase_Dates() {
    return FIREBASE.database()
      .ref('Seat_Reservation')
      .once('value')
      .then(function (snapshot) {
        var BulkOrderDates = [];
        snapshot.forEach(childSnapshot => {
          var key = childSnapshot.key;
          var dates = childSnapshot.val();
          BulkOrderDates.push(dates);
        });
        return BulkOrderDates;
      });
  }

  async componentWillMount() {
    this.setState({
      days: await this.get_firebase_Dates(),
    });

    const dayy = [];
    this.state.days.map((item, index) => {
      dayy.push(item.GiveDate);
      this.setState({
        day: dayy,
      });

      // const dayy = [];
      // this.state.days.map((item, index) => {
      //   DateFormat.formatDate(
      //     item.GiveDate,
      //     'dd-MM-yyyy',
      //     'yyyy-MM-dd',
      //     formatedDate => {
      //       dayy.push(formatedDate);
      //       this.setState({
      //         day: dayy,
      //       });
      //     },
      //   );
    });
  }

  // async componentDidMount() {
  //   // this._unsubscribe = this.props.navigation.addListener('focus', () => {
  //     // this.anotherFunc();
  //   // });
  // }

  anotherFunc = () => {
    var obj = this.state.day.reduce(
      (c, v) => Object.assign(c, {[v]: {selected: true, marked: true}}),
      {},
    );
    this.setState({marked: obj});
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <Calendar markedDates={this.state.marked} />

        <TouchableOpacity style={styles.touch} onPress={this.anotherFunc}>
          <Text style={styles.submit}>Seat Reservation Dates</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  touch: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 50,
    padding: 10,
    // borderRadius: 5,
    marginTop: 10,
  },
  submit: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
