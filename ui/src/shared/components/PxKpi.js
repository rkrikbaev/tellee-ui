import _ from 'lodash'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'
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
class PxKpi extends Component {
  constructor(props) {
    super(props)
    this.isValidData = true
  }

  componentWillMount() {
    const {data, isInDataExplorer} = this.props
    this.parseTimeSeries(data, isInDataExplorer)
  }

  parseTimeSeries(data, isInDataExplorer) {
    this._timeSeries = timeSeriesToPxSeries(data, true)
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
      this.parseTimeSeries(nextProps.data, nextProps.isInDataExplorer)
    }
  }

  resize = () => {
    console.log("RESIZEEEEE")
    // hide chart and then resize it!!!
    this.render()
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

    const {labels, timeSeries} = this._timeSeries

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

    let kpiMainValue = timeSeries.jsonflatten[timeSeries.jsonflatten.length-2]
    let kpiMainPreValue = timeSeries.jsonflatten[timeSeries.jsonflatten.length-3]
    if (kpiMainValue.y === null) kpiMainValue.y = 0
    if (kpiMainPreValue.y === null) kpiMainPreValue.y = 0
    let kpiChangePerc = ((kpiMainValue.y-kpiMainPreValue.y)/kpiMainPreValue.y*100).toFixed(2)
    if (kpiChangePerc < 0 ) {kpiChangePerc = ~kpiChangePerc+1}
    return (
      <div style={{height: '100%'}}>
        {isRefreshing ? <GraphLoadingDots /> : null}

        <px-kpi
          spark-type="line"
          title="title"
          value={kpiMainValue.y.toFixed(2)+' '+suffix}
          uom={prefix}
          status-icon={kpiMainValue.y >= kpiMainPreValue.y ? 'px-nav:up' : 'px-nav:down' }
          status-color={kpiMainValue.y >= kpiMainPreValue.y ? 'green' : 'red' }
          status-label={kpiChangePerc+'%'}
          spark-data={JSON.stringify(timeSeries.jsonflatten)}>
        </px-kpi>

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

PxKpi.defaultProps = {
  underlayCallback: () => {},
  isGraphFilled: true,
  overrideLineColors: null,
  staticLegend: false,
}

PxKpi.propTypes = {
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

export default PxKpi
