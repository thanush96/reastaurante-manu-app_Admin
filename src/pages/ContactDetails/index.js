import React, {Component} from 'react';
import {
  Button,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import FIREBASE from '../../config/FIREBASE';

export default class Details extends Component {
  constructor(props) {
    super(props);

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
      <View style={styles.pages}>
        <Text>{Foods.name}</Text>
        <Text>Rs :{Foods.age}</Text>
        <Text>{Foods.address}</Text>

        <Text>Bulk Order Availablity</Text>
        <Switch
          onValueChange={this.BulOrderToggleSwitch}
          value={this.state.BulkOrderToggled}
        />

        <Text>Availablity</Text>
        <Switch
          onValueChange={this.MenuToggleSwitch}
          value={this.state.MenuToggled}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pages: {
    flex: 1,
    padding: 30,
  },
  touch: {
    backgroundColor: 'black',
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
