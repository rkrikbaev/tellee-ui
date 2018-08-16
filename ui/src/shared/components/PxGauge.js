import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'
import {timeSeriesToPxKpi} from 'utils/timeSeriesTransformers'
import _ from 'lodash'
import CustomProperties from 'react-custom-properties'

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
class PxGauge extends Component {
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
      suffix,
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

    const {tableData, labels} = this._timeSeries

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

    const kpiArrayValue = tableData[tableData.length - 1]
    const _labels = labels.filter(e => e !== 'time')

    if (kpiArrayValue === undefined) {
      return <InvalidData />
    }

    const {width, height} = this.state
    // this is not good....
    let _width = width
    let _height = height

    _width += width * 0.25
    _height += height * 0.25

    if (width > height) {
      _width = height
    } else if (height > width) {
      _height = width
      _width = width - width * 0.1
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

    const sortedColors = _.sortBy(colors, color => Number(color.value))

    const pxErrorTreshold = []
    const pxAbnormalTreshold = []
    const pxAnomalyreshold = []
    const pxNormalTreshold = []
    let pxErrorColor = []
    let pxAbnormalColor = []
    let pxAnomalyColor = []
    let pxNormalColor = []
    if (colors.length > 2) {
      for (let c = 1; c < sortedColors.length - 1; c++) {
        // Use this color and the next to determine arc length
        const color = sortedColors[c]
        if (c === 1) {
          pxErrorTreshold.push(minValue.toString(), color.value)
          pxErrorColor = color.hex
        }
        if (c === 2) {
          pxAbnormalTreshold.push(pxErrorTreshold[1], color.value)
          pxAbnormalColor = color.hex
        }
        if (c === 3) {
          pxAnomalyreshold.push(pxAbnormalTreshold[1], color.value)
          pxAnomalyColor = color.hex
        }
        if (c === 4) {
          pxNormalTreshold.push(pxAnomalyreshold[1], color.value)
          pxNormalColor = color.hex
        }
      }
    } else {
      const defaultColor = colors.find(color => color.type === COLOR_TYPE_MIN)
        .hex
      pxNormalTreshold.push(minValue.toString(), maxValue.toString())
      pxNormalColor = defaultColor
    }

    let _cols = Math.round(12 / _labels.length)
    if (_labels.length === 1) {
      _cols = 12
    } else if (_cols === 5 || _cols > 6) {
      _cols = 1
    }
    const cols = `col-md-${_cols} col-xs-${_cols}`
    return (
      <div
        style={{height: '100%'}}
        className="row"
        ref={divElement => (this.divElement = divElement)}
      >
        {isRefreshing ? <GraphLoadingDots /> : null}
        <CustomProperties
          properties={{
            '--px-gauge-fill-error-color': pxErrorColor,
            '--px-gauge-fill-anomaly-color': pxAnomalyColor,
            '--px-gauge-fill-abnormal-color': pxAbnormalColor,
            '--px-gauge-fill-normal-color': pxNormalColor,
          }}
        >
          {_labels.map((value, key) => (
            <div className={cols} key={key}>
              {_labels.length > 1 ? (
                <div className="count_top_center tile_count_min">
                  <span className="count_top">
                    {typeof value === 'undefined'
                      ? ''
                      : value.substr(value.indexOf('.') + 1)}
                  </span>
                </div>
              ) : null}
              <px-gauge
                value={
                  kpiArrayValue[key + 1] === null
                    ? '0'
                    : kpiArrayValue[key + 1].toFixed(2)
                }
                max={maxValue}
                min={minValue}
                width={_width}
                height={_height}
                bar-width={prefix}
                unit={suffix}
                error={`[${JSON.stringify(pxErrorTreshold)}]`}
                abnormal={`[${JSON.stringify(pxAbnormalTreshold)}]`}
                anomaly={`[${JSON.stringify(pxAnomalyreshold)}]`}
                normal={`[${JSON.stringify(pxNormalTreshold)}]`}
              />
            </div>
          ))}
        </CustomProperties>
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

PxGauge.defaultProps = {
  underlayCallback: () => {},
  isGraphFilled: true,
  overrideLineColors: null,
  staticLegend: false,
}

PxGauge.propTypes = {
  cellID: string,
  prefix: string,
  suffix: string,
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

export default PxGauge
