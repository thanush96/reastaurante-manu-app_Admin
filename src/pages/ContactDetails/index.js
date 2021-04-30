import React, {Component} from 'react';
import {
  Button,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import FIREBASE from '../../config/FIREBASE';

export default class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Foods: {},
    };
  }

  componentDidMount() {
    FIREBASE.database()
      .ref('contact/' + this.props.route.params.id)
      .once('value', querySnapShot => {
        let data = querySnapShot.val() ? querySnapShot.val() : {};
        let foodItem = {...data};

        this.setState({
          Foods: foodItem,
        });
      });
  }

  ActiveBulkOrder() {
    console.log('Hello');
    const UpdateBulkOrder = FIREBASE.database().ref(
      'contact/' + this.props.route.params.id,
    );
    const BulkOrderStatus = {
      BulkFoodStatus: 'Active',
    };

    UpdateBulkOrder.update(BulkOrderStatus)
      .then(data => {
        Alert.alert('Success', 'Activated');
        this.componentDidMount();
      })

      .catch(error => {
        console.log('Error :', error);
      });
  }

  InactiveBulkOrder() {
    console.log('Hello');
    const UpdateBulkOrder = FIREBASE.database().ref(
      'contact/' + this.props.route.params.id,
    );
    const BulkOrderStatus = {
      BulkFoodStatus: 'Inactive',
    };

    UpdateBulkOrder.update(BulkOrderStatus)
      .then(data => {
        Alert.alert('Success', 'Inactivated');
        this.componentDidMount();
      })

      .catch(error => {
        console.log('Error :', error);
      });
  }
  MenuActive() {
    console.log('Hello');
    const UpdateBulkOrder = FIREBASE.database().ref(
      'contact/' + this.props.route.params.id,
    );
    const BulkOrderStatus = {
      MenuFoodStatus: 'Active',
    };

    UpdateBulkOrder.update(BulkOrderStatus)
      .then(data => {
        Alert.alert('Success', 'Activated');
        this.componentDidMount();
      })

      .catch(error => {
        console.log('Error :', error);
      });
  }

  MenuInactive() {
    console.log('Hello');
    const UpdateBulkOrder = FIREBASE.database().ref(
      'contact/' + this.props.route.params.id,
    );
    const BulkOrderStatus = {
      MenuFoodStatus: 'Inactive',
    };

    UpdateBulkOrder.update(BulkOrderStatus)
      .then(data => {
        Alert.alert('Success', 'Inactivated');
        this.componentDidMount();
      })

      .catch(error => {
        console.log('Error :', error);
      });
  }

  render() {
    const {Foods} = this.state;
    return (
      <View style={styles.pages}>
        <Text>{Foods.name}</Text>
        <Text>Rs :{Foods.age}</Text>
        <Text>{Foods.address}</Text>
        {Foods.BulkFoodStatus == 'Active' ? (
          <TouchableOpacity
            style={styles.touch}
            onPress={() => this.InactiveBulkOrder()}>
            <Text style={styles.submit}>Inactive Order</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.touch}
            onPress={() => this.ActiveBulkOrder()}>
            <Text style={styles.submit}>Active Order</Text>
          </TouchableOpacity>
        )}

        {Foods.MenuFoodStatus == 'Active' ? (
          <TouchableOpacity
            style={styles.touch}
            onPress={() => this.MenuInactive()}>
            <Text style={styles.submit}>Inactive Menu</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.touch}
            onPress={() => this.MenuActive()}>
            <Text style={styles.submit}>Active Menu</Text>
          </TouchableOpacity>
        )}
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
