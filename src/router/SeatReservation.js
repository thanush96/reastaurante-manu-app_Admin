import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SeatReservationHome} from '../pages';
import COLORS from '../components/colors/color';


const Stack = createStackNavigator();

const SeatReservation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Seat Reservations"
        component={SeatReservationHome}
        options={{
          title: 'Reserved Seats',

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

export default SeatReservation;
