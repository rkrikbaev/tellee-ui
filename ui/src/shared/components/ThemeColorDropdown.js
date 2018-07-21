import React, {Component} from 'react'
import classnames from 'classnames'
import OnClickOutside from 'shared/components/OnClickOutside'

import {ErrorHandling} from 'src/shared/decorators/errors'
import CustomProperties from 'react-custom-properties'

const ThemeMenuItems = [
  {
    themeName: 'dark',
    themeDescr: 'Dark theme descr',
    bradingColor: 'linear-gradient(#606c88, #3f4c6b)',
    resizeControl: 'inline',
    headerTextColor: '#eeeeee',
    cellBgColor: '',
  },
  {
    themeName: 'light',
    themeDescr: 'Light theme descr',
    bradingColor: 'linear-gradient(#cfd9df, #e2ebf0)',
    resizeControl: 'inline',
    headerTextColor: '#3c475f',
    cellBgColor: '#ffffff45',
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
    const currentTheme= ThemeMenuItems.find(values => values.themeName === selectedTheme)
    return (
      <div className={classnames('autorefresh-dropdown')}>
        {/* set global styling params */}
        <CustomProperties global={true} properties={{ '--zsse-branding-color': currentTheme.bradingColor }} />
        <CustomProperties global={true} properties={{ '--zsse-resize-control': currentTheme.resizeControl }} />
        <CustomProperties global={true} properties={{ '--zsse-header-text-color': currentTheme.headerTextColor }} />
        <CustomProperties global={true} properties={{ '--zsse-cell-bg': currentTheme.cellBgColor }} />
        <CustomProperties global={true} properties={{ '--px-percent-circle-fill-color': '#308ec1' }} />

        {/* eof styling */}
        <div className={classnames('dropdown dropdown-120', {open: isOpen})}>
          <div
            className="btn btn-sm btn-warning dropdown-toggle"
            onClick={this.toggleMenu}
          >
            <span
              className={classnames(
                'icon','refresh'
              )}
            />
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
