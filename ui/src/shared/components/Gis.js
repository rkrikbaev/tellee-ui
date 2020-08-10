import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'
import _ from 'lodash'

// import CustomProperties from 'react-custom-properties'
import {colorsStringSchema} from 'shared/schemas'
import {ErrorHandlingWith} from 'src/shared/decorators/errors'
import InvalidData from 'src/shared/components/InvalidData'

import {YMaps, Map, Clusterer, Placemark} from 'react-yandex-maps'

const mapState = {
  center: [28.438258, -98.361192],
  zoom: 3,
}

const defaultPoint = {
  title: 'NOT SET',
  description: 'NOT SET',
  coords: [1.445376, -1.385066],
  status: 'not_found',
  link: 'http://flash.zeinetsse.com',
}

@ErrorHandlingWith(InvalidData)
class GIS extends Component {
  _isMounted = false

  constructor(props) {
    super(props)
    this.isValidData = true
    this.state = {
      height: 0,
      width: 0,
      points: [],
    }
  }

  parseDataFromProps = async newProps => {
    const {prefix} = newProps.axes.y2

    const parsedData =
      Object.keys(prefix).length === 0 ? {} : JSON.parse(prefix)

    const {queries} = this.props
    const arrayOfId = queries.map(item => {
      return item.queryConfig.tags.name[0]
    })
    const arrayOfParsedNames = this.getDeviceNameByTagName(arrayOfId)
    const info = await this.getDataFromMongo(arrayOfParsedNames)
    const points = []

    for (let i = 0; i < parsedData.items.length; i++) {
      points.push({
        title: info[i].title,
        description: info[i].subtitle,
        coords: [info[i].latitude, info[i].longitude],
        status: 'not_found',
        link: parsedData.items[i].link,
      })
    }
    return points
  }

  getDeviceNameByTagName = tagsArray => {
    const arrayOfDeviceNames = tagsArray.map(item => {
      const arr = item.split('/')
      return arr[1]
    })
    return arrayOfDeviceNames
  }

  getDataFromMongo = async id => {
    const arrayOfInfo = []
    for (let i = 0; i < id.length; i++) {
      await fetch(`http://mainflux.zeinetsse.com:5000/api/device/${id[i]}`, {
        mode: 'cors',
      })
        .then(res => res.json())
        .then(info => arrayOfInfo.push(info))
        .catch(err => {
          return err
        })
    }
    return arrayOfInfo
  }

  shouldComponentUpdate(nextProps, nextState) {
    const arePropsEqual = _.isEqual(this.props, nextProps)
    const areStatesEqual = _.isEqual(this.state, nextState)
    return !arePropsEqual || !areStatesEqual
  }

  componentDidMount = async () => {
    this._isMounted = true
    await this.changePointStatus(this.props.data)
    await this.parseDataFromProps(this.props)
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  componentWillUpdate = async nextProps => {
    if (this.props !== nextProps) {
      await this.changePointStatus(nextProps.data)
      await this.parseDataFromProps(nextProps)
    }
  }

  changePointStatus = async data => {
    const arr = data.map(item => {
      const {values} = item.response.results[0].series[0]
      return values[values.length - 1][1] || ''
    })

    const points = await this.parseDataFromProps(this.props)
    for (let i = 0; i < arr.length; i++) {
      if (isNaN(arr[i]) || arr[i] === null) {
        return <InvalidData />
      }
      if (points[i] === undefined) {
        points[i] = defaultPoint
      }
      switch (arr[i]) {
        case 1:
          points[i].status = 'run'
          break
        case 2:
          points[i].status = 'stop'
          break
        case 3:
          points[i].status = 'crash'
          break
        default:
          points[i].status = 'not_found'
      }
    }
    if (this._isMounted) {
      this.setState({points})
    }
  }

  resize = () => {
    const height = this.divElement.clientHeight
    const width = this.divElement.clientWidth
    this.setState({height, width})
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

    const {width, height, points} = this.state
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
        <YMaps
          query={{
            lang: 'en_Ru',
            ns: 'use-load-option',
            load: 'Map,Placemark,control.ZoomControl,geoObject.addon.balloon',
          }}
        >
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
              {Array.isArray(points) && points.length !== 0
                ? points.map((point, index) => {
                    switch (point.status) {
                      case 'stop':
                        pointIcon = '/static_assets/tag_stop.svg'
                        break
                      case 'crash':
                        pointIcon = '/static_assets/tag_crash.svg'
                        break
                      case 'run':
                        pointIcon = '/static_assets/tag_run.svg'
                        break
                      default:
                        pointIcon = '/static_assets/tag_default.svg'
                        break
                    }
                    const tooltip = `
                      <div class="map_balloon">
                        <strong>TITLE: ${point.title.toUpperCase() ||
                          'NOT FOUND'}</strong>
                        <strong>DESCRIPTION: ${point.description ||
                          'NOT FOUND'}</strong>
                        <strong>
                          STATUS:
                          <span class="${
                            point.status ? point.status : 'not_found'
                          }">${point.status.toUpperCase() || 'NOT FOUND'}
                          </span>
                        </strong>
                        <strong><a href="${
                          point.link ? point.link : '#'
                        }">DASHBOARD</a></strong>
                      </div>
                    `
                    return (
                      <Placemark
                        key={index}
                        geometry={point.coords ? point.coords : ''}
                        modules={[
                          'geoObject.addon.balloon',
                          'geoObject.addon.hint',
                        ]}
                        properties={{
                          balloonContent: tooltip,
                        }}
                        options={{
                          iconLayout: 'default#imageWithContent',
                          iconImageHref: pointIcon,
                          iconImageSize: [25, 25],
                          iconImageOffset: [-10, -10],
                          hideIconOnBalloonOpen: false,
                        }}
                      />
                    )
                  })
                : ''}
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
