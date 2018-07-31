import React, {Component} from 'react'
import PropTypes from 'prop-types'
import RuleHeaderSave from 'src/kapacitor/components/RuleHeaderSave'
import {ErrorHandling} from 'src/shared/decorators/errors'
import ThemeColorDropdown from 'src/shared/components/ThemeColorDropdown'

@ErrorHandling
class RuleHeader extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {source, onSave, validationError} = this.props

    return (
      <div className="page-header">
        <div className="page-header__container">
          <div className="page-header__left">
            <h1 className="page-header__title">Alert Rule Builder</h1>
          </div>
          <div className="page-header__right">
            <ThemeColorDropdown />
          </div>
          <RuleHeaderSave
            source={source}
            onSave={onSave}
            validationError={validationError}
          />
        </div>
      </div>
    )
  }
}

const {func, shape, string} = PropTypes

RuleHeader.propTypes = {
  source: shape({}).isRequired,
  onSave: func.isRequired,
  validationError: string.isRequired,
}

export default RuleHeader
