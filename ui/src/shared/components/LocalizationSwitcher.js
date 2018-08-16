import React, {Component} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {ErrorHandling} from 'src/shared/decorators/errors'
import {withRouter} from 'react-router'
import cookie from 'react-cookies'
import i18n from 'src/localizations/i18n'

@ErrorHandling
class LocalizationSwitcher extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      selectedLang: cookie.load('selectedLang') || 'en',
    }
  }

  handleClickOutside() {
    this.setState({isOpen: false})
  }

  componentDidMount() {
    const {selectedLang} = this.state
    i18n.changeLanguage(selectedLang)
  }

  handleSelection = lang => () => {
    i18n.changeLanguage(lang)
    this.setState({isOpen: false})
    this.setState({selectedLang: lang})
    cookie.save('selectedLang', lang, {path: '/'})
    const {router, location} = this.props
    router.push({pathname: location.pathname})
  }

  toggleMenu = () => this.setState({isOpen: !this.state.isOpen})
  render() {
    const {selectedLang, isOpen} = this.state
    return (
      <div className={classnames('autorefresh-dropdown')}>
        <div className={classnames('dropdown dropdown-120', {open: isOpen})}>
          <div
            className="btn btn-sm btn-info dropdown-toggle"
            onClick={this.toggleMenu}
          >
            <span className={classnames('icon', 'shuffle')} />
            <span className="dropdown-selected">{selectedLang}</span>
            <span className="caret" />
          </div>
          <ul className="dropdown-menu">
            <li className="dropdown-header">Выберите язык</li>

            <li className="dropdown-item">
              <a href="#" onClick={this.handleSelection('en')}>
                En
              </a>
            </li>
            <li className="dropdown-item">
              <a href="#" onClick={this.handleSelection('ru')}>
                Ru
              </a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

const {func, shape, string} = PropTypes

LocalizationSwitcher.propTypes = {
  router: shape({
    push: func.isRequired,
  }).isRequired,
  location: shape({
    query: shape({
      redirectPath: string,
    }).isRequired,
  }).isRequired,
}

export default withRouter(LocalizationSwitcher)
