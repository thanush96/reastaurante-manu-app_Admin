import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {Calendar} from 'react-native-calendars';
import FIREBASE from '../../config/FIREBASE/index';
import DateFormat from 'react-native-date-format';

export default class tag extends Component {
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
      .ref('BulkOrders')
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
      DateFormat.formatDate(
        item.GiveDate,
        'dd-MM-yyyy',
        'yyyy-MM-dd',
        formatedDate => {
          dayy.push(formatedDate);
          this.setState({
            day: dayy,
          });
        },
      );
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

        <TouchableOpacity onPress={this.anotherFunc}>
          <Text>Show</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
