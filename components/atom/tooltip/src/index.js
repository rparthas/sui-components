import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import {Tooltip} from 'reactstrap'
import withIntersectionObserver from './hoc/withIntersectionObserver'

const BASE_CLASS = 'sui-AtomTooltip'
const CLASS_INNER = `${BASE_CLASS}-inner`
const PREFIX_PLACEMENT = `${BASE_CLASS}-`
const CLASS_TARGET = `${BASE_CLASS}-target`

const PLACEMENTS = {
  TOP: 'top',
  TOP_START: 'top-start',
  TOP_END: 'top-end',
  TOP_RIGHT: 'right',
  RIGHT_START: 'right-start',
  RIGHT_END: 'right-end',
  BOTTOM: 'bottom',
  BOTTOM_START: 'bottom-start',
  BOTTOM_END: 'bottom-end',
  LEFT: 'left',
  LEFT_START: 'left-start',
  LEFT_END: 'left-end'
}

class AtomTooltip extends Component {
  state = {isOpen: false}
  preventNonTouchEvents = false
  hasTouchEnded = false
  refTooltip = React.createRef()
  refTarget = React.createRef()

  static defaultProps = {
    isVisible: true
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.isVisible && prevState.isOpen) {
      return {isOpen: false}
    }
    return null
  }

  extendChildren() {
    const {children} = this.props // eslint-disable-line react/prop-types

    const ref = this.refTarget
    const className = CLASS_TARGET
    const onTouchEnd = this.toggle

    const childrenOnly = React.Children.only(children)

    return React.Children.map(childrenOnly, child => {
      this.onClickTarget = child.props.onClick
      return React.cloneElement(child, {
        ref,
        onClick: null,
        className,
        onTouchEnd
      })
    })
  }

  componentDidMount() {
    const target = this.refTarget.current
    this.props.innerRef(target)
    document.addEventListener('click', this.handleClickOutsideElement)
    target.oncontextmenu = this.handleContextMenu
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutsideElement)
    this.refTarget.removeEventListener('touchend', this.toggle)
  }

  handleContextMenu = e => {
    e.preventDefault()
    e.stopPropagation()
    return false
  }

  handleClickOutsideElement = e => {
    const {isOpen} = this.state
    if (isOpen) {
      // // console.log('closing from handleClickOutsideElement → ', {type})
      const tooltipDom = this.refTooltip.current
      const isOutside = tooltipDom && !tooltipDom.contains(e.target)
      if (isOutside) this.toggle(e)
    }
  }

  handleTouchStart = e => {
    this.preventNonTouchEvents = true
    this.hasTouchEnded = false
    clearInterval(this.touchTimer)
    this.touchTimer = setTimeout(() => {
      if (!this.hasTouchEnded) {
        this.setState({
          isOpen: !this.state.isOpen
        })
      }
      this.preventNonTouchEvents = false
      this.hasTouchEnded = false
    }, 2500)
    return false
  }

  handleTouchEnd = e => {
    if (!this.preventNonTouchEvents) {
      e.preventDefault()
      e.stopPropagation()
    }
    this.hasTouchEnded = true
    clearInterval(this.touchTimer)
  }

  toggle = e => {
    // const {type} = e
    // const {preventNonTouchEvents, hasTouchEnded, disableClick} = this
    // console.log({type, preventNonTouchEvents, hasTouchEnded, disableClick})

    if (e.type === 'touchstart') {
      this.handleTouchStart(e)
    }
    if (e.type === 'touchend') {
      this.handleTouchEnd(e)
    }
    if (e.type === 'click') {
      this.onClickTarget && this.onClickTarget(e)
    }

    if (!this.preventNonTouchEvents) {
      this.setState({
        isOpen: !this.state.isOpen
      })
    } else {
      return false
    }
  }

  render() {
    const {hideArrow, delay, autohide, placement} = this.props // eslint-disable-line react/prop-types
    const target = this.refTarget.current
    const restrictedProps = {
      hideArrow,
      target,
      delay,
      autohide,
      placement
    }
    // console.log(restrictedProps)
    // console.log(this.tooltipContent)
    return (
      <Fragment>
        {this.extendChildren()}
        {target && (
          <Tooltip
            {...restrictedProps}
            isOpen={this.state.isOpen}
            toggle={this.toggle}
            className={BASE_CLASS}
            innerClassName={CLASS_INNER}
            placementPrefix={PREFIX_PLACEMENT}
            innerRef={this.refTooltip}
            offset="auto,4px"
          >
            {this.props.title}
          </Tooltip>
        )}
      </Fragment>
    )
  }
}

AtomTooltip.displayName = 'AtomTooltip'

AtomTooltip.propTypes = {
  /** Wether to show arrow or not. */
  hideArrow: PropTypes.bool,

  /** target element or element ID, popover is attached to this element */
  /*
  target: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    DOMElement // instanceof Element (https://developer.mozilla.org/en-US/docs/Web/API/Element)
  ]).isRequired,
  */

  /** Optionally override show/hide delays. Default  → { show: 0, hide: 250 } */
  delay: PropTypes.oneOfType([
    PropTypes.shape({
      show: PropTypes.number,
      hide: PropTypes.number
    }),
    PropTypes.number
  ]),

  /** optionally hide tooltip when hovering over tooltip content. Default → true */
  autohide: PropTypes.bool,

  /** Tooltip and arrow position */
  placement: PropTypes.oneOf(Object.values(PLACEMENTS)),

  /** True if the component is inside the viewport */
  isVisible: PropTypes.bool,

  /** Text to be displayed on the Tooltip */
  title: PropTypes.string,

  /** Custom ref handler that will be assigned to the "target" element */
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.object
  ])
}

export default withIntersectionObserver(0.5)(AtomTooltip)
export {PLACEMENTS as atomTooltipPlacements}
