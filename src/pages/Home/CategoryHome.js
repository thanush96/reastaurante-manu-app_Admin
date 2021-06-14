import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
  Dimensions,
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
      contact: {},
      contactKey: [],
      showAlert: false,
      getId: '',
      getName: '',
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
    this.MountFoods();
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

  MountFoods() {
    // console.log('MountFoods');
    FIREBASE.database()
      .ref('contact')
      .once('value', querySnapShot => {
        let data = querySnapShot.val() ? querySnapShot.val() : {};
        let contactItem = {...data};

        this.setState({
          contact: contactItem,
          contactKey: Object.keys(contactItem),
        });
      });
  }

  // ALERT FUNCTIONS
  showAlert = (id, name) => {
    this.setState({
      showAlert: true,
      getId: id,
      getName: name,
    });
  };

  confirmAlert = () => {
    console.log('confirmAlert');
    console.log(this.state.getName);
    FIREBASE.database()
      .ref('categories/' + this.state.getId)
      .remove();
    this.componentUpdateFoodCategory();
    this.MountData();
    this.setState({
      showAlert: false,
    });
  };

  componentUpdateFoodCategory() {
    // console.log('this.componentUpdateFoodCategory()');
    let source = [];
    let keys = [];
    this.state.contactKey.map(key => {
      keys.push(key);
      let arr = [];
      for (let i = 0; i < this.state.contact[key].category.length; i++) {
        if (this.state.contact[key].category[i] == this.state.getName) {
        } else {
          arr.push(this.state.contact[key].category[i]);
        }
      }
      source.push(arr);
    });

    console.log(source);

    for (let i = 0; i < keys.length; i++) {
      const AddCategory = FIREBASE.database().ref('contact/' + keys[i]);

      const category = {
        category: source[i],
      };
      console.log(AddCategory, category);
      AddCategory.update(category)
        .then(data => {
          // console.log('Update All Food Category');
        })
        .catch(error => {
          console.log('Error :', error);
        });
    }
  }

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
              <View
                style={{
                  height: Dimensions.get('window').width,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>Sorry! No Foods Available</Text>
              </View>
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
