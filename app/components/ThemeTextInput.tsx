import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AppColors from '../utils/AppColors';
import {isEmpty} from '../utils/AppConstant';

const ThemeTextInput = (props: any) => {
  const onTextInputFocus = () => {
    if (props?.setIsFocus !== undefined) {
      props?.setIsFocus(true);
    }
  };

  const onTextInputBlur = () => {
    if (props?.setIsFocus !== undefined) {
      props?.setIsFocus(false);
    }
  };

  const onChangeText = value => {
    props?.setValue(value);
  };

  const onEndEditing = (value: any) => {
    if (props?.onEndEditing !== undefined) {
      props?.onEndEditing();
    }
  };

  const onTextInputPress = () => {
    if (props?.onPress !== undefined) {
      if (!props?.disabled) {
        props?.onPress();
      }
    }
  };

  const onRightIconPress = () => {
    if (!isEmpty(props?.onRightIconPress)) {
      props?.onRightIconPress();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onTextInputPress}
      disabled={props?.disabled}
      style={[
        styles.textInputContainerStyle,
        props?.textInputContainerStyle,
        // {opacity: props?.disabled ? 0.5 : 1},
      ]}>
      <View style={styles.labelContainer}>
        <Text style={styles.labelStyle}>{props?.label}</Text>
      </View>
      <View
        style={[
          styles.mainViewStyle,
          props?.textInputMainStyle,
          {
            borderWidth: props?.isFocus ? 1.5 : 0.8,
          },
        ]}>
        <TextInput
          ref={props?.inputRef}
          onPressIn={onTextInputPress}
          editable={props?.editable}
          placeholder={props?.placeHolderText}
          selectionColor={AppColors.primary}
          placeholderTextColor={
            props?.placeholderTextColor
              ? props?.placeholderTextColor
              : AppColors.dark_gray
          }
          autoComplete={props?.autoComplete ?? 'off'}
          textContentType={props?.textContentType ?? 'none'}
          autoCorrect={props?.autoCorrect ?? false}
          autoFocus={props?.autoFocus ?? false}
          keyboardType={props.keyboardType ?? 'default'}
          style={[
            props?.disabled
              ? [styles.textInputStyle, {color: AppColors.dark_gray}]
              : styles.textInputStyle,
            props.textInputStyle,
          ]}
          maxLength={props?.maxLength}
          numberOfLines={props.numberOfLines ?? 1}
          multiline={props.multiline ?? false}
          onFocus={onTextInputFocus}
          onBlur={onTextInputBlur}
          onChangeText={onChangeText}
          onEndEditing={onEndEditing}
          value={props?.value}
          secureTextEntry={props?.secureTextEntry ?? false}
          blurOnSubmit={props?.blurOnSubmit}
          onSubmitEditing={props?.onSubmitEditing}
          returnKeyType={props?.returnKeyType}
        />
        {props?.isRightIcon ? (
          <TouchableOpacity onPress={onRightIconPress}>
            <Image source={props?.rightIcon} style={styles.rightImageStyle} />
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default ThemeTextInput;

const styles = StyleSheet.create({
  textInputContainerStyle: {
    marginTop: '2%',
    marginBottom: '2%',
  },

  labelContainer: {
    backgroundColor: AppColors.white, // Same color as background
    alignSelf: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 8, // Amount of spacing between border and first/last letter
    marginStart: 10, // How far right do you want the label to start
    zIndex: 1, // Label must overlap border
    elevation: 1, // Needed for android
    shadowColor: 'white', // Same as background color because elevation: 1 creates a shadow that we don't want
    position: 'absolute', // Needed to be able to precisely overlap label with border
    top: '-6%', // Vertical position of label. Eyeball it to see where label intersects border.
    color: AppColors.primary,
  },

  labelStyle: {
    fontSize: 14,
    lineHeight: 14,
    color: AppColors.dim_gray,
  },

  mainViewStyle: {
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: Platform.OS === 'ios' ? 55.5 : 55.5,
    borderColor: AppColors.primary,
    paddingHorizontal: 7,
    backgroundColor: AppColors.white,
    alignItems: 'center',
  },

  textInputStyle: {
    flex: 1,
    fontSize: 14,
    color: AppColors.black,
    height: Platform.OS === 'ios' ? 55.5 : 55.5,
    paddingHorizontal: 7,
    flexDirection: 'row',
  },

  rightImageStyle: {
    width: 18,
    height: 18,
  },
});
