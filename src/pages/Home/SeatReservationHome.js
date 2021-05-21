import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import FIREBASE from '../../config/FIREBASE';
import SeatReservationCard from '../../components/CartContact/SeatReservationCard';
import OtpInputData from '../../components/InputData/otpInputBox';
import CustomAlert from '../../components/Alert/deleteAlert';
import COLORS from '../../components/colors/color';


export default class BulkOrderHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reservations: {},
      reservationKey: [],
      userOtp: '',
      showAlert: false,
      getId: '',
    };
  }


  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.MountData();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  MountData() {
    FIREBASE.database()
      .ref('Seat_Reservation')
      .once('value', querySnapShot => {
        let data = querySnapShot.val() ? querySnapShot.val() : {};
        let reservatedSeats = {...data};

        this.setState({
          reservations: reservatedSeats,
          reservationKey: Object.keys(reservatedSeats),
        });

        this.state.reservationKey.map(key =>
          // console.log(this.state.reservations[key].otp),
          this.setState({storedOtp: this.state.reservations[key].otp}),
        );
      });
  }

  onChangeText = (nameState, Value) => {
    this.setState({
      [nameState]: Value,
    });
  };

  // OTP FEILD RESET AND ACCESS
  reset = () => {
    this.setState({
      reservations: {},
      reservationKey: [],
      userOtp: '',
    });

    this.MountData();
  };

  // ALERT FUNCTIONS
  showAlert = id => {
    this.setState({
      showAlert: true,
      getId: id,
    });
  };

  confirmAlert = () => {
    console.log('confirmAlert', this.state.getId);
    // WRITE UPDATE FUNCTION
    const AddStatus = FIREBASE.database().ref(
      'Seat_Reservation/' + this.state.getId,
    );
    const status = {
      status: false,
    };

    AddStatus.update(status);
    this.reset();

    this.setState({
      showAlert: false,
    });
  };

  hideAlert = () => {
    console.log('hide');
    this.setState({
      showAlert: false,
    });
  };

  render() {
    const {reservations, reservationKey, showAlert} = this.state;
    return (
      <View keyboardShouldPersistTaps="handled">
        <View style={styles.otpInputBox}>
          <OtpInputData
            placeholder=""
            onChangeText={this.onChangeText}
            value={this.state.userOtp}
            nameState="userOtp"
            keyboardType="number-pad"
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.page}>
            {reservationKey.length > 0
              ? reservationKey.map(key =>
                  reservations[key].otp == this.state.userOtp &&
                  reservations[key].status == true ? (
                    <SeatReservationCard
                      key={key}
                      seatReservation={reservations[key]}
                      id={key}
                      {...this.props}
                      reserved={this.showAlert}
                    />
                  ) : null,
                )
              : null}
          </View>
        </ScrollView>

        <View style={styles.otpInputBox}>
          <TouchableOpacity
            style={styles.touch}
            onPress={() => this.reset()}
            keyboardShouldPersistTaps={'always'}>
          <Text style={styles.submit}>RESET OTP</Text>
          </TouchableOpacity>
        </View>

        <CustomAlert
          title="Cofirmation"
          message="Are you sure for access"
          confirmText="Yes"
          {...this.props}
          hideAlert={this.hideAlert}
          showAlert={showAlert}
          confirmAlert={this.confirmAlert}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 0,
    paddingHorizontal: 20,
    marginTop: 50,
  },

  otpInputBox: {
    marginTop: 50,
    alignItems: 'stretch',
    paddingHorizontal: 70,
  },

  header: {
    paddingHorizontal: 30,
    paddingTop: 30,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  grid: {
    borderWidth: 1,
    marginTop: 10,
  },

  listContact: {
    paddingHorizontal: 30,
    marginTop: 20,
  },
  wrapperButton: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 30,
  },

  btn: {
    padding: 20,
    backgroundColor: '#3399ff',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  touch: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 50,
  },
  submit: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },

  text: {
    color: '#fff',
    fontSize: 15,
  },
});
