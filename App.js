import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import BottomNavigator from './src/index';

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
