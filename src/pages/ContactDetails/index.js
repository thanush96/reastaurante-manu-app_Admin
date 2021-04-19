import React, {Component} from 'react';
import {Text, View} from 'react-native';
import FIREBASE from '../../config/FIREBASE';

export default class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contact: {},
    };
  }

  componentDidMount() {
    FIREBASE.database()
      .ref('contact/' + this.props.route.params.id)
      .once('value', querySnapShot => {
        let data = querySnapShot.val() ? querySnapShot.val() : {};
        let contactItem = {...data};

        this.setState({
          contact: contactItem,
        });
      });
  }
  render() {
    const {contact} = this.state;
    return (
      <View>
        <Text>{contact.name}</Text>
        <Text>{contact.age}</Text>
        <Text>{contact.address}</Text>
      </View>
    );
  }
}
