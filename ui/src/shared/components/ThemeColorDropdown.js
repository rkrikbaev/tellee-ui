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
    cellBgColor: 'linear-gradient(#ebedee80, #fdfbfb80)',
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

            '--px-vis-gridlines-color': '#b2babf',
            '--px-vis-cursor-line-color': '#676a6f',

            '--px-vis-register-box': '#1be200',
            '--px-vis-register-data-value': '#434547',
            '--px-vis-register-series-name': '#919699',

            '--px-vis-series-color-0': '#60C1F8',

            '--px-vis-axis-color': '#b2babf',
            '--px-vis-axis-title-color': '#3c475f',
            '--px-vis-axis-inline-title-color': '#919699',
            '--px-vis-axis-inline-type-color': '#919699',
            '--px-vis-axis-inline-box-color': '#b2babf',

            '--px-tooltip-background-color': '#3c475f',
            '--px-tooltip-text-color': '#f8425f',
            '--px-tooltip-light-background-color': '#f8425f',
            '--px-tooltip-light-text-color': '#f8425f',
            '--px-tooltip-light-border-color': '#f8425f',

            '--px-vis-font-family': 'Arial',
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
