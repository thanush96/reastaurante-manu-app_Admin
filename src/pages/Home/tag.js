import React, {Component} from 'react';
import {TouchableOpacity, View, Text, Button} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import FIREBASE from '../../config/FIREBASE';

export default class tag extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
      selectedItems: [],
      getCheckedCategory: [],
    };
  }

  async get_categoryName_db() {
    // console.log('get_categoryName_db');
    return FIREBASE.database()
      .ref('categories')
      .once('value')
      .then(function (snapshot) {
        var categortName = [];
        snapshot.forEach(childSnapshot => {
          var key = childSnapshot.key;
          var name = childSnapshot.val();
          categortName.push(name);
        });
        return categortName;
      });
  }

  async get_cecked_category_db() {
    // console.log('get_categoryName_db');
    return FIREBASE.database()
      .ref('test')
      .once('value')
      .then(function (snapshot) {
        var categortName = [];
        snapshot.forEach(childSnapshot => {
          var key = childSnapshot.key;
          var name = childSnapshot.val();
          categortName.push(name);
        });
        console.log(categortName);
        return categortName;
      });
  }

  async componentWillMount() {
    this.setState({
      dataSource: await this.get_categoryName_db(),
      getCheckedCategory: await this.get_cecked_category_db(),
    });
  }

  onchecked(categoryName) {
    // console.log(categoryName);
    const data = this.state.dataSource;
    const index = data.findIndex(x => x.categoryName === categoryName);
    console.log(index);
    data[index].checked = !data[index].checked;
    this.setState(data);
    console.log(this.state.dataSource);
  }

  getSelectedItem() {
    var key = this.state.dataSource.map(t => t.categoryName);
    var checks = this.state.dataSource.map(t => t.checked);
    // console.log(key, checks);
    let selectedArray = [];
    for (let i = 0; i < checks.length; i++) {
      if (checks[i] == true) {
        selectedArray.push(key[i]);
      }
    }
    alert(selectedArray);

    const AddContact = FIREBASE.database().ref('test/');
    const category = {
      category: selectedArray,
    };
    AddContact.push(category)
      .then(data => {
        console.log('Added');
      })
      .catch(error => {
        console.log('Error :', error);
      });
  }

  getSelectedOneItem() {
    console.log(this.state.getCheckedCategory);
    let array = [];
    this.state.getCheckedCategory.map((item, key) => {
      // console.log(item.category);
      array.push(item.category);
      // console.log(key);
    });

    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        console.log(array[i][j]);

        if (array[i][j] == 'Lunch') {
          console.log(i, j);
          // return (
          //   <TouchableOpacity>
          //     <Text>Done</Text>
          //   </TouchableOpacity>
          // );
        }
      }
      // console.log(j, 'of Array');
    }
  }

  renderItem() {
    return this.state.dataSource.map((item, key) => {
      return (
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          key={key}
          onPress={() => {
            this.onchecked(item.categoryName);
          }}>
          <CheckBox
            value={item.checked}
            onValueChange={() => {
              this.onchecked(item.categoryName);
            }}
          />
          <Text>{item.categoryName}</Text>
        </TouchableOpacity>
      );
    });
  }

  render() {
    return (
      <View>
        <View>{this.renderItem()}</View>
        <View>
          <Button
            title="Submit"
            onPress={() => {
              this.getSelectedItem();
            }}></Button>
        </View>

        <View>
          <Button
            title="Show"
            onPress={() => {
              this.getSelectedOneItem();
            }}></Button>
        </View>

        {/* <CheckBox
            value={true}
            onValueChange={false}

            // onValueChange={() => {
            //   this.onchecked(item.categoryName);
            // }}
          />
          <Text>{item.categoryName}</Text> */}
      </View>
    );
  }
}
