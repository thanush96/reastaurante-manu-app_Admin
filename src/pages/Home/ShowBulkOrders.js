import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
  Button,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import FIREBASE from '../../config/FIREBASE';
import BulkOrderCard from '../../components/CartContact/bulkOrderCard';

export default class BulkOrderHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: {},
      ordersKey: [],
      refreshing: false,
    };
  }

  componentDidMount() {
    this.MountData();
    console.log('BulkOrders Mounting....');
  }

  MountData() {
    FIREBASE.database()
      .ref('BulkOrders')
      .once('value', querySnapShot => {
        let data = querySnapShot.val() ? querySnapShot.val() : {};
        let bulkItem = {...data};

        this.setState({
          orders: bulkItem,
          ordersKey: Object.keys(bulkItem),
          refreshing: false,
        });
      });
  }

  // REFRESH FUNCTION
  _onRefresh = () => {
    this.setState({refreshing: true});
    this.componentDidMount();
  };

  render() {
    const {orders, ordersKey} = this.state;
    return (
      <View style={styles.page}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View style={styles.listContact}>
            {ordersKey.length > 0 ? (
              ordersKey.map(key => (
                <BulkOrderCard
                  key={key}
                  bulkItem={orders[key]}
                  id={key}
                  {...this.props}
                  // removeData={this.removeData}
                />
              ))
            ) : (
              <Text>No Orders</Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 30,
    paddingTop: 30,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  grid: {
    borderWidth: 1,
    marginTop: 10,
  },

  listContact: {
    paddingHorizontal: 30,
    marginTop: 20,
  },
  wrapperButton: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 30,
  },

  btn: {
    padding: 20,
    backgroundColor: '#3399ff',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
