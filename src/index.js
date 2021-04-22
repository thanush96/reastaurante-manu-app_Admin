import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import menuRouter from './router/MenuRouter';
import categoryRouter from './router/CategoryRouter';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: {
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          height: 50,
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: '#ff0000',
        },
        showLabel: true,
        activeTintColor: '#ff0000',
      }}>
      <Tab.Screen
        name="Home"
        component={menuRouter}
        options={{
          tabBarIcon: ({color}) => <FontAwesomeIcon icon={faPlus} size={20} />,
        }}
      />

      <Tab.Screen
        name="category"
        component={categoryRouter}
        options={{
          tabBarIcon: ({color}) => <FontAwesomeIcon icon={faPlus} size={20} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
