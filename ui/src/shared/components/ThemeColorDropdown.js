import React, {Component} from 'react'
import classnames from 'classnames'
import OnClickOutside from 'shared/components/OnClickOutside'

import {ErrorHandling} from 'src/shared/decorators/errors'
import CustomProperties from 'react-custom-properties'

const ThemeMenuItems = [
  {
    themeName: 'dark',
    themeDescr: 'Dark theme descr',
    bradingColor: 'linear-gradient(#141e30, #243b55)',
    resizeControl: 'inline',
    headerTextColor: '#eeeeee',
    cellBgColor: '',
  },
  {
    themeName: 'light',
    themeDescr: 'Light theme descr',
    bradingColor: 'linear-gradient(#f5f7fa, #c3cfe2)',
    resizeControl: 'inline',
    headerTextColor: '#3c475f',
    cellBgColor: 'linear-gradient(#93a5cf35, #e4efe940)',
  },
  {
    themeName: 'very light',
    themeDescr: 'Light theme descr',
    bradingColor: '#ffffff',
    resizeControl: 'inline',
    headerTextColor: '#3c475f',
    cellBgColor: '#ffffff',
  },
]

@ErrorHandling
class ThemeColorDropdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      selectedTheme: 'light',
    }
  }

  handleClickOutside() {
    this.setState({isOpen: false})
  }

  handleSelection = themeName => () => {
    this.setState({isOpen: false})
    this.setState({selectedTheme: themeName})
  }

  toggleMenu = () => this.setState({isOpen: !this.state.isOpen})

  render() {
    const {selectedTheme} = this.state
    const {isOpen} = this.state
    const currentTheme = ThemeMenuItems.find(
      values => values.themeName === selectedTheme
    )
    return (
      <div className={classnames('autorefresh-dropdown')}>
        {/* set global styling params */}
        <CustomProperties
          global={true}
          properties={{
            '--zsse-branding-color': currentTheme.bradingColor,
            '--zsse-resize-control': currentTheme.resizeControl,
            '--zsse-header-text-color': currentTheme.headerTextColor,
            '--zsse-cell-bg': currentTheme.cellBgColor,
            '--px-percent-circle-fill-color': '#308ec1',
            '--px-base-text-color': '#ffffff',
            '--px-percent-circle-text-color': '#3c475f',
          }}
        />

        {/* eof styling */}
        <div className={classnames('dropdown dropdown-120', {open: isOpen})}>
          <div
            className="btn btn-sm btn-warning dropdown-toggle"
            onClick={this.toggleMenu}
          >
            <span className={classnames('icon', 'refresh')} />
            <span className="dropdown-selected">{selectedTheme}</span>
            <span className="caret" />
          </div>
          <ul className="dropdown-menu">
            <li className="dropdown-header">Color Theme</li>
            {ThemeMenuItems.map(item => (
              <li className="dropdown-item" key={item.themeName}>
                <a href="#" onClick={this.handleSelection(item.themeName)}>
                  {item.themeName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default OnClickOutside(ThemeColorDropdown)
