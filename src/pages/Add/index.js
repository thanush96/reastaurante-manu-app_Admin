import React, {Component, useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
import {InputData} from '../../components';
import {Picker} from '@react-native-picker/picker';
import FIREBASE from '../../config/FIREBASE';
import COLORS from '../../components/colors/color';
import WarningMessage from '../../components/Alert/warningMessage';

export default class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      unitPrice: '',
      description: '',
      image: '',
      imageChoosed: false,
      uploading: false,
      transferred: 0,
      categoryValue: '',
      categoryValue2: '',
      categoryValue3: '',
      categoryValue4: '',
      categoryValue5: '',
      cat: [],
      dataSource: [],
      ExistFood: [],
      showAlert: false,
      successAlertMsg: false,
      dublicateAtert: false,
      nameVal: false,
      priceVal: false,
      descriptionVal: false,
      categoryVal: false,
      imageVal: false,
      priceNumVal: false,
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

  onChangeText = (nameState, value) => {
    this.setState({
      [nameState]: value,
    });
  };

  onSubmit = imageUrl => {
    console.log('onSubmit Function');
    // var queue = {userName: 'gfdgdfg', userPhone: 54535};
    // FIREBASE.database()
    //   .ref('contact/')
    //   .push({
    //     queue: queue,
    //   })
    //   .then(data => {
    //     //success callback
    //     console.log('data ', data);
    //   })
    //   .catch(error => {
    //     //error callback
    //     console.log('error ', error);
    // });

    // var newItem = {userName: 'gfdgdfg', userPhone: 54535};
    // FIREBASE.database()
    //   .ref('contact')
    //   .once('value')
    //   .then(function (snapshot) {
    //     snapshot.forEach(function (barberSnapshot) {
    //       barberSnapshot.child('queue').ref.push(newItem);
    //     });
    //   });

    const AddContact = FIREBASE.database().ref('contact/');
    const contact = {
      name: this.state.name,
      category: this.state.categoryValue,
      category2: this.state.categoryValue2,
      category3: this.state.categoryValue3,
      category4: this.state.categoryValue4,
      category5: this.state.categoryValue5,
      unitPrice: this.state.unitPrice,
      description: this.state.description,
      imgUrl: imageUrl,
      BulkFoodStatus: true,
      MenuFoodStatus: true,
    };
    AddContact.push(contact)
      .then(data => {
        console.log('Added');
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
    console.log('uploadImage');
    const {uri} = this.state.image;

    let duplicate = false;
    if (this.state.name) {
      this.state.ExistFood.map((item, index) => {
        if (item.name === this.state.name) {
          duplicate = true;
        }
      });
    }

    if (this.state.name) {
      if (this.state.unitPrice) {
        if (this.state.description) {
          if (this.state.categoryValue) {
            if (this.state.imageChoosed) {
              if (!duplicate) {
                if (!isNaN(this.state.unitPrice)) {
                  const filename = uri.substring(uri.lastIndexOf('/') + 1);
                  const uploadUri =
                    Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
                  this.setState({uploading: true});
                  this.setState({transferred: 0});
                  const task = storage().ref(filename).putFile(uploadUri);
                  console.log(filename);

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
                    // console.log('error')
                    console.error(e);
                    console.log('Bigg Error');
                  }
                  this.setState({uploading: false, imageChoosed: false});
                  this.successShowAlert();
                  console.log('Your menu has been uploaded!');
                  this.setState({image: null});
                } else {
                  this.showPriceNumValAlert();
                }
              } else {
                this.showDublicateAlert();
              }
            } else {
              this.showImageValAlert();
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
  showImageValAlert = () => {
    this.setState({
      imageVal: true,
    });
  };

  hideImageValAlert = () => {
    this.setState({
      imageVal: false,
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

  render() {
    const {
      showAlert,
      dublicateAtert,
      successAlertMsg,
      nameVal,
      priceVal,
      descriptionVal,
      categoryVal,
      imageVal,
      priceNumVal,
    } = this.state;

    return (
      <SafeAreaView style={styles.conatiner}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.title}>
              <Text style={styles.headerText}>New Menu</Text>
            </View>
          </View>

          <View style={styles.pages}>
            <Text style={styles.label}>Food Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Food Name"
              onChangeText={text => this.setState({name: text})}
              value={this.state.name}
              placeholderTextColor="grey"
              maxLength={13}
            />

            <Text style={styles.label}>Rs : </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter the Unit Price"
              onChangeText={text => this.setState({unitPrice: text})}
              value={this.state.unitPrice}
              placeholderTextColor="grey"
              keyboardType="number-pad"
              maxLength={4}
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter About The Food Description"
              onChangeText={text => this.setState({description: text})}
              value={this.state.description}
              placeholderTextColor="grey"
              maxLength={40}
            />
            <Text style={{color: 'white', marginBottom: 5}}>Category</Text>
            <View style={styles.card}>
              <Picker
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({categoryValue: itemValue})
                }
                style={{color: 'white'}}>
                <Picker.Item
                  label="Choose Category"
                  value=""
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

            <View style={styles.card}>
              <Picker
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({categoryValue2: itemValue})
                }
                style={{color: 'white'}}>
                <Picker.Item
                  label="Choose Category"
                  value=""
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

            <View style={styles.card}>
              <Picker
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({categoryValue3: itemValue})
                }
                style={{color: 'white'}}>
                <Picker.Item
                  label="Choose Category"
                  value=""
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

            <View style={styles.card}>
              <Picker
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({categoryValue4: itemValue})
                }
                style={{color: 'white'}}>
                <Picker.Item
                  label="Choose Category"
                  value=""
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

            <View style={styles.card}>
              <Picker
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({categoryValue5: itemValue})
                }
                style={{color: 'white'}}>
                <Picker.Item
                  label="Choose Category"
                  value=""
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
                <Progress.Bar progress={this.state.transferred} width={200} />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={this.uploadImage}>
                {/* onPress={this.onSubmit}> */}
                <Text style={styles.buttonText}>Add Menu</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <WarningMessage
          title="Sorry!"
          message="Please input suitable field"
          hideAlert={this.hideAlert}
          showAlert={showAlert}
        />

        <WarningMessage
          title="Sorry!"
          message="This Food Name is Already Exist, Please Change Food Name"
          hideAlert={this.hideDublicateAlert}
          showAlert={dublicateAtert}
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
          title="Successfull!"
          message="Your New Menu Uploaded"
          hideAlert={this.hideAlertSuccessMsg}
          showAlert={successAlertMsg}
        />

        <WarningMessage
          title="Sorry!"
          message="Price Should be Number, Plesae Input Number Type Only in Price Field"
          hideAlert={this.hidePriceNumValAlert}
          showAlert={priceNumVal}
        />

        <WarningMessage
          title="Sorry!"
          message="This Food Name is Already Exist, Please Change Food Name"
          hideAlert={this.hideDublicateAlert}
          showAlert={dublicateAtert}
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
          message="Please Choose Image"
          hideAlert={this.hideImageValAlert}
          showAlert={imageVal}
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
    marginBottom: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    textAlignVertical: 'center',
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
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
  },

  textInput: {
    borderWidth: 1,
    borderColor: 'white',
    color: 'white',
    borderRadius: 5,
    marginBottom: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: 'white',
    color: 'black',
    borderRadius: 5,
    marginBottom: 5,
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
    alignItems: 'center',
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
