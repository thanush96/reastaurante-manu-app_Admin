import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import menuRouter from './router/MenuRouter';
import BulkOrdersRouter from './router/bulkOrdersRouter';
import SeatReservation from './router/SeatReservation';
import categoryRouter from './router/CategoryRouter';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faBookmark,
  faHome,
  faList,
  faUserLock,
} from '@fortawesome/free-solid-svg-icons';

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
          backgroundColor: '#3399ff',
        },
        showLabel: true,
        activeTintColor: '#003300',
      }}>
      <Tab.Screen
        name="Home"
        component={menuRouter}
        options={{
          tabBarIcon: ({color}) => <FontAwesomeIcon icon={faHome} size={20} />,
        }}
      />

      <Tab.Screen
        name="category"
        component={categoryRouter}
        options={{
          tabBarIcon: ({color}) => <FontAwesomeIcon icon={faList} size={20} />,
        }}
      />

      <Tab.Screen
        name="BulkOrders"
        component={BulkOrdersRouter}
        options={{
          tabBarIcon: ({color}) => (
            <FontAwesomeIcon icon={faBookmark} size={20} />
          ),
        }}
      />

      <Tab.Screen
        name="SeatReservation"
        component={SeatReservation}
        options={{
          tabBarIcon: ({color}) => (
            <FontAwesomeIcon icon={faUserLock} size={20} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
