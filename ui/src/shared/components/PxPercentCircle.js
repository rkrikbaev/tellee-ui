import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'
import {timeSeriesToPxKpi} from 'utils/timeSeriesTransformers'
import _ from 'lodash'

import {colorsStringSchema} from 'shared/schemas'
import {ErrorHandlingWith} from 'src/shared/decorators/errors'
import InvalidData from 'src/shared/components/InvalidData'

import {
  COLOR_TYPE_MIN,
  COLOR_TYPE_MAX,
  // MIN_THRESHOLDS,
} from 'shared/constants/thresholds'

// const validateTimeSeries = timeseries => {
//   return _.every(timeseries, r =>
//     _.every(
//       r,
//       (v, i) => (i === 0 && Date.parse(v)) || _.isNumber(v) || _.isNull(v)
//     )
//   )
// }

@ErrorHandlingWith(InvalidData)
class PxPercentCircle extends Component {
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
    this._timeSeries = timeSeriesToPxKpi(data)
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
      prefix,
      // suffix,
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
      // staticLegend,
      // underlayCallback,
      // overrideLineColors,
      isFetchingInitially,
      // handleSetHoverTime,
    } = this.props

    const {timeSeries} = this._timeSeries

    // If data for this graph is being fetched for the first time, show a graph-wide spinner.
    if (isFetchingInitially) {
      return <GraphSpinner />
    }

    // const options = {
    //   ...displayOptions,
    //   title,
    //   labels,
    //   rightGap: 0,
    //   yRangePad: 10,
    //   labelsKMB: true,
    //   fillGraph: true,
    //   underlayCallback,
    //   axisLabelWidth: 60,
    //   drawAxesAtZero: true,
    //   axisLineColor: '#383846',
    //   gridLineColor: '#383846',
    //   connectSeparatedPoints: true,
    // }

    // Distill out max and min values
    // const minValue = Number(
    //   colors.find(color => color.type === COLOR_TYPE_MIN).value
    // )
    // const maxValue = Number(
    //   colors.find(color => color.type === COLOR_TYPE_MAX).value
    // )

    const kpiMainValue =
      timeSeries.jsonflatten[timeSeries.jsonflatten.length - 1]

    if (kpiMainValue === undefined) {
      return <InvalidData />
    }

    const {width, height} = this.state
    // this is not good....
    let _width = width
    let _height = height
    if (_width > _height) {
      _width = _height
    }
    if (_height > _width) {
      _height = _width
    }

    if (!colors || colors.length === 0) {
      return <InvalidData />
    }
    // Distill out max and min values
    const minValue = Number(
      colors.find(color => color.type === COLOR_TYPE_MIN).value
    )
    const maxValue = Number(
      colors.find(color => color.type === COLOR_TYPE_MAX).value
    )
    return (
      <div
        style={{height: '100%'}}
        ref={divElement => (this.divElement = divElement)}
      >
        {isRefreshing ? <GraphLoadingDots /> : null}

        <px-percent-circle
          val={`${kpiMainValue.y.toFixed(2)}`}
          max={maxValue}
          min={minValue}
          thickness={prefix}
          width={_width}
          height={_height}
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

PxPercentCircle.defaultProps = {
  underlayCallback: () => {},
  isGraphFilled: true,
  overrideLineColors: null,
  staticLegend: false,
}

PxPercentCircle.propTypes = {
  cellID: string,
  prefix: string,
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
  colors: colorsStringSchema.isRequired,
}

export default PxPercentCircle
