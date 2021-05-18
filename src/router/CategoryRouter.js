import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {categoryAdd, categoryHome, categoryEdit} from '../pages';
import COLORS from '../components/colors/color';

const Stack = createStackNavigator();

const CategoryRouter = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Category"
        component={categoryHome}
        options={{
          title: 'Food Category',

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
        name="categoryAdd"
        component={categoryAdd}
        options={{
          title: 'Add Category',

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
        name="categoryEdit"
        component={categoryEdit}
        options={{
          title: 'Edit Category',

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

export default CategoryRouter;
