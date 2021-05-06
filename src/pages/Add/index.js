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
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
import {InputData} from '../../components';
import {Picker} from '@react-native-picker/picker';
import FIREBASE from '../../config/FIREBASE';

export default class Details extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      age: '',
      address: '',
      image: '',
      uploading: false,
      transferred: 0,
      categoryValue: '',
      dataSource: [],
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
    if (this.state.name && this.state.age && this.state.address) {
      const AddContact = FIREBASE.database().ref('contact');
      const contact = {
        name: this.state.name,
        category: this.state.categoryValue,
        age: this.state.age,
        address: this.state.address,
        imgUrl: imageUrl,
        BulkFoodStatus: true,
        MenuFoodStatus: true,
      };

      AddContact.push(contact)
        .then(data => {
          console.log('Added');
          // Alert.alert('Success', 'added');
        })

        .catch(error => {
          console.log('Error :', error);
        });
    } else {
      Alert.alert('Error', 'Please Input here');
    }
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
        this.setState({image: source});
      }
    });
  };

  uploadImage = async () => {
    const {uri} = this.state.image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    this.setState({uploading: true});
    this.setState({transferred: 0});
    const task = storage().ref(filename).putFile(uploadUri);
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
      console.error(e);
    }
    this.setState({uploading: false});

    Alert.alert('Menu uploaded!', 'Your menu has been uploaded!');
    this.setState({image: null});
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <InputData
            label="Name"
            placeholder="Enter the Food Name"
            onChangeText={this.onChangeText}
            value={this.state.name}
            nameState="name"
          />
          <InputData
            label="Price"
            placeholder="Enter the Unit Price"
            keyboardType="number-pad"
            onChangeText={this.onChangeText}
            value={this.state.age}
            nameState="age"
          />
          <InputData
            label="Description"
            placeholder="Description"
            onChangeText={this.onChangeText}
            value={this.state.address}
            nameState="address"
          />
          <Text>Category</Text>
          <Picker
            onValueChange={(itemValue, itemIndex) =>
              this.setState({categoryValue: itemValue})
            }>
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
              onPress={this.uploadImage}>
              <Text style={styles.buttonText}>Add Menu</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  selectButton: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
