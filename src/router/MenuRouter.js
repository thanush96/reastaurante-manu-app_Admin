import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Home, Add, Details, Edit} from '../pages';

const Stack = createStackNavigator();

const Router = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Menus" component={Home} />
      <Stack.Screen name="Add" component={Add} />
      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen name="Edit" component={Edit} />
    </Stack.Navigator>
  );
};

export default Router;
