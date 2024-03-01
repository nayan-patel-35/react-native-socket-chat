import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Assets} from '../assets';
import AppColors from '../utils/AppColors';
import {DEVICE_HEIGHT, DEVICE_WEIGHT, isEmpty} from '../utils/AppConstant';

const ITEM_WIDTH = Math.round(DEVICE_WEIGHT * 0.92);

const DOCUMENT_ARRAY = [
  {
    id: 1,
    label: 'Photo',
    value: 'TakePhoto',
    image: Assets.camera_icon,
  },
  {
    id: 3,
    label: 'Document',
    value: 'Document',
    image: Assets.document_icon,
  },
];

const COMMON_ARRAY = [
  {
    id: 1,
    label: 'Photo',
    value: 'TakePhoto',
    image: Assets.camera_icon,
  },
  {
    id: 2,
    label: 'Gallery',
    value: 'Gallery',
    image: Assets.gallery_icon,
  },
];

const CHAT_ARRAY = [
  {
    id: 1,
    label: 'Photo',
    value: 'Photo',
    image: Assets.camera_icon,
  },
  {
    id: 2,
    label: 'Video',
    value: 'Video',
    image: Assets.video_icon,
  },
];

const RBSheetComponent = (props: any) => {
  const [labelList, setLabel] = useState(COMMON_ARRAY);

  useEffect(() => {
    if (props?.isDocumentSelection) {
      setLabel(DOCUMENT_ARRAY);
    }
    if (!props?.isDocumentSelection) {
      setLabel(COMMON_ARRAY);
    }
  }, [props?.isDocumentSelection]);

  useEffect(() => {
    if (props?.isChatSelection) {
      setLabel(CHAT_ARRAY);
    }
    if (!props?.isChatSelection) {
      setLabel(COMMON_ARRAY);
    }
  }, [props?.isChatSelection]);

  const onPressClose = () => {
    props.inputRef.current.close();
  };

  const onPressType = (type: string) => {
    props?.onPressType(type);
  };

  const renderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.rbsheetItemContainerStyle}
        onPress={() => {
          if (props?.onPressItem) {
            props?.onPressItem(item);
            props.inputRef.current.close();
          }
        }}>
        <Text style={styles.itemTextStyle}>{item.label}</Text>
        {item.image ? (
          <Image
            source={item.image}
            style={{
              width: 25,
              height: 25,
            }}
          />
        ) : null}
      </TouchableOpacity>
    );
  };

  const renderItemSeparator = () => {
    return <View style={styles.itemSeparatorStyle} />;
  };

  const renderRBSheetItem = ({item, index}: any) => {
    return (
      <View
        style={[
          styles.uploadPhotoContainerStyle,
          {
            width: ITEM_WIDTH / labelList.length,
          },
        ]}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.subCardFlexStyle}
          onPress={() => onPressType(item?.value)}>
          <Text style={styles.galleryTextStyle}>
            {props?.isProfile && item?.label == 'Photo'
              ? 'Take Photo'
              : item?.label ?? ''}
          </Text>
          <View style={styles.subCardGalleryBorderStyle}>
            <Image
              source={item.image}
              style={{
                width: 45,
                height: 45,
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <RBSheet
      openDuration={250}
      ref={props?.inputRef}
      animationType={props?.animationType ?? 'slide'}
      height={props?.height ? props?.height : DEVICE_HEIGHT / 2.5}
      closeOnDragDown={false}
      closeOnPressMask={false}
      customStyles={{
        container: styles.rbsheetContainerStyle,
      }}>
      {props?.children}
      <View style={styles.rbSheetSubContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.closeIconStyle}
          onPress={onPressClose}>
          <Image
            source={Assets.close_black_icon}
            style={{width: 13, height: 13}}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        {props?.title && (
          <Text style={styles.headTextStyle}>
            {props?.title ?? 'Select Item'}
          </Text>
        )}
        {props?.data?.length > 0 ? (
          <FlatList
            data={props?.data ?? []}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={renderItemSeparator}
            renderItem={renderItem}
          />
        ) : props?.data && !props?.isDocumentSelection ? (
          <Text style={styles.noDataTextStyle}>No Data Founds</Text>
        ) : null}
        {(!isEmpty(props?.isDocumentSelection) ||
          !isEmpty(props?.isChatSelection)) &&
        labelList?.length > 0 ? (
          <FlatList
            data={labelList?.length > 0 ? labelList : []}
            horizontal={true}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            renderItem={renderRBSheetItem}
          />
        ) : null}
      </View>
    </RBSheet>
  );
};

export default RBSheetComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },

  rbsheetContainerStyle: {
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  rbSheetSubContainer: {flex: 1, marginHorizontal: '5%'},

  headTextStyle: {
    fontSize: 18,
    lineHeight: 18,
    color: AppColors.black,
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 1,
    marginBottom: 1.5,
  },

  closeIconStyle: {
    padding: '1.5%',
    marginTop: 2.5,
    alignItems: 'flex-end',
  },

  itemSeparatorStyle: {
    backgroundColor: AppColors.border_color,
    width: 90,
    height: 1,
    alignSelf: 'center',
  },

  rbsheetItemContainerStyle: {
    paddingVertical: 1.5,
    width: 90,
    alignSelf: 'center',
    marginVertical: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemTextStyle: {
    fontSize: 16,
    lineHeight: 16,
    color: AppColors.black,
    flex: 1,
  },

  noDataTextStyle: {
    fontSize: 15,
    color: AppColors.black,
    marginTop: 5,
    marginBottom: 5,
    alignSelf: 'center',
  },

  uploadPhotoContainerStyle: {
    width: ITEM_WIDTH / 2,
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 2,
  },

  subCardFlexStyle: {
    flex: 1,
    alignSelf: 'center',
    marginTop: 2,
    marginBottom: 2,
  },

  subCardGalleryBorderStyle: {
    borderStyle: 'dashed',
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: AppColors.border_color,
    flexDirection: 'row',
    padding: 2,
    margin: 2,
    marginBottom: 0,
  },

  takePhotoTextStyle: {
    fontSize: 15,
    lineHeight: 16,
    color: AppColors.black,
    alignSelf: 'center',
  },

  galleryTextStyle: {
    fontSize: 15,
    lineHeight: 16,
    color: AppColors.black,
    alignSelf: 'center',
  },
});
