import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import FIREBASE from '../../config/FIREBASE';
import CategoryCard from '../../components/CartContact/categoryCard';
import CustomAlert from '../../components/Alert/deleteAlert';
import COLORS from '../../components/colors/color';

export default class CategoryHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: {},
      categoryKey: [],
      showAlert: false,
      getId: '',
      refreshing: false,
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
    console.log('refreshing');
    FIREBASE.database()
      .ref('categories')
      .once('value', querySnapShot => {
        let data = querySnapShot.val() ? querySnapShot.val() : {};
        let categoryItem = {...data};

        this.setState({
          category: categoryItem,
          categoryKey: Object.keys(categoryItem),
          refreshing: false,
        });
      });
  }

  // ALERT FUNCTIONS
  showAlert = id => {
    this.setState({
      showAlert: true,
      getId: id,
    });
  };

  confirmAlert = () => {
    console.log('confirmAlert');
    FIREBASE.database()
      .ref('categories/' + this.state.getId)
      .remove();
    this.MountData();
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

  // REFRESH FUNCTION
  _onRefresh = () => {
    this.setState({refreshing: true});
    // this.componentDidMount();
    this.MountData();
  };

  render() {
    const {category, categoryKey, showAlert} = this.state;
    return (
      <View style={styles.page}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <View style={styles.listContact}>
            {categoryKey.length > 0 ? (
              categoryKey.map(key => (
                <CategoryCard
                  key={key}
                  categoryItem={category[key]}
                  id={key}
                  {...this.props}
                  removeData={this.showAlert}
                />
              ))
            ) : (
              <Text>No Items</Text>
            )}
          </View>
        </ScrollView>
        <View style={styles.wrapperButton}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => this.props.navigation.navigate('categoryAdd')}>
            <FontAwesomeIcon icon={faPlus} size={20} />
          </TouchableOpacity>
        </View>

        {/* DELETE CONFORMATION ALERT */}
        <CustomAlert
          title="Category Delete"
          message="Are you sure for delete"
          confirmText="Yes, Delete"
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
    flex: 1,
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
    backgroundColor: COLORS.secondary,
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
});
