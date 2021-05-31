import React, {Component} from 'react';
import {View} from 'react-native';
import MultipleChoice from 'react-native-multiple-choice';
import PropTypes from 'prop-types'

export default class tag extends Component {
  render() {
    return (
      <View>
        <MultipleChoice
          options={[
            'Lorem ipsum dolor sit',
            'Lorem ipsum',
            'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
            'Lorem ipsum dolor sit amet, consetetur',
            'Lorem ipsum dolor',
          ]}
          selectedOptions={['Lorem ipsum']}
          maxSelectedOptions={2}
          onSelection={option => alert(option + ' was selected!')}
        />
      </View>
    );
  }
}
