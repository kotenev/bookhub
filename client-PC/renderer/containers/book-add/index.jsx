import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TopFixed from 'components/top-fixed/index';
import Table from 'components/table/index';

import {
  addFileInfo,
  addBookToRepo,
  clearScanLog,
  selectAll,
  selectNone,
} from 'actions';

import styles from './book-add.scss';

const mapStateToProps = (state, ownProps) => ({
  bookList: state.scanLog,
  ...ownProps,
});

const mapDispatchToProps = dispatch => ({
  addFileInfo: fileInfo => dispatch(addFileInfo(fileInfo)),
  addBookToRepo: (md5, srcFullPath, bookMeta) => (
    dispatch(addBookToRepo(md5, srcFullPath, bookMeta))
  ),
  clearScanLog: () => dispatch(clearScanLog()),
  selectAll: () => dispatch(selectAll()),
  selectNone: () => dispatch(selectNone()),
});

// https://github.com/electron/electron/issues/9920
const { ipcRenderer } = window.require('electron');

const colTitles = [
  {
    text: 'Title',
    file: 'titleDisplay',
  },
  {
    text: 'Type',
    file: 'extname',
  },
  {
    text: 'Size',
    file: 'sizeReadable',
  },
  // {
  //   text: 'MD5',
  //   file: 'md5',
  // },
  {
    text: 'Path',
    file: 'srcFullPath',
  },
];

/* eslint-disable react/prefer-stateless-function */
class ConnectedBookAdd extends React.Component {
  constructor() {
    super();
    this.addBooksToRepo = this.addBooksToRepo.bind(this);
  }
  componentDidMount() {
    ipcRenderer.on('scan:file:found', (e, fileInfo) => {
      this.props.addFileInfo(fileInfo);
    });
  }
  addBooksToRepo() {
    this.props.bookList.forEach(bookMeta => {
      if (bookMeta.isSelected && bookMeta.md5 && bookMeta.srcFullPath) {
        this.props.addBookToRepo(bookMeta.md5, bookMeta.srcFullPath, bookMeta);
      }
      // log error is !bookMeta.md5 or !bookMeta.srcFullPath
    });
    this.props.clearScanLog();
    window.location.assign('#/recently-read');
  }
  render() {
    return (
      <div className={styles.wrap}>
        <TopFixed type="add-book" />
        <div className={styles.contentWrap}>
          <Table
            type="add-book"
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
  })).isRequired,
  addFileInfo: PropTypes.func.isRequired,
  addBookToRepo: PropTypes.func.isRequired,
  clearScanLog: PropTypes.func.isRequired,
  selectAll: PropTypes.func.isRequired,
  selectNone: PropTypes.func.isRequired,
};

const BookAdd = connect(mapStateToProps, mapDispatchToProps)(ConnectedBookAdd);

export default BookAdd;
