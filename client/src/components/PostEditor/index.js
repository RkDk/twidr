import React from 'react';
import styles from './styles.module.css';
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
    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }
  onChange(ev) {
    this.setState( {
      value: ev.target.value
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
        <div><Form.Control as="textarea" value={this.state.value} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} placeholder="What's on your mind?" rows={3} className={`${styles.inputTextArea} ${this.state.showPostButton ? styles.containerSplit : styles.containerFull }`}/></div>
        { 
           <CSSTransition in={this.state.showPostButton || this.state.value.length} timeout={1000} classNames={{
             enter: styles.postBtnEnter,
             enterActive: styles.postBtnEnterActive,
             enterDone: styles.postBtnVisible,
             exit: styles.postBtnExit,
             exitActive: styles.postBtnExitActive,
             exitDone: styles.postBtnHidden
           }}>
              <div className={styles.btnRow}><ArrowRightCircleFill color={"#709AD8"} className={styles.postBtn}/></div>
           </CSSTransition> 
           }
      </div>
    );   
  }
}

export default PostEditor;
