import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {BulkOrderHome} from '../pages';

const Stack = createStackNavigator();

const BulkOrdersRouter = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Order Queue" component={BulkOrderHome} />
    </Stack.Navigator>
  );
};

export default BulkOrdersRouter;
