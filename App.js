import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import BottomNavigator from './src/index';
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

// import Router from './router';

const Stack = createStackNavigator();

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Router />
//     </NavigationContainer>
//   );
// };

// export default App;

const App = () => {
  return (
    <NavigationContainer>
      {/* <StatusBar backgroundColor={'#ffa500'} barStyle="light-content" /> */}
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Navigation-bar" component={BottomNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

import React, {Component} from 'react';
import {StyleSheet, Text, View, Switch, Alert} from 'react-native';
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      SwitchOnValueHolder: false,
    };
  }
  ShowAlert = value => {
    this.setState({
      SwitchOnValueHolder: value,
    });
    if (value == true) {
      Alert.alert('You have truned ON the Switch.');
      
    } else {
      Alert.alert('You have turned OFF the Switch.');
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Switch
          onValueChange={value => this.ShowAlert(value)}
          value={this.state.SwitchOnValueHolder}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#afff63',
  },
  text: {fontSize: 19, color: '#000000'},
});
