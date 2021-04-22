import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {categoryAdd, categoryHome,categoryEdit} from '../pages';

const Stack = createStackNavigator();

const CategoryRouter = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="categoryHome" component={categoryHome} />
      <Stack.Screen name="categoryAdd" component={categoryAdd} />
      <Stack.Screen name="categoryEdit" component={categoryEdit} />
    </Stack.Navigator>
  );
};

export default CategoryRouter;
