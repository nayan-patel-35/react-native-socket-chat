import Clipboard from '@react-native-clipboard/clipboard';
import { useContext } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Video from 'react-native-video';
import { Assets } from '../../assets';
import { SocketContext } from '../../context/SocketContext';
import AppColors from '../../utils/AppColors';
import { IsOpenURL, isValidUrl } from '../../utils/AppConstant';
var moment = require('moment');
const today = moment().format('YYYY-MM-DD');

interface MessageItemComponentProps {
  props: {
    item: any;
    index: number;
    date:string;
    toUserId?: string;
    fromUserId?: string;
    onOpenChatImage?: () => void;
    onOpenChatVideo?: () => void;
  };
}

const MessageItemComponent = ({props}: MessageItemComponentProps) => {
  const {item, index, date, onOpenChatImage, onOpenChatVideo} =
    props;
     const {state: socketState}: any = useContext(SocketContext);

  let senderId: string = item?.sender?._id;
  let currentUserId: string = socketState?.user?._id;

  let msgNameColor = ['#375BFB', '#5FA857', '#FF734C'];

  const _onPressCopyMessage = (item: any) => {
    Clipboard.setString(item?.content);
    Toast.show({
      type: 'success',
      text1: 'Message Copied!',
    });
  };

  const checkIsURLText = (item: any) => {
    let isURL = isValidUrl(item?.content);
    return isURL;
  };

  const renderVideoViewItem = () => {
    return (
      <View style={{marginTop: 10}}>
        <View
          style={{
            backgroundColor:
              senderId == currentUserId
                ? AppColors.silver
                : AppColors.silver,
            alignSelf:
              senderId == currentUserId ? 'flex-end' : 'flex-start',
            padding: 3,
            borderRadius: 8,
          }}>
          <TouchableOpacity onPress={onOpenChatVideo}>
            <Video
              repeat
              muted
              controls={Platform.OS == 'ios' ? true : false}
              // paused
              resizeMode="cover"
              source={{uri: item.attachments[0]?.videoURL}}
              style={[
                {
                  alignSelf:
                    senderId == currentUserId ? 'flex-end' : 'flex-start',
                },
                styles.chatImgVideoStyle,
              ]}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignSelf:
              senderId == currentUserId ? 'flex-end' : 'flex-start',
          }}>
          <Text
            style={[
              {
                alignSelf:
                  senderId == currentUserId ? 'flex-end' : 'flex-start',
              },
              styles.msgTimeTextStyle,
            ]}>
            {senderId !== currentUserId
              ? `${item?.sender?.firstName} ${item?.sender?.lastName}`
              : ''}
          </Text>
          <Text
            style={[
              {
                alignSelf:
                  senderId == currentUserId ? 'flex-end' : 'flex-start',
                marginLeft: 5,
              },
              styles.msgTimeTextStyle,
            ]}>
            {moment(item.updatedAt).format('YYYY-MM-DD') == today
              ? moment(item.updatedAt).format('hh:mm A')
              : moment(item.updatedAt).format('hh:mm A DD MMM')}
          </Text>
        </View>
      </View>
    );
  };

  const renderImageViewItem = () => {
    return (
      <View style={{marginTop: 10}}>
        <View
          style={{
            backgroundColor:
              senderId == currentUserId
                ? AppColors.silver
                : AppColors.silver,
            alignSelf:
              senderId == currentUserId ? 'flex-end' : 'flex-start',
            padding: 3,
            borderRadius: 8,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf:
                senderId == currentUserId ? 'flex-end' : 'flex-start',
            }}>
            <TouchableOpacity
              disabled={item.type == 'deleted' ? true : false}
              onPress={onOpenChatImage}>
              <Image
                style={[
                  {
                    alignSelf:
                      senderId == currentUserId
                        ? 'flex-end'
                        : 'flex-start',
                  },
                  styles.chatImgVideoStyle,
                ]}
                source={{
                  uri: item.attachments[0]?.image_url,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignSelf:
              senderId == currentUserId ? 'flex-end' : 'flex-start',
          }}>
          {senderId !== currentUserId && (
            <Text
              style={[
                {
                  alignSelf:
                    senderId == currentUserId ? 'flex-end' : 'flex-start',
                },
                styles.msgTimeTextStyle,
              ]}>
              {senderId !== currentUserId
                ? `${item?.sender?.firstName} ${item?.sender?.lastName}`
                : ''}
            </Text>
          )}
          <Text
            style={[
              {
                alignSelf:
                  senderId == currentUserId ? 'flex-end' : 'flex-start',
                marginLeft: 10,
              },
              styles.msgTimeTextStyle,
            ]}>
            {moment(item.updatedAt).format('YYYY-MM-DD') == today
              ? moment(item.updatedAt).format('hh:mm A')
              : moment(item.updatedAt).format('hh:mm A DD MMM')}
          </Text>
        </View>
      </View>
    );
  };

  const renderFileViewItem = () => {
    return (
      <TouchableOpacity
        style={[
          styles.msgViewStyle,
          {
            padding: item?.content ? 0 : 12,
            marginTop: 22,
            alignSelf:
              senderId == currentUserId ? 'flex-end' : 'flex-start',
            marginEnd: senderId == currentUserId ? 0 : 50,
            marginStart: senderId == currentUserId ? 50 : 0,
            borderBottomLeftRadius: senderId !== currentUserId ? 0 : 16,
            borderBottomRightRadius: senderId == currentUserId ? 0 : 16,
            backgroundColor:
              senderId !== currentUserId || item?.content
                ? AppColors.white
                : AppColors.primaryLight,
          },
        ]}>
        <View
          style={{
            alignSelf:
              senderId == currentUserId ? 'flex-end' : 'flex-start',
            width: '80%',
            flexDirection: 'row',
            marginTop: 8,
          }}>
          <Text
            numberOfLines={3}
            style={[
              styles.msgTextStyle,
              {
                textAlign: senderId == currentUserId ? 'right' : 'left',
                paddingHorizontal: item?.content ? 8 : 0,
                marginBottom: 6,
                color:
                  senderId == currentUserId
                    ? AppColors.white
                    : AppColors.black,
                alignSelf:
                  senderId == currentUserId ? 'flex-end' : 'flex-start',
              },
            ]}>
            {item.attachments[0]?.file_url?.toString()?.split('/')?.pop()}
            {/* {item.attachments[0]?.name} */}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            alignContent: 'center',
          }}>
          {senderId == currentUserId ? (
            <TouchableOpacity
            // onPress={() => downloadFiles(item)}
            >
              <Image source={Assets.download} style={{width: 20, height: 20}} />
            </TouchableOpacity>
          ) : null}
          <Text
            style={[
              {
                color:
                  senderId == currentUserId
                    ? AppColors.white
                    : AppColors.black,
                alignSelf:
                  senderId == currentUserId ? 'flex-end' : 'flex-start',
              },
              styles.msgTimeTextStyle,
            ]}>
            {moment(item.updatedAt).format('YYYY-MM-DD') == today
              ? moment(item.updatedAt).format('hh:mm A')
              : moment(item.updatedAt).format('hh:mm A DD MMM')}
          </Text>
          {senderId !== currentUserId ? (
            <TouchableOpacity
            // onPress={() => downloadFiles(item)}
            >
              <Image source={Assets.download} style={{width: 20, height: 20}} />
            </TouchableOpacity>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderTextViewItem = () => {
    return (
      <>
     
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={() => _onPressCopyMessage(item)}
          style={[
            styles.msgViewStyle,
            {
              padding: item?.content ? 0 : 12,
              marginTop: 10,
              alignSelf:
                senderId == currentUserId ? 'flex-end' : 'flex-start',
              marginEnd: senderId == currentUserId ? 0 : 50,
              marginStart: senderId == currentUserId ? 50 : 0,
              borderBottomLeftRadius: senderId !== currentUserId ? 0 : 18,
              borderBottomRightRadius: senderId == currentUserId ? 0 : 18,
              backgroundColor:
                senderId !== currentUserId
                  ? AppColors.silver
                  : AppColors.primaryLight,
            },
          ]}>
          <Text
            style={[
              styles.msgTextStyle,
              {
                paddingHorizontal: item?.content ? 5 : 0,
                color:
                  senderId !== currentUserId
                    ? AppColors.black
                    : AppColors.white,
                alignSelf:
                  senderId == currentUserId ? 'flex-end' : 'flex-start',
              },
            ]}>
            {item.content}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignSelf:
              senderId == currentUserId ? 'flex-end' : 'flex-start',
          }}>
          {senderId !== currentUserId && (
            <Text
              style={[
                {
                  alignSelf:
                    senderId == currentUserId ? 'flex-end' : 'flex-start',
                },
                styles.msgTimeTextStyle,
              ]}>
              {senderId !== currentUserId
                ? `${item?.sender?.firstName} ${item?.sender?.lastName}`
                : ''}
            </Text>
          )}
          <Text
            style={[
              {
                alignSelf:
                  senderId == currentUserId ? 'flex-end' : 'flex-start',
                marginLeft: 10,
              },
              styles.msgTimeTextStyle,
            ]}>
            {moment(item.updatedAt).format('YYYY-MM-DD') == today
              ? moment(item.updatedAt).format('hh:mm A')
              : moment(item.updatedAt).format('hh:mm A DD MMM')}
          </Text>
        </View>
      </>
    );
  };

  const renderHyperlinkedTextViewItem = () => {
    return (
      <>
        <TouchableOpacity
          activeOpacity={1}
          onLongPress={() => _onPressCopyMessage(item)}
          onPress={() => IsOpenURL(item.text)}
          style={[
            styles.msgViewStyle,
            {
              padding: item?.content ? 0 : 12,
              marginTop: 10,
              alignSelf:
                senderId == currentUserId ? 'flex-end' : 'flex-start',
              marginEnd: senderId == currentUserId ? 0 : 50,
              marginStart: senderId == currentUserId ? 50 : 0,
              borderBottomLeftRadius: senderId !== currentUserId ? 0 : 18,
              borderBottomRightRadius: senderId == currentUserId ? 0 : 18,
              backgroundColor:
                senderId !== currentUserId || item?.content
                  ? AppColors.silver
                  : AppColors.primaryLight,
            },
          ]}>
          {item?.type == 'Messaging' ? (
            <Text
              style={[
                styles.isGroupTextStyle,
                {
                  marginLeft: senderId !== currentUserId ? 1 : 0,
                  paddingHorizontal: item?.content ? 8 : 0,
                  marginTop: item?.content ? 4 : -2,
                  color:
                    senderId !== currentUserId
                      ? msgNameColor[index % msgNameColor.length]
                      : '#3df249',
                  alignSelf:
                    senderId == currentUserId ? 'flex-end' : 'flex-start',
                },
              ]}>
              {senderId !== currentUserId
                ? `${item?.sender?.firstName} ${item?.sender?.lastName}`
                : ''}
            </Text>
          ) : null}

          <Text
            style={[
              styles.msgTextStyle,
              {
                paddingHorizontal: item?.content ? 8 : 2,
                // marginBottom: 2,
                color:
                  senderId == currentUserId && checkIsURLText(item)
                    ? AppColors.urlColor
                    : senderId !== currentUserId && checkIsURLText(item)
                    ? AppColors.urlColor
                    : AppColors.black,
                alignSelf:
                  senderId == currentUserId ? 'flex-end' : 'flex-start',
              },
            ]}>
            {item.text}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignSelf:
              senderId == currentUserId ? 'flex-end' : 'flex-start',
          }}>
          {senderId !== currentUserId && (
            <Text
              style={[
                {
                  alignSelf:
                    senderId == currentUserId ? 'flex-end' : 'flex-start',
                },
                styles.msgTimeTextStyle,
              ]}>
              {senderId !== currentUserId
                ? `${item?.sender?.firstName} ${item?.sender?.lastName}`
                : ''}
            </Text>
          )}
          <Text
            style={[
              {
                alignSelf:
                  senderId == currentUserId ? 'flex-end' : 'flex-start',
                marginLeft: 10,
              },
              styles.msgTimeTextStyle,
            ]}>
            {moment(item.updatedAt).format('YYYY-MM-DD') == today
              ? moment(item.updatedAt).format('hh:mm A')
              : moment(item.updatedAt).format('hh:mm A DD MMM')}
          </Text>
        </View>
      </>
    );
  };

  return (
    <View style={{flex: 1, marginBottom: 4}}>
     
      {renderTextViewItem()}
      {/* {item?.attachments?.length > 0 ? (
        <>
          {item.text == CHAT_MESSAGE_TYPE.ATTACHMENT_VIDEO
            ? renderVideoViewItem()
            : item.text == CHAT_MESSAGE_TYPE.ATTACHMENT_IMAGE
            ? renderImageViewItem()
            : item.text == CHAT_MESSAGE_TYPE.ATTACHMENT_FILE
            ? renderFileViewItem()
            : checkIsURLText(item)
            ? renderHyperlinkedTextViewItem()
            : renderTextViewItem()}
        </>
      ) : (
        <>
          {checkIsURLText(item)
            ? renderHyperlinkedTextViewItem()
            : renderTextViewItem()}
        </>
      )} */}
    </View>
  );
};

export default MessageItemComponent;

const styles = StyleSheet.create({
  isGroupViewStyle: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  isGroupImgStyle: {
    width: 25,
    height: 25,
    borderRadius: 100,
  },

  isGroupTextStyle: {
    fontSize: 12,
    lineHeight: 18,
    marginStart: 5,
    fontWeight: '500',
    fontStyle: 'normal',
    color: AppColors.black,
  },

  chatImgVideoStyle: {
    width: 200,
    height: 200,
    borderRadius: 5,
  },

  msgTextStyle: {
    fontSize: 13,
    lineHeight: 18,
    color: AppColors.black,
  },

  msgTimeTextStyle: {
    fontSize: 12,
    marginTop: 3,
    lineHeight: 14,
    color: AppColors.dim_gray,
  },

  msgViewStyle: {
    padding: 10,
    marginTop: 20,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'baseline',
  },

  quotchatImgVideoStyle: {
    width: 70,
    height: 70,
    marginTop: 10,
    borderRadius: 5,
  },

  loaderViewStyle: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
  },

  itemSeperatorStyle: {
    width: '0.3%',
    flex: 1,
    backgroundColor: AppColors.dark_gray,
    alignSelf: 'center',
  },
});
