import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {BulkOrderHome, Orders} from '../pages';
import COLORS from '../components/colors/color';

const Stack = createStackNavigator();

const BulkOrdersRouter = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Order Queue"
        component={BulkOrderHome}
        options={{
          title: 'Orders',

          headerStyle: {
            backgroundColor: COLORS.dark,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="Orders"
        component={Orders}
        options={{
          title: 'Past Orders',

          headerStyle: {
            backgroundColor: COLORS.dark,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default BulkOrdersRouter;
