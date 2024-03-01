import React from 'react';
import {
  Image,
  ImageStyle,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {Assets} from '../../assets';
import AppColors from '../../utils/AppColors';
import {isEmpty} from '../../utils/AppConstant';

interface ChatBottomInputComponentProps {
  value: string | undefined;
  onChangeText: ((text: string) => void) | undefined;
  textInputProps?: TextInputProps;
  disabled?: boolean;
  placeholderTextColor?: string;
  placeholder?: string;
  textInputContainerPropsStyle?: StyleProp<ViewStyle>;
  textInputPropsStyle?: StyleProp<TextStyle>;
  attchmentImage?: Image;
  attachmentImagePropsStyle?: StyleProp<ImageStyle>;
  sendImage?: Image;
  sendImagePropsStyle?: StyleProp<ImageStyle>;
  keyboardViewPropsStyle?: StyleProp<ViewStyle>;
  onPressAttachment?: () => void;
  onPressSend: () => void;
  children?: React.ReactNode;
}

const ChatBottomInputComponent = ({
  value,
  onChangeText,
  textInputProps,
  disabled,
  placeholderTextColor,
  placeholder,
  textInputContainerPropsStyle,
  textInputPropsStyle,
  attchmentImage,
  attachmentImagePropsStyle,
  sendImage,
  sendImagePropsStyle,
  keyboardViewPropsStyle,
  onPressAttachment,
  onPressSend,
  children,
}: ChatBottomInputComponentProps) => {
  return (
    <View style={[styles.keyboardViewStyle, keyboardViewPropsStyle]}>
      {onPressAttachment ? (
        <Pressable
          onPress={onPressAttachment}
          style={styles.attachmentViewStyle}>
          <Image
            style={[styles.attachmentImageStyle, attachmentImagePropsStyle]}
            source={
              attchmentImage ? attchmentImage : Assets.attachment_blue_icon
            }
          />
        </Pressable>
      ) : null}
      <View
        style={[styles.textInputContainerStyle, textInputContainerPropsStyle]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={
            placeholderTextColor ? placeholderTextColor : 'gray'
          }
          placeholder={placeholder ? placeholder : 'Type your message...'}
          style={[styles.textInputStyle, textInputPropsStyle]}
          {...textInputProps}
        />
      </View>
      <Pressable
        onPress={onPressSend}
        style={styles.sendBtnStyle}
        disabled={
          disabled
            ? disabled
            : isEmpty(value?.toString()?.trim())
            ? true
            : false
        }>
        <Image
          style={[styles.sendImageStyle, sendImagePropsStyle]}
          source={
            sendImage
              ? sendImage
              : !isEmpty(value?.toString()?.trim())
              ? Assets.send_blue_icon
              : Assets.send_white_icon
          }
        />
      </Pressable>
    </View>
  );
};

export default ChatBottomInputComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },

  keyboardViewStyle: {
    shadowOffset: {
      width: 0,
      height: -1,
    },
    padding: 10,
    shadowRadius: 0,
    shadowOpacity: 1,
    borderTopWidth: 1,
    borderTopColor: AppColors.border_color,
    paddingVertical: 5,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: AppColors.white,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
  },

  attachmentViewStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },

  textInputContainerStyle: {
    flex: 1,
    maxHeight: 150,
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: AppColors.border_color,
    marginHorizontal: 8,
    marginTop: 5,
  },

  textInputStyle: {
    height: Platform.OS === 'ios' ? 55.5 : undefined,
    fontSize: 15,
    color: AppColors.black,
    backgroundColor: AppColors.white,
  },

  attachmentImageStyle: {
    width: 20,
    height: 20,
  },

  sendBtnStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    backgroundColor: AppColors.light_gray,
    borderRadius: 100,
  },

  sendImageStyle: {
    width: 25,
    height: 25,
  },
});
