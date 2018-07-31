import React, {Component} from 'react'
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
            // px components
            '--px-percent-circle-fill-color': '#308ec1',
            '--px-base-text-color': '#3c475f',
            '--px-percent-circle-text-color': '#3c475f',
            '--px-gauge-empty-color': '#b2babf',

            '--px-vis-gridlines-color': '#b2babf',
            '--px-vis-cursor-line-color': '#676a6f',

            '--px-vis-register-box': '#1be200',
            '--px-vis-register-data-value': '#434547',
            '--px-vis-register-series-name': '#4f5e7e',
            '--px-vis-register-border-color': '#ffffff00',
            '--px-vis-register-font-size': '12px',

            '--px-vis-series-color-0': '#60C1F8',

            '--px-vis-axis-color': '#b2babf',
            '--px-vis-axis-title-color': '#3c475f',
            '--px-vis-axis-inline-title-color': '#919699',
            '--px-vis-axis-inline-type-color': '#919699',
            '--px-vis-axis-inline-box-color': '#b2babf',

            '--px-tooltip-background-color': '#ffffffdc',
            '--px-tooltip-text-color': '#3c475f',
            // '--px-tooltip-light-background-color': '#f8425f',
            '--px-tooltip-light-text-color': '#3c475f',
            // '--px-tooltip-light-border-color': '#f8425f',
            '--px-vis-font-family': 'Arial',
            '--px-vis-event-line-color': '#3c475f50',
            '--px-vis-nav-brush-opacity': 0.1,
            '--px-vis-nav-brush-outline-color': '#b2babf',
          }}
        />

        {/* eof styling */}
        <div className={classnames('dropdown dropdown-120', {open: isOpen})}>
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
      </div>
    )
  }
}

export default OnClickOutside(ThemeColorDropdown)
