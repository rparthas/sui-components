import React, {Component} from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

const CLASS = 'sui-FormInput-input'
const SIZES = {
  MEDIUM: 'm',
  SMALL: 's'
}

class Input extends Component {
  changeHandler(ev, onChange) {
    onChange && onChange({value: ev.target.value, ev})
  }

  getClassNames({size}) {
    return cx(CLASS, `${CLASS}-${size}`)
  }

  render() {
    const {
      disabled,
      id,
      name,
      onChange,
      placeholder,
      reference,
      size,
      type,
      value
    } = this.props

    return (
      <input
        className={this.getClassNames({size})}
        disabled={disabled}
        id={id}
        name={name}
        onChange={ev => this.changeHandler(ev, onChange)}
        placeholder={placeholder}
        ref={reference}
        type={type}
        value={value}
      />
    )
  }
}

Input.propTypes = {
  /* This Boolean attribute prevents the user from interacting with the input */
  disabled: PropTypes.bool,
  /* The DOM id global attribute. */
  id: PropTypes.string,
  /* sets the name property of an element in the DOM */
  name: PropTypes.string,
  /* onChange callback */
  onChange: PropTypes.func,
  /* A hint to the user of what can be entered in the control. The placeholder text must not contain carriage returns or line-feeds. */
  placeholder: PropTypes.string,
  /* 's' or 'm', default: 'm' */
  size: PropTypes.oneOf(Object.values(SIZES)),
  /* text, password, date or number */
  type: PropTypes.string,
  /* value of the control */
  value: PropTypes.string,
  /* react ref to access DOM node */
  reference: PropTypes.func
}

Input.defaultProps = {
  size: SIZES.MEDIUM
}

export default Input
export {SIZES as InputSizes}
