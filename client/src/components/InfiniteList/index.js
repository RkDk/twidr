import React from 'react';
import {
  CSSTransition,
  TransitionGroup
} from 'react-transition-group';
import Spinner from 'react-bootstrap/Spinner';
import Constants from '../../constants';
import Utils from '../../utils';
import styles from './styles.module.scss';
  
class InfiniteList extends React.Component {
  constructor( props ) {
    super( props );
    this.ref = React.createRef( null );
    this.state = {
      items: [],
      showSpinner: false,
      fetchedEverything: false
    };
    this.nextApiFetch = 0;
    this.handleScroll = this.handleScroll.bind( this );
  }
  handleScroll() {
    if( this.state.showSpinner || this.state.fetchedEverything ) {
      return;
    }   
    console.log(  Utils.getDocumentScrollPercentage() );
    if( Utils.getDocumentScrollPercentage() > .9 ) {
      this.setState( {
        showSpinner: true,
        fetchedEverything: false
      } );
      setTimeout( () => {
        this.loadItems( Constants.USERFEED_FETCH_COUNT );
      }, Math.max( this.nextApiFetch - Date.now(), Constants.MIN_DELAY_BETWEEN_USERFEED_FETCH ) );
    } 
  }
  componentDidMount() {
    const thisY = Utils.getElementTop( this.ref?.current );
    const initialElementHeight = ( Utils.getViewportHeight() - thisY );
    const initialLimit = Math.ceil( initialElementHeight / 150 ); 
    this.loadItems( initialLimit );
    window.addEventListener( 'scroll', this.handleScroll );
  }
  mapItems( items ) {
    return items.map( item => {
      return {
        item, 
        ref: React.createRef( null ),
        newlyCreated: false
      };
    } );
  }
  addItems( items ) {
    const newItems = this.mapItems( items );
    this.setState( {
      items: [ ...this.state.items, ...newItems ]
    } );
  }
  async loadItems( count ) {
    const items = await this.props.loadItems( count, this.dateOffset )
      .then( items => this.mapItems( items ) )
      .then( newItems => {
        const { items: curItems } = this.state;
        curItems.push( ...newItems.sort( ( b, a ) => +new Date( a.item.createdAt ) - +new Date( b.item.createdAt ) ) );
        this.setState( {
          items: curItems,
          showSpinner: false,
          fetchedEverything: newItems.length === 0
        } );
        if( newItems.length ) {
          this.dateOffset = newItems[newItems.length-1].item.createdAt;
        }
        this.nextApiFetch = Date.now() + Constants.MAX_DELAY_BETWEEN_USERFEED_FETCH;
      } );
  }
  renderItems() {
    const itemList = this.state.items.map( ( itemData, index ) => {
      const { item, ref, newlyCreated } = itemData;
      const delay = Math.max( 0,index-( this.renderedItemCount-1 ) ) * 50;
      const timeout = 500 + delay;
      const transitionDelay = `${delay}ms`;
      return (
        <CSSTransition in={true} timeout={timeout} key={item.id} 
          nodeRef={ref}
          classNames={{
            enter: newlyCreated? styles.itemEntering : styles.itemEntering,
            enterActive: newlyCreated? styles.itemActive : styles.itemActive
          }}>
          {
            <div ref={ref} style={{transitionDelay}}>
              {this.props.renderItem( item )}
            </div>
          }
        </CSSTransition>
      );
    } );
    this.renderedItemCount = this.state.items.length;
    return itemList;
  }
  render() {
    const { containerClassname } = this.props;
    return (
      <div ref={this.ref}>
        <TransitionGroup className={containerClassname}>
          {this.renderItems()}
        </TransitionGroup>
        {this.state.showSpinner || this.state.fetchedEverything? 
          (
            <div className={styles.footer}>
              {this.state.showSpinner? <Spinner animation="border" /> : null}
              {this.state.fetchedEverything? <b>{'That\'s all!'}</b> : null}
            </div> 
          ) : null
        }
      </div>
    );
  }
}

export default InfiniteList;