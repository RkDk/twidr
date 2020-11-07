import React from 'react';
import Constants from '../../constants';
import styles from './styles.module.scss';
import ApiService from '../../services/ApiService';
import { ArrowRightCircleFill, PencilSquare } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import {
  CSSTransition
} from 'react-transition-group';

class PostEditor extends React.Component {
  constructor(props) {
    super(props);
    this.textAreaRef = React.createRef(null);
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
    this.setState( {
      value: ''
    } );
    this.props.onUserCreatedPost( post );
    this.textAreaRef.current.blur();
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
      <>
        <div className={styles.overlay} style={{display:this.state.showPostButton?'block' : 'none'}}/>
        <div className={styles.container}>
          <div>
            <Form.Control ref={this.textAreaRef} as="textarea" value={this.state.value} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} placeholder="What's on your mind?" rows={3} className={`${styles.inputTextArea} ${this.state.showPostButton ? styles.containerSplit : styles.containerFull }`}/>
          </div>
            <div className={styles.btnRow} onClick={()=>this.textAreaRef.current.focus()}>
              <CSSTransition in={this.state.showPostButton || this.state.value.length > 0} timeout={1000} classNames={{
                enter: styles.postBtnEnter,
                enterActive: styles.postBtnEnterActive,
                enterDone: styles.postBtnVisible,
                exit: styles.postBtnExit,
                exitActive: styles.postBtnExitActive,
                exitDone: styles.postBtnHidden
              }}>
                <div className={styles.charCount}>{Constants.MAX_POST_CHARACTERS - this.state.value.length} characters left</div>
              </CSSTransition>
              <CSSTransition in={!this.state.showPostButton && this.state.value.length === 0} timeout={1000} classNames={{
                enter: styles.postBtnEnter,
                enterActive: styles.postBtnEnterActive,
                enterDone: styles.postBtnVisible,
                exit: styles.postBtnExit,
                exitActive: styles.postBtnExitActive,
                exitDone: styles.postBtnHidden
              }}>
                <div className={styles.centerIcon}><h3><PencilSquare/></h3></div>
              </CSSTransition>
              <CSSTransition in={this.state.showPostButton || this.state.value.length > 0} timeout={1000} classNames={{
                enter: styles.postBtnEnter,
                enterActive: styles.postBtnEnterActive,
                enterDone: styles.postBtnVisible,
                exit: styles.postBtnExit,
                exitActive: styles.postBtnExitActive,
                exitDone: styles.postBtnHidden
              }}>
                <ArrowRightCircleFill onClick={this.onConfirm} className={styles.postBtn}/>
              </CSSTransition>
            </div>
        </div>
      </>
    );   
  }
}

export default PostEditor;
