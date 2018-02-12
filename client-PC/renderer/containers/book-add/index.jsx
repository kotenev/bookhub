import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TopFixed from '../../components/top-fixed/index';
import Table from '../../components/table/index';
import styles from './book-add.scss';

import {
  addBookMeta,
  addBookToRepo,
  selectAll,
  selectNone,
} from '../../actions';

const mapStateToProps = (state, ownProps) => ({
  bookList: state.scanLog,
  ...ownProps,
});

const mapDispatchToProps = dispatch => ({
  addBookMeta: metaInfo => dispatch(addBookMeta(metaInfo)),
  addBookToRepo: (md5, srcPath, bookMeta) => dispatch(addBookToRepo(md5, srcPath, bookMeta)),
  selectAll: () => dispatch(selectAll()),
  selectNone: () => dispatch(selectNone()),
});

// https://github.com/electron/electron/issues/9920
const { ipcRenderer } = window.require('electron');

const colTitles = [
  {
    text: 'Title',
    file: 'rawname',
  },
  // {
  //   text: 'MD5',
  //   file: 'md5',
  // },
  // {
  //   text: 'Year',
  //   file: 'year',
  // },
  {
    text: 'Path',
    file: 'path',
  },
  // {
  //   text: 'Type',
  //   file: 'ext',
  // },
  {
    text: 'Size',
    file: 'sizeReadable',
  },
  // {
  //   text: 'Create Time',
  //   file: 'createTime',
  // },
  // {
  //   text: 'Tags',
  //   file: 'tags',
  // },
];

/* eslint-disable react/prefer-stateless-function */
class ConnectedBookAdd extends React.Component {
  constructor() {
    super();
    this.addBooksToRepo = this.addBooksToRepo.bind(this);
  }
  componentDidMount() {
    ipcRenderer.on('scan:book:found', (e, metaInfo) => {
      this.props.addBookMeta(metaInfo);
    });
  }
  addBooksToRepo() {
    this.props.bookList.forEach(bookMeta => {
      if (bookMeta.isSelected && bookMeta.md5) {
        this.props.addBookToRepo(bookMeta.md5, bookMeta.srcPath, bookMeta);
      }
      // log error is !bookMeta.md5 or !bookMeta.srcPath
    });
  }
  render() {
    return (
      <div className={styles.wrap}>
        <TopFixed type="add" />
        <div className={styles.contentWrap}>
          <Table
            type="add"
            colTitles={colTitles}
            bookList={this.props.bookList}
          />
        </div>
        <div className={styles.operationGrop}>
          <div className={styles.leftBtnGrop}>
            <span role="button" className={styles.selectBtn} onClick={this.props.selectAll}>All</span>
            <span role="button" className={styles.selectBtn} onClick={this.props.selectNone}>None</span>
          </div>
          <button
            className={styles.addHub}
            onClick={this.addBooksToRepo}
          >
            Add To Library
          </button>
        </div>
      </div>
    );
  }
}

ConnectedBookAdd.propTypes = {
  bookList: PropTypes.arrayOf(PropTypes.shape({
    md5: PropTypes.string.isRequired,
    ext: PropTypes.string.isRequired,
  })).isRequired,
  addBookMeta: PropTypes.func.isRequired,
  addBookToRepo: PropTypes.func.isRequired,
  selectAll: PropTypes.func.isRequired,
  selectNone: PropTypes.func.isRequired,
};

const BookAdd = connect(mapStateToProps, mapDispatchToProps)(ConnectedBookAdd);

export default BookAdd;
