import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'
import {timeSeriesToPxSeries} from 'utils/timeSeriesTransformers'
import _ from 'lodash'

// import CustomProperties from 'react-custom-properties'
import {colorsStringSchema} from 'shared/schemas'
import {ErrorHandlingWith} from 'src/shared/decorators/errors'
import InvalidData from 'src/shared/components/InvalidData'

import {YMaps, Map, Clusterer, Placemark} from 'react-yandex-maps'
// import POINTS from './POINTS.js'

const mapState = {
  center: [28.438258, -98.361192],
  zoom: 12,
}
const points = [
  {
    title: 'ШГН №1',
    descr: 'Oil pump 1',
    coords: [28.445376, -98.385066],
    status: 'run',
    link: 'http://157.230.97.228/sources/1/dashboards/1',
  },
  {
    title: 'ШГН №2',
    descr: 'Oil pump 2',
    coords: [28.44059, -98.365951],
    status: 'stop',
    link: 'http://157.230.97.228/sources/1/dashboards/2',
  },
  {
    title: 'ШГН №3',
    descr: 'Oil pump 3',
    coords: [28.438405, -98.339522],
    status: 'crush',
    link: 'http://157.230.97.228/sources/1/dashboards/3',
  },
  {
    title: 'ШГН №4',
    descr: 'Oil pump 4',
    coords: [28.422025, -98.338375],
    status: 'run',
    link: 'http://157.230.97.228/sources/1/dashboards/4',
  },
  {
    title: 'ШГН №5',
    descr: 'Oil pump 5',
    coords: [28.445921, -98.349233],
    status: 'run',
    link: 'http://157.230.97.228/sources/1/dashboards/5',
  },
]

@ErrorHandlingWith(InvalidData)
class GIS extends Component {
  constructor(props) {
    super(props)
    this.isValidData = true
    this.state = {
      height: 0,
      width: 0,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const arePropsEqual = _.isEqual(this.props, nextProps)
    const areStatesEqual = _.isEqual(this.state, nextState)
    return !arePropsEqual || !areStatesEqual
  }

  componentWillMount() {
    const {data, isInDataExplorer} = this.props
    this.parseTimeSeries(data, isInDataExplorer)
    this.changePointStatus()
    // this.parseDataFromProps()
  }

  parseTimeSeries(data) {
    this._timeSeries = timeSeriesToPxSeries(data)
    // NEED FIX VALIDATOR!
    // this.isValidData = validateTimeSeries(
    //   _.get(this._timeSeries, 'timeSeries', [])
    // )
  }

  componentWillUpdate(nextProps) {
    const {data, activeQueryIndex} = this.props
    if (
      data !== nextProps.data ||
      activeQueryIndex !== nextProps.activeQueryIndex
    ) {
      this.parseTimeSeries(nextProps.data)
    }
  }

  changePointStatus = () => {
    const {tableData} = this._timeSeries
    // const tabelData = [1, 1, 3, 2, 3]
    tableData[tableData.length - 1].shift()
    const arr = tableData[tableData.length - 1]
    for (let i = 0; i < arr.length; i++) {
      if (isNaN(arr[i]) || arr[i] === null) {
        return <InvalidData />
      }
      switch (arr[i]) {
        case 1:
          points[i].status = 'run'
          break
        case 2:
          points[i].status = 'stop'
          break
        case 3:
          points[i].status = 'crush'
          break
        default:
          points[i].status = 'not found'
      }
    }
  }

  resize = () => {
    const height = this.divElement.clientHeight
    const width = this.divElement.clientWidth
    this.setState({height})
    this.setState({width})
    this.render()
  }

  render() {
    if (!this.isValidData) {
      return <InvalidData />
    }

    const {
      // data,
      // axes,
      // preffix,
      // suffix,
      // title,
      // colors,
      // cellID,
      // onZoom,
      // queries,
      // hoverTime,
      // timeRange,
      // cellHeight,
      // ruleValues,
      // isBarGraph,
      isRefreshing,
      // setResolution,
      // isGraphFilled,
      // showSingleStat,
      // displayOptions,
      // staticLegend,
      // underlayCallback,
      // overrideLineColors,
      isFetchingInitially,
      // handleSetHoverTime,
    } = this.props

    // const {timeSeries} = this._timeSeries
    // If data for this grapconsole.log(this.props)h is being fetched for the first time, show a graph-wide spinner.
    if (isFetchingInitially) {
      return <GraphSpinner />
    }

    let pointIcon = null

    const {width, height} = this.state
    // this is not good....
    let _height = height
    if (_height < 100) {
      _height = 100
    }

    // const prefix = axes ? axes.y.prefix : ''
    // const suffix = axes ? axes.y.suffix : ''
    // const pxGanttData = JSON.stringify(this.parseDataFromProps())
    return (
      <div
        style={{height: '100%'}}
        ref={divElement => (this.divElement = divElement)}
      >
        {isRefreshing ? <GraphLoadingDots /> : null}
        {/*  --------------------------------------------- */}
        <YMaps query={{lang: 'en_Ru', load: 'package.full'}}>
          <Map
            width={width}
            height={_height}
            defaultState={mapState}
            modules={['layout.ImageWithContent']}
          >
            <Clusterer
              options={{
                preset: 'islands#invertedVioletClusterIcons',
                groupByCoordinates: false,
              }}
            >
              {points.map((point, index) => {
                switch (point.status) {
                  case 'stop':
                    pointIcon = '/static_assets/pumpjack_st.svg'
                    break
                  case 'crush':
                    pointIcon = '/static_assets/pumpjack_cr.svg'
                    break
                  default:
                    pointIcon = '/static_assets/pumpjack_rn.svg'
                    break
                }
                const tooltip = `
                  <div class="map_balloon">
                    <h4>${point.descr}</h4>
                    <strong>Longitude: ${point.coords[0]}</strong>
                    <strong>Latitude: ${point.coords[1]}</strong>
                    <a href='${point.link}'>Dashboard</a>
                  </div>
                `
                return (
                  <Placemark
                    key={index}
                    geometry={point.coords}
                    modules={[
                      'geoObject.addon.balloon',
                      'geoObject.addon.hint',
                    ]}
                    properties={{
                      // hintContent: tooltip,
                      balloonContent: tooltip,
                    }}
                    options={{
                      iconLayout: 'default#imageWithContent',
                      iconImageHref: pointIcon,
                      iconImageSize: [40, 40],
                      iconImageOffset: [-34, -34],
                    }}
                  />
                )
              })}
            </Clusterer>
          </Map>
        </YMaps>
        {/*  --------------------------------------------- */}
        <ReactResizeDetector
          handleWidth={true}
          handleHeight={true}
          onResize={this.resize}
        />
      </div>
    )
  }
}

const GraphLoadingDots = () => (
  <div className="graph-panel__refreshing">
    <div />
    <div />
    <div />
  </div>
)

const GraphSpinner = () => (
  <div className="graph-fetching">
    <div className="graph-spinner" />
  </div>
)

const {array, arrayOf, bool, func, number, shape, string} = PropTypes

GIS.defaultProps = {
  underlayCallback: () => {},
  isGraphFilled: true,
  overrideLineColors: null,
  staticLegend: false,
}

GIS.propTypes = {
  cellID: string,
  axes: shape({
    y: shape({
      bounds: array,
      label: string,
    }),
    y2: shape({
      bounds: array,
      label: string,
    }),
  }),
  hoverTime: string,
  handleSetHoverTime: func,
  title: string,
  isFetchingInitially: bool,
  isRefreshing: bool,
  underlayCallback: func,
  isGraphFilled: bool,
  isBarGraph: bool,
  staticLegend: bool,
  overrideLineColors: array,
  showSingleStat: bool,
  displayOptions: shape({
    stepPlot: bool,
    stackedGraph: bool,
  }),
  activeQueryIndex: number,
  ruleValues: shape({}),
  timeRange: shape({
    lower: string.isRequired,
  }),
  isInDataExplorer: bool,
  setResolution: func,
  cellHeight: number,
  onZoom: func,
  queries: arrayOf(shape({}).isRequired).isRequired,
  data: arrayOf(shape({}).isRequired).isRequired,
  colors: colorsStringSchema,
}

export default GIS
