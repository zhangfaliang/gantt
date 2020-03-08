import './index.module.scss';

import React, { Component } from 'react';
const height = 24;
const bufferSize = 5;

class Item extends Component {
  componentDidMount() {
    /* eslint-disable-next-line */
    this.props.cachePosition(this.node, this.props.index);
  }

  render() {
    /* eslint-disable-next-line */
    const { index, item } = this.props;

    return (
      <div
        className="list-item"
        style={{ height: '24px' }}
        ref={node => {
          this.node = node;
        }}
      >
        <p>#${index} eligendi voluptatem quisquam</p>
        <p>
          Modi autem fugiat maiores. Doloremque est sed quis qui nobis.
          Accusamus dolorem aspernatur sed rem.
        </p>
      </div>
    );
  }
}

export default class VirtualizedList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startOffset: 0,
      endOffset: 0,
      visibleData: []
    };

    this.data = new Array(1000).fill(true);

    this.startIndex = 0;
    this.endIndex = 0;
    this.scrollTop = 0;

    this.doc = null;

    // 缓存已渲染元素的位置信息
    this.cache = [];
    // 缓存锚点元素的位置信息
    this.anchorItem = {
      index: 0, // 锚点元素的索引值
      top: 0, // 锚点元素的顶部距离第一个元素的顶部的偏移量(即 startOffset)
      bottom: 0 // 锚点元素的底部距离第一个元素的顶部的偏移量
    };

    this.handleScroll = this.handleScroll.bind(this);
    this.cachePosition = this.cachePosition.bind(this);
  }

  cachePosition(node, index) {
    const rect = node.getBoundingClientRect();
    const top = rect.top + window.pageYOffset;

    this.cache.push({
      index,
      top,
      bottom: top + height
    });
  }

  // 滚动事件处理函数
  handleScroll(e) {
    if (!this.doc) {
      // 兼容 iOS Safari/Webview
      this.doc = window.document.body.scrollTop
        ? window.document.body
        : window.document.documentElement;
    }

    const scrollTop = this.doc.scrollTop;
    if (scrollTop > this.scrollTop) {
      if (scrollTop > this.anchorItem.bottom) {
        this.updateBoundaryIndex(scrollTop);
        this.updateVisibleData();
      }
    } else if (scrollTop < this.scrollTop) {
      if (scrollTop < this.anchorItem.top) {
        this.updateBoundaryIndex(scrollTop);
        this.updateVisibleData();
      }
    }

    this.scrollTop = scrollTop;
  }

  // 计算 startIndex 和 endIndex
  updateBoundaryIndex(scrollTop) {
    scrollTop = scrollTop || 0;
    // 用户正常滚动下，根据 scrollTop 找到新的锚点元素位置
    const anchorItem = this.cache.find(item => item.bottom >= scrollTop);

    if (!anchorItem) {
      // 滚的太快，找不到锚点元素，这个暂不处理
      return;
    }

    this.anchorItem = {
      ...anchorItem
    };

    this.startIndex = this.anchorItem.index;
    this.endIndex = this.startIndex + this.visibleCount;
  }

  updateVisibleData() {
    const visibleData = this.data.slice(this.startIndex, this.endIndex);

    this.setState({
      startOffset: this.anchorItem.top,
      endOffset: (this.data.length - this.endIndex) * height,
      visibleData
    });
  }

  componentDidMount() {
    // 计算可渲染的元素个数
    this.visibleCount = Math.ceil(window.innerHeight / height) + bufferSize;
    this.endIndex = this.startIndex + this.visibleCount;
    this.updateVisibleData();

    window.addEventListener('scroll', this.handleScroll, false);
  }

  render() {
    const { startOffset, endOffset, visibleData } = this.state;

    return (
      <div
        className="wrapper"
        ref={node => {
          this.wrapper = node;
        }}
      >
        <div
          style={{
            paddingTop: `${startOffset}px`,
            paddingBottom: `${endOffset}px`
          }}
        >
          {visibleData.map((item, index) => {
            return (
              <Item
                cachePosition={this.cachePosition}
                key={this.startIndex + index}
                index={this.startIndex + index}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
