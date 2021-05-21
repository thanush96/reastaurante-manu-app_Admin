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
import FIREBASE from '../../config/FIREBASE';
import OrderCard from '../../components/CartContact/OrderCard';

export default class Orders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: {},
      ordersKey: [],
      refreshing: false,
      showAlert: false,
      getId: '',
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.MountData();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  MountData() {
    console.log('Mounting....');

    FIREBASE.database()
      .ref('BulkOrders')
      // .orderByChild('OrderedFood')
      // .startAt('F')
      .once('value', querySnapShot => {
        let data = querySnapShot.val() ? querySnapShot.val() : {};
        let bulkItem = {...data};
        this.setState({
          orders: bulkItem,
          ordersKey: Object.keys(bulkItem),
          refreshing: false,
        });
      });

    // var ref = FIREBASE.database().ref('BulkOrders');
    // ref
    //   .orderByChild('OrderderedDate')
    //   // .limitToLast(100)
    //   // .startAt(3)
    //   .on('child_added', function (snapshot) {
    //     console.log(snapshot.key);
    //   });

    // FIREBASE.database()
    //   .ref('BulkOrders')
    //   .orderByChild('NumberOfParcels')
    //   .equalTo(50)
    //   .once('value', querySnapShot => {
    //     let data = querySnapShot.val() ? querySnapShot.val() : {};
    //     let bulkItem = {...data};

    //     console.log(bulkItem);
    //     this.setState({
    //       orders: bulkItem,
    //       ordersKey: Object.keys(bulkItem),
    //       refreshing: false,
    //     });
    //   });
  }

  // REFRESH FUNCTION
  _onRefresh = () => {
    this.setState({refreshing: true});
    this.MountData();
  };

  render() {
    const {orders, ordersKey, showAlert} = this.state;
    // console.log(this.props.navigation);
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
                <OrderCard
                  key={key}
                  bulkItem={orders[key]}
                  id={key}
                  {...this.props}
                  //   removeData={this.showAlert}
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
