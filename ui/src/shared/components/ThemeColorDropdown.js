import React, {Component} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import OnClickOutside from 'shared/components/OnClickOutside'
import {ErrorHandling} from 'src/shared/decorators/errors'
import cookie from 'react-cookies'
import CustomProperties from 'react-custom-properties'
import {ThemesPallete} from 'shared/constants/themespallete.js'

@ErrorHandling
class ThemeColorDropdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      selectedTheme: cookie.load('selectedTheme') || 'light',
    }
  }

  handleClickOutside() {
    this.setState({isOpen: false})
  }

  handleSelection = themeName => () => {
    this.setState({isOpen: false})
    this.setState({selectedTheme: themeName})
    cookie.save('selectedTheme', themeName, {path: '/'})
  }

  toggleMenu = () => this.setState({isOpen: !this.state.isOpen})
  render() {
    const {hideDropdown} = this.props
    const {selectedTheme} = this.state
    const {isOpen} = this.state
    const currentTheme = ThemesPallete.find(
      values => values.themeName === selectedTheme
    )
    return (
      <div className={classnames('autorefresh-dropdown')}>
        {/* set global styling params */}
        <CustomProperties
          global={true}
          properties={{
            // Colors override
            '--zsse-g0-obsidian': currentTheme.g0obsidian,
            '--zsse-g1-raven': currentTheme.g1raven,
            '--zsse-g2-kevlar': currentTheme.g2kevlar,
            '--zsse-g3-castle': currentTheme.g3castle,
            '--zsse-g4-onyx': currentTheme.g4onyx,
            '--zsse-g5-pepper': currentTheme.g5pepper,
            '--zsse-g6-smoke': currentTheme.g6smoke,
            '--zsse-g7-graphite': currentTheme.g7graphite,
            '--zsse-g8-storm': currentTheme.g8storm,
            '--zsse-g9-mountain': currentTheme.g9mountain,
            '--zsse-g10-wolf': currentTheme.g10wolf,
            '--zsse-g11-sidewalk': currentTheme.g11sidewalk,
            '--zsse-g12-forge': currentTheme.g12forge,
            '--zsse-g13-mist': currentTheme.g13mist,
            '--zsse-g14-chromium': currentTheme.g14chromium,
            '--zsse-g15-platinum': currentTheme.g15platinum,
            '--zsse-g16-pearl': currentTheme.g16pearl,
            '--zsse-g17-whisper': currentTheme.g17whisper,
            '--zsse-g18-cloud': currentTheme.g18cloud,
            '--zsse-g19-ghost': currentTheme.g19ghost,
            '--zsse-g20-white': currentTheme.g20white,
            // continue...
            '--zsse-c-basalt': currentTheme.cbasalt,
            '--zsse-c-ruby': currentTheme.cruby,
            '--zsse-c-fire': currentTheme.cfire,
            '--zsse-c-fire-disabled': currentTheme.cfiredisabled,
            '--zsse-c-curacao': currentTheme.ccuracao,
            '--zsse-c-curacao-disabled': currentTheme.ccuracaodisabled,
            '--zsse-c-dreamsicle': currentTheme.cdreamsicle,
            '--zsse-c-tungsten': currentTheme.ctungsten,
            '--zsse-c-marmelade': currentTheme.cmarmelade,
            '--zsse-c-flan': currentTheme.cflan,
            '--zsse-c-abyss': currentTheme.cabyss,
            '--zsse-c-sapphire': currentTheme.csapphire,
            '--zsse-c-ocean': currentTheme.cocean,
            '--zsse-c-ocean-disabled': currentTheme.coceandisabled,
            '--zsse-c-pool': currentTheme.cpool,
            '--zsse-c-pool-disabled': currentTheme.cpooldisabled,
            '--zsse-c-laser': currentTheme.claser,
            '--zsse-c-hydrogen': currentTheme.chydrogen,
            '--zsse-c-neutrino': currentTheme.cneutrino,
            '--zsse-c-yeti': currentTheme.cyeti,
            '--zsse-c-shadow': currentTheme.cshadow,
            '--zsse-c-void': currentTheme.cvoid,
            '--zsse-c-amethyst': currentTheme.camethyst,
            '--zsse-c-amethyst-disabled': currentTheme.camethystdisabled,
            '--zsse-c-star': currentTheme.cstar,
            '--zsse-c-star-disabled': currentTheme.cstardisabled,
            '--zsse-c-comet': currentTheme.ccomet,
            '--zsse-c-potassium': currentTheme.cpotassium,
            '--zsse-c-moonstone': currentTheme.cmoonstone,
            '--zsse-c-twilight': currentTheme.ctwilight,
            '--zsse-c-gypsy': currentTheme.cgypsy,
            '--zsse-c-emerald': currentTheme.cemerald,
            '--zsse-c-viridian': currentTheme.cviridian,
            '--zsse-c-viridian-disabled': currentTheme.cviridiandisabled,
            '--zsse-c-rainforest': currentTheme.crainforest,
            '--zsse-c-rainforest-disabled': currentTheme.crainforestdisabled,
            '--zsse-c-honeydew': currentTheme.choneydew,
            '--zsse-c-krypton': currentTheme.ckrypton,
            '--zsse-c-wasabi': currentTheme.cwasabi,
            '--zsse-c-mint': currentTheme.cmint,
            '--zsse-c-oak': currentTheme.coak,
            '--zsse-c-topaz': currentTheme.ctopaz,
            '--zsse-c-tiger': currentTheme.ctiger,
            '--zsse-c-pineapple': currentTheme.cpineapple,
            '--zsse-c-thunder': currentTheme.cthunder,
            '--zsse-c-sulfur': currentTheme.csulfur,
            '--zsse-c-daisy': currentTheme.cdaisy,
            '--zsse-c-banana': currentTheme.cbanana,
            // custom styles
            '--zsse-page-gradient': currentTheme.pageGradient,
            '--zsse-page-header': currentTheme.pageHeaderBg,
            '--zsse-page-header2': currentTheme.pageHeaderBg2,
            '--zsse-page-header-text': currentTheme.pageHeaderText,
            '--zsse-sidebar-icon1': currentTheme.sidebarIcon1,
            '--zsse-sidebar-icon2': currentTheme.sidebarIcon2,
            '--zsse-sidebar-icon3': currentTheme.sidebarIcon3,
            '--zsse-sidebar-bg1': currentTheme.sidebarBg1,
            '--zsse-sidebar-bg2': currentTheme.sidebarBg2,
            '--zsse-sidebar-bg3': currentTheme.sidebarBg3,
            '--zsse-sidebar-text': currentTheme.sidebarText,
            '--zsse-button-text': currentTheme.buttonText,
            // px components
            // '--px-percent-circle-fill-color': currentTheme.cpool,
            '--px-base-text-color': currentTheme.g14chromium,
            '--px-percent-circle-text-color': currentTheme.g17whisper,
            '--px-percent-circle-background-color': currentTheme.g5pepper,

            '--px-gauge-empty-color': currentTheme.g5pepper,

            '--px-vis-gridlines-color': currentTheme.g4onyx,
            '--px-vis-cursor-line-color': currentTheme.g8storm,

            '--px-vis-register-data-value': currentTheme.g14chromium,
            '--px-vis-register-series-name': currentTheme.g17whisper,
            '--px-vis-register-border-color': '#ffffff00', // ugly border in series
            '--px-vis-register-font-size': '12px',

            '--px-vis-series-color-0': currentTheme.cpooldisabled,
            '--px-vis-series-color-1': currentTheme.crainforestdisabled,
            '--px-vis-series-color-2': currentTheme.cstardisabled,
            '--px-vis-series-color-3': currentTheme.cpineapple,
            '--px-vis-series-color-4': currentTheme.cdreamsicle,
            '--px-vis-series-color-5': currentTheme.cwasabi,
            '--px-vis-series-color-6': currentTheme.ctopaz,

            '--px-vis-axis-color': currentTheme.g8storm,
            '--px-vis-axis-title-color': currentTheme.g17whisper,
            '--px-vis-axis-inline-title-color': currentTheme.g7graphite,
            '--px-vis-axis-inline-type-color': currentTheme.g7graphite,
            '--px-vis-axis-inline-box-color': currentTheme.g8storm,

            '--px-tooltip-background-color': currentTheme.g2kevlar,
            '--px-tooltip-text-color': currentTheme.g14chromium,
            '--px-tooltip-light-text-color': currentTheme.g17whisper,
            '--px-tooltip-border-color': currentTheme.g9mountain,
            '--px-vis-font-family': 'Roboto',
            '--px-vis-event-line-color': currentTheme.g12forge,
            '--px-vis-nav-brush-opacity': 0.1,
            '--px-vis-nav-brush-outline-color': currentTheme.g10wolf,

            '--px-inbox-li-background-color': currentTheme.g4onyx,
            '--px-inbox-li-background-color--hover': currentTheme.g5pepper,
            '--px-inbox-li-background-color--selected': currentTheme.g8storm,
            '--px-inbox-border-color': currentTheme.g10wolf,
          }}
        />

        {/* eof styling */}
        {hideDropdown ? (
          <div className="colorLogoPresentMode">
            <CustomProperties
              global={true}
              properties={{
                '--zsse-logo-visibility': 'none',
              }}
            />
            <img src="/static_assets/ZeinetSSElogo_color.png" height="30" />
          </div>
        ) : (
          <div className={classnames('dropdown dropdown-120', {open: isOpen})}>
            <CustomProperties
              global={true}
              properties={{
                '--zsse-logo-visibility': 'block',
              }}
            />
            <div
              className="btn btn-sm btn-info dropdown-toggle"
              onClick={this.toggleMenu}
            >
              <span className={classnames('icon', 'eye-open')} />
              <span className="dropdown-selected">{selectedTheme}</span>
              <span className="caret" />
            </div>
            <ul className="dropdown-menu">
              <li className="dropdown-header">Выберите тему</li>
              {ThemesPallete.map(item => (
                <li className="dropdown-item" key={item.themeName}>
                  <a href="#" onClick={this.handleSelection(item.themeName)}>
                    {item.themeDescr}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }
}

const {bool} = PropTypes

ThemeColorDropdown.propTypes = {
  hideDropdown: bool,
}

export default OnClickOutside(ThemeColorDropdown)
