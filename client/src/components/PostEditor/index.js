import React from 'react';
import Constants from '../../constants';
import styles from './styles.module.css';
import ApiService from '../../services/ApiService';
import { ArrowRightCircleFill } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import {
  CSSTransition
} from 'react-transition-group';

class PostEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPostButton: false,
      value: ''
    };
    this.onConfirm = this.onConfirm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }
  async onConfirm() {
    const post = await ApiService.createPost( this.state.value );
    this.props.onUserCreatedPost( post );
  }
  onChange(ev) {
    this.setState( {
      value: ev.target.value.substring( 0, Constants.MAX_POST_CHARACTERS )
    });
  }
  onFocus() {
    this.setState( {
      showPostButton: true 
    });
  }
  onBlur() {
    this.setState( {
      showPostButton: false
    });
  }
  render() {
    return (
      <div className={styles.container}>
        <div>
          <Form.Control as="textarea" value={this.state.value} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} placeholder="What's on your mind?" rows={3} className={`${styles.inputTextArea} ${this.state.showPostButton ? styles.containerSplit : styles.containerFull }`}/>
        </div>
        <CSSTransition in={this.state.showPostButton || this.state.value.length > 0} timeout={1000} classNames={{
          enter: styles.postBtnEnter,
          enterActive: styles.postBtnEnterActive,
          enterDone: styles.postBtnVisible,
          exit: styles.postBtnExit,
          exitActive: styles.postBtnExitActive,
          exitDone: styles.postBtnHidden
        }}>
          <div className={styles.btnRow}>
            <div className={styles.charCount}>{Constants.MAX_POST_CHARACTERS - this.state.value.length} characters left</div>
            <ArrowRightCircleFill onClick={this.onConfirm} color={"#3771c8"} className={styles.postBtn}/>
          </div>
        </CSSTransition> 
      </div>
    );   
  }
}

export default PostEditor;
