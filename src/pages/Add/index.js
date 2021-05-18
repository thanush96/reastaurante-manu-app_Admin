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
      dataSource: [],
      showAlert: false,
      successAlertMsg: false,
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
  async componentWillMount() {
    this.setState({
      dataSource: await this.get_firebase_list(),
    });
  }

  onChangeText = (nameState, value) => {
    this.setState({
      [nameState]: value,
    });
  };

  onSubmit = imageUrl => {
    const AddContact = FIREBASE.database().ref('contact');
    const contact = {
      name: this.state.name,
      category: this.state.categoryValue,
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
    if (
      this.state.imageChoosed &&
      this.state.name &&
      this.state.unitPrice &&
      this.state.description &&
      this.state.categoryValue &&
      !isNaN(this.state.unitPrice)
    ) {
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
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
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
      }
      this.setState({uploading: false});
      this.successShowAlert();
      console.log('Your menu has been uploaded!');
      this.setState({image: null});
    } else {
      this.showAlert();
      console.log('Please fill field');
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
    this.props.navigation.navigate('Menus');
  };

  render() {
    const {showAlert, successAlertMsg} = this.state;

    return (
      <SafeAreaView style={styles.conatiner}>
        <View style={styles.header}>
          <View style={styles.title}>
            <Text style={styles.headerText}>New Manu</Text>
          </View>
        </View>

        <View style={styles.pages}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <InputData
              label="Name"
              placeholder="Enter the Food Name"
              onChangeText={this.onChangeText}
              value={this.state.name}
              nameState="name"
            />
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter the Unit Price"
              onChangeText={text => this.setState({unitPrice: text})}
              value={this.state.unitPrice}
              placeholderTextColor="grey"
              keyboardType="number-pad"
              maxLength={4}
            />
            <InputData
              label="Description"
              placeholder="Description"
              onChangeText={this.onChangeText}
              value={this.state.description}
              nameState="description"
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
            <TouchableOpacity
              style={styles.selectButton}
              onPress={this.selectImage}>
              <Text style={styles.buttonText}>Pick an image</Text>
            </TouchableOpacity>
            <View style={styles.imgcontainer}>
              {this.state.image !== null ? (
                <Image
                  source={{uri: this.state.image.uri}}
                  style={styles.imageBox}
                />
              ) : null}
            </View>
            {this.state.uploading ? (
              <View style={styles.progressBarContainer}>
                <Progress.Bar progress={this.state.transferred} width={300} />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={this.uploadImage}
                // onPress={() => {
                //   navigation.navigate('Menus');
                // }}
              >
                <Text style={styles.buttonText}>Add Menu</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        <WarningMessage
          title="Sorry!"
          message="Please input suitable field"
          // confirmText="Yes, Delete"
          hideAlert={this.hideAlert}
          showAlert={showAlert}
          // confirmAlert={this.hideAlert}
        />

        {/* SUCCESS MESSAGE ALERT */}
        <WarningMessage
          title="Successfull!"
          message="Your New Menu Uploaded"
          // confirmText="Yes, Delete"
          hideAlert={this.hideAlertSuccessMsg}
          showAlert={successAlertMsg}
          // confirmAlert={this.hideAlert}
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
  },
  selectButton: {
    backgroundColor: '#15227A',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
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
