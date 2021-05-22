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
import {
  faPlus,
  faShower,
  faStreetView,
  faThList,
} from '@fortawesome/free-solid-svg-icons';
import FIREBASE from '../../config/FIREBASE';
import BulkOrderCard from '../../components/CartContact/bulkOrderCard';
import {Value} from 'react-native-reanimated';
import CustomAlert from '../../components/Alert/deleteAlert';
import COLORS from '../../components/colors/color';

export default class BulkOrderHome extends Component {
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
    // console.log('Mounting....');
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

  // ALERT FUNCTIONS
  showAlert = id => {
    this.setState({
      showAlert: true,
      getId: id,
    });
  };

  confirmAlert = () => {
    let acceptOrder = FIREBASE.database().ref('BulkOrders/' + this.state.getId);
    let token = {
      status: false,
    };
    acceptOrder
      .update(token)
      .then(data => {
        console.log('Updated');
        this.MountData();
      })
      .catch(error => {
        console.log(error);
      });

    this.setState({
      showAlert: false,
    });
  };

  hideAlert = () => {
    console.log('hide');
    this.setState({
      showAlert: false,
    });
  };

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
        <View style={styles.wrapperButton}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => this.props.navigation.navigate('Orders')}>
            <Text style={{fontSize: 12}}>PREVIOUS ORDERS </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => this.props.navigation.navigate('AddHolidays')}>
            <Text style={{fontSize: 12}}>SHOP LEAVE DATE </Text>
          </TouchableOpacity>
        </View>
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
              ordersKey.map(key =>
                orders[key].status == true ? (
                  <BulkOrderCard
                    key={key}
                    bulkItem={orders[key]}
                    id={key}
                    {...this.props}
                    removeData={this.showAlert}
                  />
                ) : null,
              )
            ) : (
              <Text>No Orders</Text>
            )}
          </View>
        </ScrollView>

        <CustomAlert
          title="Conformation!"
          message="This order completed"
          confirmText="Yes,"
          {...this.props}
          hideAlert={this.hideAlert}
          showAlert={showAlert}
          confirmAlert={this.confirmAlert}
        />
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
    // position: 'absolute',
    // backgroundColor: 'red',
    bottom: 0,
    right: 0,
    paddingTop: 10,
    paddingBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  btn: {
    padding: 10,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    // marginRight: 1,
  },
});
