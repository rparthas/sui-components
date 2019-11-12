import React, {useState, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

const BASE_CLASS = 'react-AtomToast'

const POSITIONS = {
  BOTTOM: 'bottom',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
  TOP: 'top',
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right'
}

const AUTO_CLOSE_TIMES = {
  SHORT: 3000,
  MEDIUM: 6000,
  LONG: 9000
}

function AtomToast({
  autoClose = false,
  autoCloseTime = AUTO_CLOSE_TIMES.MANUAL,
  children,
  onClose = () => {},
  position = POSITIONS.BOTTOM,
  show: showFromProps = true
}) {
  const [show, setShow] = useState(showFromProps)

  const autoCloseTimeout = useRef()

  const wrapperClassName = cx(`${BASE_CLASS} ${BASE_CLASS}--${position}`)

  useEffect(() => {
    setShow(showFromProps)
  }, [showFromProps])

  useEffect(() => {
    if (autoClose) {
      autoCloseTimeout.current = setTimeout(() => {
        setShow(false)
        onClose()
      }, autoCloseTime)
    }

    return () => clearTimeout(autoCloseTimeout.current)
  })

  if (!show) return null

  return <div className={wrapperClassName}>{children}</div>
}

AtomToast.displayName = 'AtomToast'

AtomToast.propTypes = {
  autoClose: PropTypes.bool,
  autoCloseTime: PropTypes,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  /** Positions: 'top-left', 'top', 'top-right', 'bottom-left', 'bottom', 'bottom-right' */
  position: PropTypes.oneOf(Object.keys(POSITIONS)),
  show: PropTypes.bool
}

export {
  POSITIONS as atomToastPosistions,
  AUTO_CLOSE_TIMES as atomToastAutoCloseTimes
}
export default AtomToast
