import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'
import {timeSeriesToPxSeries} from 'utils/timeSeriesTransformers'
import _ from 'lodash'

import {colorsStringSchema} from 'shared/schemas'
import {ErrorHandlingWith} from 'src/shared/decorators/errors'
import InvalidData from 'src/shared/components/InvalidData'
import {getLineColorsHexes} from 'src/shared/constants/graphColorPalettes'

// const validateTimeSeries = timeseries => {
//   return _.every(timeseries, r =>
//     _.every(
//       r,
//       (v, i) => (i === 0 && Date.parse(v)) || _.isNumber(v) || _.isNull(v)
//     )
//   )
// }
@ErrorHandlingWith(InvalidData)
class PxTimeseries extends Component {
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
  }

  parseTimeSeries(data) {
    this._timeSeries = timeSeriesToPxSeries(data)
    // console.log(JSON.stringify(this._timeSeries.timeSeries))
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

  resize = () => {
    const height = this.divElement.clientHeight
    const width = this.divElement.clientWidth
    this.setState({height})
    this.setState({width})
  }

  render() {
    if (!this.isValidData) {
      return <InvalidData />
    }

    const {
      // data,
      axes,
      // title,
      colors,
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
      staticLegend,
      // underlayCallback,
      // overrideLineColors,
      isFetchingInitially,
      // handleSetHoverTime,
    } = this.props

    const {labels, timeSeries, eventsData, eventsConfig} = this._timeSeries
    // If data for this graph is being fetched for the first time, show a graph-wide spinner.
    if (isFetchingInitially) {
      return <GraphSpinner />
    }

    // const prefix = axes ? axes.y.prefix : ''
    const suffix = axes ? axes.y.suffix : ''
    // This is A very SICK implementation of series config, since JSON formatting problems for PX,
    // we fall-down in the end to text-to-json manual composing
    const lineColors = getLineColorsHexes(colors, labels.length)
    const pxSeriesConfig = {}
    labels.forEach(function(_label, key) {
      if (_label !== 'time') {
        const map2 = {}
        map2.name =
          typeof _label === 'undefined'
            ? ''
            : _label.substr(_label.indexOf('.') + 1)
        map2.x = 'timeStamp'
        map2.y = _label
        map2.yAxisUnit = suffix
        map2.mutedOpacity = '0'
        map2.color =
          typeof lineColors[key] === 'undefined' ? '#ef3e50' : lineColors[key]
        pxSeriesConfig[_label] = map2
      }
    })

    const {width, height} = this.state

    let disableNavigator = false
    let _height = height - 210
    if (height < 400) {
      disableNavigator = true
      _height = height - 70
    }

    return (
      <div
        style={{height: '100%', marginTop: '-7px'}}
        ref={divElement => (this.divElement = divElement)}
      >
        {isRefreshing ? <GraphLoadingDots /> : null}

        <px-vis-timeseries
          debounce-resize-timing="60"
          width={width}
          height={_height}
          prevent-resize="true"
          chart-horizontal-alignment="center"
          chart-vertical-alignment="center"
          margin="{&quot;top&quot;:30,&quot;bottom&quot;:40,&quot;left&quot;:50,&quot;right&quot;:35}"
          tooltip-config="{}"
          register-config="{&quot;type&quot;:&quot;horizontal&quot;}"
          selection-type="xy"
          show-tooltip="true"
          chart-data={JSON.stringify(timeSeries.jsonflatten)}
          series-config={JSON.stringify(pxSeriesConfig)}
          event-config={JSON.stringify(eventsConfig)}
          event-data={JSON.stringify(eventsData)}
          {...(disableNavigator ? {'disable-navigator': true} : {})}
          {...(staticLegend ? {} : {'hide-register': true})}
          // display-threshold-title
          // threshold-config='{"max":{"color":"red","dashPattern":"5,0","title":"MAX","showThresholdBox":true,"displayTitle":true}}'
          x-axis-config="{&quot;title&quot;:&quot;&quot;}"
          // y-axis-config='{"title":"Single","titleTruncation":false,"unit":"F","axis1":{"title":"Temperature","titleTruncation":false,"unit":"C"}}'
          // toolbar-config="{&quot;config&quot;:{&quot;advancedZoom&quot;:true,&quot;pan&quot;:true,&quot;tooltip&quot;:true,&quot;logHover&quot;:{&quot;buttonGroup&quot;:2,&quot;tooltipLabel&quot;:&quot;The submenu item of this menu will define custom mouse interaction&quot;,&quot;icon&quot;:&quot;px-nav:notification&quot;,&quot;subConfig&quot;:{&quot;customClick&quot;:{&quot;icon&quot;:&quot;px-nav:expand&quot;,&quot;buttonGroup&quot;:3,&quot;tooltipLabel&quot;:&quot;define some custom mouse interactions on chart&quot;,&quot;eventName&quot;:&quot;my-custom-click&quot;,&quot;actionConfig&quot;:{&quot;mousedown&quot;:&quot;function(mousePos) { console.log(\&quot;custom click on chart. Context is the chart. Mouse pos is available: \&quot; + JSON.stringify(mousePos))}&quot;,&quot;mouseup&quot;:&quot;function(mousePos) { console.log(\&quot;custom action on mouse up the chart \&quot; + JSON.stringify(mousePos));}&quot;,&quot;mouseout&quot;:&quot;function(mousePos) { console.log(\&quot;custom action on mouse out the chart \&quot; + JSON.stringify(mousePos));}&quot;,&quot;mousemove&quot;:&quot;function(mousePos) { console.log(\&quot;custom action on hovering the chart \&quot;);}&quot;}},&quot;customClick2&quot;:{&quot;buttonGroup&quot;:3,&quot;icon&quot;:&quot;px-nav:collapse&quot;,&quot;tooltipLabel&quot;:&quot;Remove all custom interactions&quot;,&quot;actionConfig&quot;:{&quot;mousedown&quot;:null,&quot;mouseup&quot;:null,&quot;mouseout&quot;:null,&quot;mousemove&quot;:null}}}}}}"
        />
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

PxTimeseries.defaultProps = {
  underlayCallback: () => {},
  isGraphFilled: true,
  overrideLineColors: null,
  staticLegend: false,
}

PxTimeseries.propTypes = {
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

export default PxTimeseries
