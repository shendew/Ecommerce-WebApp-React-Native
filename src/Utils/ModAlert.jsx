import React, { useState } from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';

const ModAlert = ({options}) => {
  // const [mainText,setMainText]=useState("hello");
  const [isShow,setIsShow]=useState(options.visible);

  return (
    <Modal transparent animationType="fade" visible={isShow}>
      <TouchableOpacity
        onPress={() => {setIsShow(false)}}
        style={{
          flex: 1,
          backgroundColor: '#000000AA',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableWithoutFeedback>
          <View>
            <Text>{options.title}</Text>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({});

export default ModAlert;
