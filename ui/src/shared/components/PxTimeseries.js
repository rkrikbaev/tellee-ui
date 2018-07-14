import _ from 'lodash'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {timeSeriesToPxSeries} from 'utils/timeSeriesTransformers'

import {colorsStringSchema} from 'shared/schemas'
import {ErrorHandlingWith} from 'src/shared/decorators/errors'
import InvalidData from 'src/shared/components/InvalidData'

const validateTimeSeries = timeseries => {
  return _.every(timeseries, r =>
    _.every(
      r,
      (v, i) => (i === 0 && Date.parse(v)) || _.isNumber(v) || _.isNull(v)
    )
  )
}
@ErrorHandlingWith(InvalidData)
class PxTimeseries extends Component {
  constructor(props) {
    super(props)
    this.isValidData = true
  }

  componentWillMount() {
    const {data, isInDataExplorer} = this.props
    this.parseTimeSeries(data, isInDataExplorer)
  }

  parseTimeSeries(data, isInDataExplorer) {
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
      this.parseTimeSeries(nextProps.data, nextProps.isInDataExplorer)
    }
  }

  render() {
    if (!this.isValidData) {
      return <InvalidData />
    }

    const {
      data,
      axes,
      title,
      colors,
      cellID,
      onZoom,
      queries,
      hoverTime,
      timeRange,
      cellHeight,
      ruleValues,
      isBarGraph,
      isRefreshing,
      setResolution,
      isGraphFilled,
      showSingleStat,
      displayOptions,
      staticLegend,
      underlayCallback,
      overrideLineColors,
      isFetchingInitially,
      handleSetHoverTime,
    } = this.props

    const {labels, timeSeries, dygraphSeries} = this._timeSeries

    // If data for this graph is being fetched for the first time, show a graph-wide spinner.
    if (isFetchingInitially) {
      return <GraphSpinner />
    }

    const options = {
      ...displayOptions,
      title,
      labels,
      rightGap: 0,
      yRangePad: 10,
      labelsKMB: true,
      fillGraph: true,
      underlayCallback,
      axisLabelWidth: 60,
      drawAxesAtZero: true,
      axisLineColor: '#383846',
      gridLineColor: '#383846',
      connectSeparatedPoints: true,
    }

    const containerStyle = {
      width: 'calc(100% - 32px)',
      height: 'calc(100% - 16px)',
      position: 'absolute',
      top: '8px',
    }

    const prefix = axes ? axes.y.prefix : ''
    const suffix = axes ? axes.y.suffix : ''

    return (
      <div className="dygraph graph--hasYLabel" style={{height: '100%'}}>
        {isRefreshing ? <GraphLoadingDots /> : null}

        <px-vis-timeseries
          debounce-resize-timing="250"
          width={containerStyle.width}
          height={containerStyle.height}
          chart-horizontal-alignment="center"
          chart-vertical-alignment="center"
          margin='{"top":30,"bottom":60,"left":65,"right":65}'
          tooltip-config='{}'
          register-config='{"type":"horizontal"}'
          selection-type="xy"
          chart-data={JSON.stringify(timeSeries.jsonflatten)}
          series-config='{"y0":{"name":"y0","x":"timeStamp","y":"y0","yAxisUnit":"F","axis":{"id":"axis1","side":"left","number":"1"}},"y1":{"name":"y1","x":"timeStamp","y":"y1","yAxisUnit":"Hz","axis":{"id":"axis2","side":"right","number":"1"}},"y2":{"name":"y2","x":"timeStamp","y":"y2","yAxisUnit":"C","axis":{"id":"axis3","side":"left","number":"2"}},"y3":{"name":"y3","x":"timeStamp","y":"y3","yAxisUnit":"F","axis":{"id":"axis4","side":"right","number":"2"}}}'
          display-threshold-title
          threshold-config='{"max":{"color":"red","dashPattern":"5,0","title":"MAX","showThresholdBox":true,"displayTitle":true}}'
          x-axis-config='{"title":"Date"}'
          y-axis-config='{"title":"Single","titleTruncation":false,"unit":"F","axis1":{"title":"Temperature","titleTruncation":false,"unit":"C"}}'
          toolbar-config='{"config":{"advancedZoom":true,"pan":true,"tooltip":true,"logHover":{"buttonGroup":2,"tooltipLabel":"The submenu item of this menu will define custom mouse interaction","icon":"px-nav:notification","subConfig":{"customClick":{"icon":"px-nav:expand","buttonGroup":3,"tooltipLabel":"define some custom mouse interactions on chart","eventName":"my-custom-click","actionConfig":{"mousedown":"function(mousePos) { console.log(\"custom click on chart. Context is the chart. Mouse pos is available: \" + JSON.stringify(mousePos))}","mouseup":"function(mousePos) { console.log(\"custom action on mouse up the chart \" + JSON.stringify(mousePos));}","mouseout":"function(mousePos) { console.log(\"custom action on mouse out the chart \" + JSON.stringify(mousePos));}","mousemove":"function(mousePos) { console.log(\"custom action on hovering the chart \");}"}},"customClick2":{"buttonGroup":3,"icon":"px-nav:collapse","tooltipLabel":"Remove all custom interactions","actionConfig":{"mousedown":null,"mouseup":null,"mouseout":null,"mousemove":null}}}}}}'
          navigator-config='{"xAxisConfig":{"tickFormat":"%b %d"}}'>
        </px-vis-timeseries>
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
