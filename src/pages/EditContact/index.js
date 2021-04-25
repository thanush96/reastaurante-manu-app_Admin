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
} from 'react-native';
import {InputData} from '../../components';
import FIREBASE from '../../config/FIREBASE';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import * as Progress from 'react-native-progress';
import {Picker} from '@react-native-picker/picker';
import {LogBox} from 'react-native';


export default class Edit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      age: '',
      address: '',
      image: '',
      imageurl: null,
      categoryValue: '',
      uploading: false,
      transferred: 0,
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

  componentDidMount() {
    FIREBASE.database()
      .ref('contact/' + this.props.route.params.id)
      .once('value', querySnapShot => {
        let data = querySnapShot.val() ? querySnapShot.val() : {};
        let contactItem = {...data};

        this.setState({
          name: contactItem.name,
          age: contactItem.age,
          address: contactItem.address,
          imageurl: contactItem.imgUrl,
          categoryValue: contactItem.categoryName,
        });
      });
  }

  onChangeText = (nameState, value) => {
    this.setState({
      [nameState]: value,
    });
  };

  onSubmit = imageUrl => {
    if (this.state.name && this.state.age && this.state.address) {
      const AddContact = FIREBASE.database().ref(
        'contact/' + this.props.route.params.id,
      );
      const contact = {
        name: this.state.name,
        category: this.state.categoryValue,
        age: this.state.age,
        address: this.state.address,
        imgUrl: imageUrl,
      };

      AddContact.update(contact)
        .then(data => {
          Alert.alert('Success', 'Contact updated');
        })

        .catch(error => {
          console.log('Error :', error);
        });

      console.log('Added');
      console.log(this.state);
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
      <View style={styles.pages}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <InputData
            label="name"
            placeholder="Name here"
            onChangeText={this.onChangeText}
            value={this.state.name}
            nameState="name"
          />

          <InputData
            label="age"
            placeholder="Age Here"
            keyboardType="number-pad"
            onChangeText={this.onChangeText}
            value={this.state.age}
            nameState="age"
          />

          <InputData
            label="address"
            placeholder="Address here"
            onChangeText={this.onChangeText}
            value={this.state.address}
            nameState="address"
          />

          <Picker
            defaultValue="sgdgsfdgs"
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

          {this.state.imageurl !== null ? (
            <Image
              source={{uri: this.state.image.uri}}
              style={styles.imageBox}
            />
          ) : (
            <Image
              style={styles.imageBox}
              source={{
                uri: this.state.imageurl,
              }}
            />
          )}
          </View>
          {/* {this.state.image !== null ? (
            <Image
              source={{uri: this.state.image.uri}}
              style={styles.imageBox}
            />
          ) : (
            <Image
              style={styles.imageBox}
              source={{
                uri: this.state.imageurl,
              }}
            />
          )} */}

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
        </ScrollView>
      </View>
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
    height: 50,
    backgroundColor: '#63a4ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  uploadButton: {
    borderRadius: 5,
    height: 50,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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
    backgroundColor: '#63a4ff',
  },
});
