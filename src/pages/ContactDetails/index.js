import React, {useState, Component} from 'react';
import {
  Button,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  Image,
  Dimensions,
} from 'react-native';
import FIREBASE from '../../config/FIREBASE';

export default class Details extends Component {
  constructor(props) {
    super(props);

    // console.log(Dimensions.get('window').width);

    this.state = {
      Foods: {},
      MenuToggled: {},
      BulkOrderToggled: {},
    };
  }

  MenuToggleSwitch = value => {
    this.setState({MenuToggled: value});
    const UpdateBulkOrder = FIREBASE.database().ref(
      'contact/' + this.props.route.params.id,
    );
    const MenuFoodsStatus = {
      MenuFoodStatus: value,
    };

    UpdateBulkOrder.update(MenuFoodsStatus)
      .then(data => {})

      .catch(error => {
        console.log('Error :', error);
      });
  };

  BulOrderToggleSwitch = value => {
    this.setState({BulkOrderToggled: value});
    const UpdateBulkOrder = FIREBASE.database().ref(
      'contact/' + this.props.route.params.id,
    );
    const BulkOrderStatus = {
      BulkFoodStatus: value,
    };

    UpdateBulkOrder.update(BulkOrderStatus)
      .then(data => {})

      .catch(error => {
        console.log('Error :', error);
      });
  };
  componentDidMount() {
    FIREBASE.database()
      .ref('contact/' + this.props.route.params.id)
      .once('value', querySnapShot => {
        let data = querySnapShot.val() ? querySnapShot.val() : {};
        let foodItem = {...data};

        this.setState({
          Foods: foodItem,
        });

        const {Foods} = this.state;
        this.setState({
          MenuToggled: Foods.MenuFoodStatus,
          BulkOrderToggled: Foods.BulkFoodStatus,
        });
      });
  }

  render() {
    const {Foods} = this.state;

    return (
      <View>
        <Image
          style={styles.img}
          source={{
            uri: Foods.imgUrl,
          }}
        />
        <View style={styles.header}>
          <Text style={styles.items}>{Foods.name}</Text>
          <Text style={styles.description}>Rs :{Foods.unitPrice}</Text>
          <Text style={styles.description}>{Foods.description}</Text>
        </View>
        <View style={styles.switchContainer}>
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Show in Bulk Order</Text>
            <Switch
              onValueChange={this.BulOrderToggleSwitch}
              value={this.state.BulkOrderToggled}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Show in Menu</Text>
            <Switch
              onValueChange={this.MenuToggleSwitch}
              value={this.state.MenuToggled}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'rgba(4, 6, 31, 0.75)',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 20,
    top: -50,
  },

  switchContainer: {
    backgroundColor: 'rgba(4, 6, 31, 0.75)',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 20,
    top:-20
  },

  img: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
  },
  items: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
  },

  switchText: {fontSize: 14, padding: 10, color: 'white'},

  description: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
