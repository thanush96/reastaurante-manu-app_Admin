import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SeatReservationHome} from '../pages';

const Stack = createStackNavigator();

const SeatReservation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Seat Reservations"
        component={SeatReservationHome}
      />
    </Stack.Navigator>
  );
};

export default SeatReservation;
