import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppColors from '../utils/AppColors';

interface LoadingComponentProps {
  isLoading: boolean;
  text?: string;
}

const LoadingComponent = ({isLoading, text}: LoadingComponentProps) => {
  return isLoading ? (
    <Modal
      transparent={true}
      visible={isLoading}
      animationType={'fade'}
      style={styles.modalBGContainer}>
      <SafeAreaView style={styles.modalBGContainer}>
        <View style={styles.modelBgContainer}>
          <ActivityIndicator
            animating={isLoading}
            color={AppColors.primary}
            size={'large'}
          />
          <Text style={styles.modalTextStyle}>
            {text ? text : 'Please Wait...'}
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  ) : null;
};

export default LoadingComponent;

const styles = StyleSheet.create({
  modalBGContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },

  modelBgContainer: {
    backgroundColor: AppColors.white,
    alignItems: 'center',
    borderRadius: 8,
    alignSelf: 'center',
    padding: '3%',
  },

  modalTextStyle: {textAlign: 'center', marginTop: 11, color: AppColors.black},
});
