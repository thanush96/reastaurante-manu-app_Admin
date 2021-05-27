import React, {Component} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import {InputData} from '../../components';
import FIREBASE from '../../config/FIREBASE';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
import {Picker} from '@react-native-picker/picker';
import COLORS from '../../components/colors/color';
import WarningMessage from '../../components/Alert/warningMessage';

export default class Edit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      unitPrice: '',
      description: '',
      image: '',
      imageurl: null,
      categoryValue: '',
      uploading: false,
      imageChoosed: false,
      transferred: 0,
      dataSource: [],
      showAlert: false,
      successAlertMsg: false,
      nameVal: false,
      priceVal: false,
      descriptionVal: false,
      categoryVal: false,
      priceNumVal: false,
      dublicateAtert: false,
      itemNameInLastTime: '',
      ExistFood: [],
    };
  }
  async get_firebase_list() {
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

  async get_Exist_Food_Name() {
    return FIREBASE.database()
      .ref('contact')
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

  async componentWillMount() {
    this.setState({
      dataSource: await this.get_firebase_list(),
      ExistFood: await this.get_Exist_Food_Name(),
    });
  }

  componentDidMount() {
    FIREBASE.database()
      .ref('contact/' + this.props.route.params.id)
      .once('value', querySnapShot => {
        let data = querySnapShot.val() ? querySnapShot.val() : {};
        let contactItem = {...data};

        this.setState({
          name: contactItem.name,
          unitPrice: contactItem.unitPrice,
          description: contactItem.description,
          imageurl: contactItem.imgUrl,
          categoryValue: contactItem.category,
          itemNameInLastTime: contactItem.name,
        });
      });
  }

  onChangeText = (nameState, value) => {
    this.setState({
      [nameState]: value,
    });
  };

  onSubmit = imageUrl => {
    const AddContact = FIREBASE.database().ref(
      'contact/' + this.props.route.params.id,
    );
    const contact = {
      name: this.state.name,
      category: this.state.categoryValue,
      unitPrice: this.state.unitPrice,
      description: this.state.description,
      imgUrl: imageUrl,
    };

    AddContact.update(contact)
      .then(data => {
        // CUSTOM ALERT MESSAGE
        this.successShowAlert();
        console.log('updated');
      })

      .catch(error => {
        console.log('Error :', error);
      });
  };

  selectImage = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};
        this.setState({image: source, imageChoosed: true});
      }
    });
  };

  uploadImage = async () => {
    const {uri} = this.state.image;
    let duplicate = false;
    if (this.state.name) {
      this.state.ExistFood.map((item, index) => {
        if (item.name === this.state.name) {
          duplicate = true;
        }
      });
    }

    if (this.state.imageChoosed) {
      if (this.state.name) {
        if (this.state.unitPrice) {
          if (this.state.description) {
            if (this.state.categoryValue) {
              if (!isNaN(this.state.unitPrice)) {
                if (this.state.itemNameInLastTime == this.state.name) {
                  console.log('Same Food Name');
                  const filename = uri.substring(uri.lastIndexOf('/') + 1);
                  const uploadUri =
                    Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
                  this.setState({uploading: true});
                  this.setState({transferred: 0});
                  const task = storage().ref(filename).putFile(uploadUri);
                  // set progress state
                  task.on('state_changed', snapshot => {
                    this.setState({
                      transferred:
                        Math.round(
                          snapshot.bytesTransferred / snapshot.totalBytes,
                        ) * 10000,
                    });
                  });
                  try {
                    await task;
                    const imageRef = storage().ref(filename);
                    const url = await imageRef.getDownloadURL();
                    console.log(url);
                    this.onSubmit(url);
                  } catch (e) {
                    console.error(('error', e));
                  }
                  this.setState({uploading: false, imageChoosed: false});
                } else {
                  console.log('Deferent Food Name');
                  if (!duplicate) {
                    const filename = uri.substring(uri.lastIndexOf('/') + 1);
                    const uploadUri =
                      Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
                    this.setState({uploading: true});
                    this.setState({transferred: 0});
                    const task = storage().ref(filename).putFile(uploadUri);
                    // set progress state
                    task.on('state_changed', snapshot => {
                      this.setState({
                        transferred:
                          Math.round(
                            snapshot.bytesTransferred / snapshot.totalBytes,
                          ) * 10000,
                      });
                    });
                    try {
                      await task;
                      const imageRef = storage().ref(filename);
                      const url = await imageRef.getDownloadURL();
                      console.log(url);
                      this.onSubmit(url);
                    } catch (e) {
                      console.error(('error', e));
                    }
                    this.setState({uploading: false, imageChoosed: false});
                  } else {
                    this.showDublicateAlert();
                  }
                }
              } else {
                this.showPriceNumValAlert();
              }
            } else {
              this.showCategoryValAlert();
            }
          } else {
            this.showDescriptionValAlert();
          }
        } else {
          this.showPriceValAlert();
        }
      } else {
        this.showNameValAlert();
      }
    } else {
      if (this.state.name) {
        if (this.state.unitPrice) {
          if (this.state.description) {
            if (this.state.categoryValue) {
              if (!isNaN(this.state.unitPrice)) {
                if (this.state.itemNameInLastTime == this.state.name) {
                  this.onSubmit(this.state.imageurl);
                } else {
                  if (!duplicate) {
                    this.onSubmit(this.state.imageurl);
                  } else {
                    this.showDublicateAlert();
                  }
                }
              } else {
                this.showPriceNumValAlert();
              }
            } else {
              this.showCategoryValAlert();
            }
          } else {
            this.showDescriptionValAlert();
          }
        } else {
          this.showPriceValAlert();
        }
      } else {
        this.showNameValAlert();
      }

      // if (
      //   this.state.name &&
      //   this.state.unitPrice &&
      //   this.state.description &&
      //   this.state.categoryValue &&
      //   !isNaN(this.state.unitPrice)
      // ) {
      //   this.onSubmit(this.state.imageurl);
      // } else {
      //   this.showAlert();
      //   console.log('Please input feild');
      // }
    }
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
    this.props.navigation.navigate('Menus');
  };

  // VALIATION ALERT MESSAGE FUNCTIONS
  //NAME ALERT FUNCTIONS
  showNameValAlert = () => {
    this.setState({
      nameVal: true,
    });
  };

  hideNameValAlert = () => {
    this.setState({
      nameVal: false,
    });
  };

  //NAME ALERT FUNCTIONS
  showPriceValAlert = () => {
    this.setState({
      priceVal: true,
    });
  };

  hidePriceValAlert = () => {
    this.setState({
      priceVal: false,
    });
  };

  //NAME ALERT FUNCTIONS
  showDescriptionValAlert = () => {
    this.setState({
      descriptionVal: true,
    });
  };

  hideDescriptionValAlert = () => {
    this.setState({
      descriptionVal: false,
    });
  };

  //NAME ALERT FUNCTIONS
  showCategoryValAlert = () => {
    this.setState({
      categoryVal: true,
    });
  };

  hideCategoryValAlert = () => {
    this.setState({
      categoryVal: false,
    });
  };

  //NAME ALERT FUNCTIONS
  showPriceNumValAlert = () => {
    this.setState({
      priceNumVal: true,
    });
  };

  hidePriceNumValAlert = () => {
    this.setState({
      priceNumVal: false,
    });
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
    const {
      successAlertMsg,
      nameVal,
      priceVal,
      descriptionVal,
      categoryVal,
      priceNumVal,
      dublicateAtert,
    } = this.state;
    return (
      <SafeAreaView style={styles.conatiner}>
        <View style={styles.header}>
          <Image
            style={styles.img}
            source={{
              uri: this.state.imageurl,
            }}
          />
        </View>

        <View style={styles.pages}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <InputData
              label="Food"
              placeholder="Food Name Here"
              onChangeText={this.onChangeText}
              value={this.state.name}
              nameState="name"
            />

            <InputData
              label="Rs:"
              placeholder="Unit Price Here"
              keyboardType="number-pad"
              onChangeText={this.onChangeText}
              value={this.state.unitPrice}
              nameState="unitPrice"
            />

            <InputData
              label="Description"
              placeholder="Description here"
              onChangeText={this.onChangeText}
              value={this.state.description}
              nameState="description"
            />
            <Text style={{color: 'white', marginBottom: 5}}>Category</Text>
            <View style={styles.card}>
              <Picker
                style={{color: 'white'}}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({categoryValue: itemValue})
                }>
                <Picker.Item
                  label={this.state.categoryValue}
                  value={this.state.categoryValue}
                  style={{
                    color: 'grey',
                    fontSize: 14,
                  }}
                />
                {this.state.dataSource.map((item, index) => {
                  return (
                    <Picker.Item
                      label={item.categoryName}
                      value={item.categoryName}
                      key={index}
                    />
                  );
                })}
              </Picker>
            </View>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={this.selectImage}>
              <Text style={styles.buttonText}>Pick an image</Text>
            </TouchableOpacity>

            {this.state.imageChoosed ? (
              <View style={styles.imgcontainer}>
                {this.state.imageurl !== null ? (
                  <Image
                    source={{uri: this.state.image.uri}}
                    style={styles.imageBox}
                  />
                ) : null}
              </View>
            ) : null}

            {this.state.uploading ? (
              <View style={styles.progressBarContainer}>
                <Progress.Bar progress={this.state.transferred} width={300} />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={this.uploadImage}>
                <Text style={styles.buttonText}>Update Menu</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        <WarningMessage
          title="Successfull!"
          message="Your Menu Updated"
          hideAlert={this.hideAlertSuccessMsg}
          showAlert={successAlertMsg}
        />

        <WarningMessage
          title="Sorry!"
          message="Please Input Food Name"
          hideAlert={this.hideNameValAlert}
          showAlert={nameVal}
        />

        <WarningMessage
          title="Sorry!"
          message="Please Input Food Price"
          hideAlert={this.hidePriceValAlert}
          showAlert={priceVal}
        />

        <WarningMessage
          title="Sorry!"
          message="Price Should be Number, Plesae Input Number Type Only in Price Field"
          hideAlert={this.hidePriceNumValAlert}
          showAlert={priceNumVal}
        />

        <WarningMessage
          title="Sorry!"
          message="Please Input Description About The Food"
          hideAlert={this.hideDescriptionValAlert}
          showAlert={descriptionVal}
        />

        <WarningMessage
          title="Sorry!"
          message="Please Choose Food Category"
          hideAlert={this.hideCategoryValAlert}
          showAlert={categoryVal}
        />

        <WarningMessage
          title="Sorry!"
          message="This Food Name is Already Exist, Please Change Food Name"
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
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginHorizontal: 15,
  },
  img: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
  },
  card: {
    borderWidth: 1,
    borderColor: 'white',
    color: 'black',
    borderRadius: 5,
  },
  selectButton: {
    backgroundColor: '#15227A',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },

  progressBarContainer: {
    margin: 10,
  },

  imgcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageBox: {
    width: 100,
    height: 100,
    borderRadius: 5,
    backgroundColor: '#D0D0D0',
  },
});
