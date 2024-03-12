import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppColors from '../../utils/AppColors';

interface DateHeaderProps  {
  dateString: string;
};

const DateHeader = ({dateString}: DateHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, {color: 'white'}]}>{dateString}</Text>
    </View>
  );
};

export default DateHeader;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    height: 16,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 8,
    backgroundColor:AppColors.silver 
  },

  text: {
    fontSize: 13,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
