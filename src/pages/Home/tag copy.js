import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {Agenda} from 'react-native-calendars';
import FIREBASE from '../../config/FIREBASE/index';
import DateFormat from 'react-native-date-format';

export default class tag extends Component {
  constructor(props) {
    super(props);

    this.state = {
      days: [],
      items: {},
      day: [],
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
  }

  timeToString = time => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };

  loadItems = () => {
    setTimeout(() => {
      console.log('loading');

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

      for (let i = 0; i < this.state.day.length; i++) {
        const strTime = this.timeToString(this.state.day[i]);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          // const numItems = Math.floor(Math.random() * 3 + 1);
          // console.log(Math.floor(Math.random() * 3 + 1));
          // for (let j = 0; j < numItems; j++) {
          // console.log(numItems);
          // this.state.items[strTime].push({
          //   name: 'Item for ' + strTime + ' #' + j,
          //   height: Math.max(50, Math.floor(Math.random() * 150)),
          // });
          // }
        }
      }
      // }
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {
        newItems[key] = this.state.items[key];
      });
      this.setState({items: newItems});
    }, 1000);
  };

  renderItem = item => {
    return (
      <TouchableOpacity style={{marginRight: 10, marginTop: 17}}>
        {/* <Card>
          <Card.Content> */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {/* <Text>{item.name}</Text> */}
          <Text>Hello</Text>
          {/* <Avatar.Text label="J" /> */}
        </View>
        {/* </Card.Content>
        </Card> */}
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <Agenda
          items={this.state.items}
          loadItemsForMonth={this.loadItems}
          selected={'2021-06-16'}
          minDate={'2021-05-01'}
          maxDate={'2021-06-30'}
          hideExtraDays={true}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}
