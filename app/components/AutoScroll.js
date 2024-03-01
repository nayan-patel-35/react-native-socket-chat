import React, {Component} from 'react';
import {Keyboard, ScrollView} from 'react-native';

export default class AutoScroll extends Component {
  constructor(props, context) {
    super(props, context);

    this.contentHeight = null;
    this.scrollHeight = null;
    this.scrollY = null;
    // self binding
    [
      'handleKeyboardShow',
      'handleKeyboardHide',
      'handleLayout',
      'handleContentChange',
      'handleScroll',
    ].forEach(method => {
      this[method] = this[method].bind(this);
    });
  }

  componentDidMount() {
    Keyboard.addListener('keyboardDidShow', this.handleKeyboardShow);
    Keyboard.addListener('keyboardDidHide', this.handleKeyboardHide);
  }

  handleKeyboardShow() {
    this.scrollToBottom();
  }

  handleKeyboardHide() {
    const {scrollY, scrollHeight, contentHeight} = this;

    // fix top blank if exsits
    if (scrollY > contentHeight - scrollHeight) {
      // this.refs.scroller.scrollTo({y: 0});
    }
    // fix bottom blank if exsits
    // else {
    //   this.scrollToBottom();
    // }
    else {
      // this.refs.scroller.scrollTo({y: scrollY});
    }
  }

  handleScroll(e) {
    this.scrollY = e.nativeEvent.contentOffset.y;
  }
  handleLayout(e) {
    this.scrollHeight = e.nativeEvent.layout.height;
  }

  handleContentChange(w, h) {
    // repeated called on Android
    // should do diff
    if (h === this.contentHeight) return;
    this.contentHeight = h;

    if (this.scrollHeight == null) {
      setTimeout(() => {
        this.scrollToBottomIfNecessary();
      }, 500);
    } else {
      this.scrollToBottomIfNecessary();
    }
  }

  scrollToBottomIfNecessary() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    const {scrollHeight, contentHeight} = this;
    if (scrollHeight == null) {
      return;
    }

    if (contentHeight > scrollHeight && this?.refs?.scroller !== undefined) {
      if (this?.refs?.scroller?.scrollTo !== undefined) {
        this.refs.scroller?.scrollTo({y: contentHeight - scrollHeight});
      }
    }
  }

  render() {
    return (
      <ScrollView
        ref="scroller"
        scrollEventThrottle={16}
        onScroll={this.handleScroll}
        onLayout={this.handleLayout}
        onContentSizeChange={this.handleContentChange}
        {...this.props}></ScrollView>
    );
  }
}
