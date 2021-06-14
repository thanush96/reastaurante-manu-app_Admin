import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import {InputData} from '../../components';
import WarningMessage from '../../components/Alert/warningMessage';
import COLORS from '../../components/colors/color';
import FIREBASE from '../../config/FIREBASE';

export default class categoryEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contact: {},
      contactKey: [],
      Name: '',
      showAlert: false,
      successAlertMsg: false,
      dublicateAtert: false,
      categoryNameInLastTime: '',
      existCategories: [],
      dataSource: [],
    };
  }

  async get_Exist_Category_Name() {
    return FIREBASE.database()
      .ref('categories')
      .once('value')
      .then(function (snapshot) {
        var items = [];
        snapshot.forEach(function (childSnapshot) {
          var childKey = childSnapshot.key;
          var childData = childSnapshot.val();
          items.push(childData);
        });
        return items;
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

  async componentWillMount() {
    this.setState({
      existCategories: await this.get_Exist_Category_Name(),
      // dataSource: await this.get_firebase_list(),
    });
  }

  componentDidMount() {
    this.MountFoods();
    FIREBASE.database()
      .ref('categories/' + this.props.route.params.id)
      .once('value', querySnapShot => {
        let data = querySnapShot.val() ? querySnapShot.val() : {};
        let categoryItem = {...data};

        this.setState({
          Name: categoryItem.categoryName,
          categoryNameInLastTime: categoryItem.categoryName,
        });
      });
  }

  componentUpdateFoodCategory() {
    // console.log('this.componentUpdateFoodCategory()');
    let source = [];
    let keys = [];
    this.state.contactKey.map(key => {
      keys.push(key);
      let arr = [];
      for (let i = 0; i < this.state.contact[key].category.length; i++) {
        if (
          this.state.contact[key].category[i] ==
          this.state.categoryNameInLastTime
        ) {
          arr.push(this.state.Name);
        } else {
          arr.push(this.state.contact[key].category[i]);
        }
      }
      source.push(arr);
    });

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

  onChangeText = (nameState, value) => {
    this.setState({
      [nameState]: value,
    });
  };

  category = () => {
    console.log(this.state.dataSource);
    this.state.dataSource.map((item, key) => {
      for (let i = 0; i < item.category.length; i++) {
        if (item.category[i] == this.state.Name) {
          console.log(item.category[i]);
        }
      }
    });
  };

  onSubmit = () => {
    let duplicate = false;
    if (this.state.Name) {
      this.state.existCategories.map((item, index) => {
        if (item.categoryName === this.state.Name) {
          duplicate = true;
        }
      });
    }

    if (this.state.Name) {
      if (this.state.categoryNameInLastTime == this.state.Name) {
        const AddCategory = FIREBASE.database().ref(
          'categories/' + this.props.route.params.id,
        );
        const category = {
          categoryName: this.state.Name,
        };

        AddCategory.update(category)
          .then(data => {
            this.componentUpdateFoodCategory();
            this.successShowAlert();
          })

          .catch(error => {
            console.log('Error :', error);
          });
      } else {
        if (!duplicate) {
          const AddCategory = FIREBASE.database().ref(
            'categories/' + this.props.route.params.id,
          );
          const category = {
            categoryName: this.state.Name,
          };

          AddCategory.update(category)
            .then(data => {
              this.componentUpdateFoodCategory();
              this.successShowAlert();
            })

            .catch(error => {
              console.log('Error :', error);
            });
        } else {
          this.showDublicateAlert();
        }
      }
    } else {
      this.showAlert();
    }
  };

  // ALERT FUNCTIONS
  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  // SUCCESSFULL ALERT FUNCTIONS
  successShowAlert = () => {
    this.setState({
      successAlertMsg: true,
    });
  };

  hideAlertSuccessMsg = () => {
    this.setState({
      successAlertMsg: false,
    });
    this.props.navigation.navigate('Category');
  };

  //DUBLICATE ALERT FUNCTIONS
  showDublicateAlert = () => {
    this.setState({
      dublicateAtert: true,
    });
  };

  hideDublicateAlert = () => {
    this.setState({
      dublicateAtert: false,
    });
  };

  render() {
    const {showAlert, successAlertMsg, dublicateAtert} = this.state;

    return (
      <SafeAreaView style={styles.conatiner}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.title}>
              <Text style={styles.headerText}>Edit Category</Text>
            </View>
          </View>
          <View style={styles.pages}>
            <InputData
              label="Category Name"
              placeholder="Category Name here"
              onChangeText={this.onChangeText}
              value={this.state.Name}
              nameState="Name"
            />

            <TouchableOpacity
              style={styles.touch}
              // onPress={() => this.componentUpdateFoodCategory()}>
              onPress={() => this.onSubmit()}>
              <Text style={styles.submit}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <WarningMessage
          title="Sorry!"
          message="Please input category name"
          hideAlert={this.hideAlert}
          showAlert={showAlert}
        />

        <WarningMessage
          title="Successfull!"
          message="Success Your Category Update "
          hideAlert={this.hideAlertSuccessMsg}
          showAlert={successAlertMsg}
        />

        <WarningMessage
          title="Sorry!"
          message="This Category Name is Already Exist, Please Change Category Name"
          hideAlert={this.hideDublicateAlert}
          showAlert={dublicateAtert}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  conatiner: {flex: 1, backgroundColor: 'white'},
  header: {
    height: 200,
  },
  pages: {
    flex: 1,
    padding: 30,
    backgroundColor: 'rgba(4, 6, 31, 0.75)',
    borderRadius: 15,
    marginHorizontal: 15,
  },
  title: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
    backgroundColor: COLORS.secondary,
  },

  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    top: Dimensions.get('window').width / 4,
  },

  touch: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  submit: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
