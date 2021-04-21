// import React, {Component} from 'react';
// import {
//   Text,
//   StyleSheet,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import {InputData} from '../../components';
// import FIREBASE from '../../config/FIREBASE';

// export default class Add extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       name: '',
//       age: '',
//       address: '',
//     };
//   }

//   onChangeText = (nameState, value) => {
//     this.setState({
//       [nameState]: value,
//     });
//   };

//   onSubmit = () => {
//     if (this.state.name && this.state.age && this.state.address) {
//       const AddContact = FIREBASE.database().ref('contact');
//       const contact = {
//         name: this.state.name,
//         age: this.state.age,
//         address: this.state.address,
//       };

//       AddContact.push(contact)
//         .then(data => {
//           Alert.alert('Success', 'added');
//         })

//         .catch(error => {
//           console.log('Error :', error);
//         });

//       console.log('Added');
//       console.log(this.state);
//     } else {
//       Alert.alert('Error', 'Please Input here');
//     }
//   };

//   render() {
//     return (
// <View style={styles.pages}>
//   <InputData
//     label="name"
//     placeholder="Name here"
//     onChangeText={this.onChangeText}
//     value={this.state.name}
//     nameState="name"
//   />

//   <InputData
//     label="price"
//     placeholder="price Here"
//     keyboardType="number-pad"
//     onChangeText={this.onChangeText}
//     value={this.state.age}
//     nameState="age"
//   />

//   <InputData
//     label="description"
//     placeholder="description"
//     onChangeText={this.onChangeText}
//     value={this.state.address}
//     nameState="address"
//   />

//   <TouchableOpacity style={styles.touch} onPress={() => this.onSubmit()}>
//     <Text style={styles.submit}>Submit</Text>
//   </TouchableOpacity>
// </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   pages: {
//     flex: 1,
//     padding: 30,
//   },

//   touch: {
//     backgroundColor: 'black',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   submit: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     fontSize: 16,
//   },
// });

import React, {Component, useState} from 'react';

import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Image,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
import {InputData} from '../../components';
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
    };
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
        age: this.state.age,
        address: this.state.address,
        imgUrl: imageUrl,
      };

      AddContact.push(contact)
        .then(data => {
          Alert.alert('Success', 'added');
        })

        .catch(error => {
          console.log('Error :', error);
        });

      console.log('Added');
      // console.log(this.state);
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

    Alert.alert(
      'Photo uploaded!',
      'Your photo has been uploaded to Firebase Cloud Storage!',
    );
    this.setState({image: null});
    // setImage(null);
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.imageContainer}>
          <InputData
            label="name"
            placeholder="Name here"
            onChangeText={this.onChangeText}
            value={this.state.name}
            nameState="name"
          />

          <InputData
            label="price"
            placeholder="price Here"
            keyboardType="number-pad"
            onChangeText={this.onChangeText}
            value={this.state.age}
            nameState="age"
          />

          <InputData
            label="description"
            placeholder="description"
            onChangeText={this.onChangeText}
            value={this.state.address}
            nameState="address"
          />
          <TouchableOpacity
            style={styles.selectButton}
            onPress={this.selectImage}>
            <Text style={styles.buttonText}>Pick an image</Text>
          </TouchableOpacity>

          {this.state.image !== null ? (
            <Image
              source={{uri: this.state.image.uri}}
              style={styles.imageBox}
            />
          ) : null}
          {this.state.uploading ? (
            <View style={styles.progressBarContainer}>
              <Progress.Bar progress={this.state.transferred} width={300} />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={this.uploadImage}>
              <Text style={styles.buttonText}>Upload Menu</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  pages: {
    flex: 1,
    padding: 30,
  },

  touch: {
    backgroundColor: 'black',
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

  selectButton: {
    borderRadius: 5,
    width: 250,
    height: 50,
    backgroundColor: '#8ac6d1',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  uploadButton: {
    margin: 10,
    borderRadius: 5,
    width: 250,
    height: 50,
    backgroundColor: '#ffb6b9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 50,
    alignItems: 'center',
  },
  progressBarContainer: {
    margin: 10,
  },
  imageBox: {
    backgroundColor: '#8ac6d1',
    width: 250,
    height: 100,
    borderRadius: 5,
  },
});
