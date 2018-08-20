import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'
import {timeSeriesToPxKpi} from 'utils/timeSeriesTransformers'

import _ from 'lodash'
import CustomProperties from 'react-custom-properties'
import {colorsStringSchema} from 'shared/schemas'
import {ErrorHandlingWith} from 'src/shared/decorators/errors'
import InvalidData from 'src/shared/components/InvalidData'
// *****************************************************
// COMPONENT NOTES : showlegend is skark =  dark/light
// *****************************************************

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
    this.isValidData = validateTimeSeries(_.get(this._timeSeries, 'x', []))
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
      axes,
      title,
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

    const prefix = axes ? axes.y.prefix : ''
    const suffix = axes ? axes.y.suffix : '%'

    const kpiMainValue =
      timeSeries.jsonflatten[timeSeries.jsonflatten.length - 1]
    const kpiMainPreValue =
      timeSeries.jsonflatten[timeSeries.jsonflatten.length - 2]

    if (kpiMainValue === undefined) {
      return <InvalidData />
    }

    if (kpiMainPreValue === undefined) {
      return <InvalidData />
    }

    if (kpiMainValue.y === null) {
      kpiMainValue.y = 0
    }
    if (kpiMainPreValue.y === null) {
      kpiMainPreValue.y = 0
    }
    let kpiChangePerc = (
      (kpiMainValue.y - kpiMainPreValue.y) /
      kpiMainPreValue.y *
      100
    ).toFixed(2)
    if (kpiChangePerc < 0) {
      kpiChangePerc = ~kpiChangePerc + 1
    }

    const {width, height} = this.state
    let sparkWidth = width
    if (width < 200 && width > 20) {
      sparkWidth = width - 20
    }
    let sparkHeight = height - 95
    if (sparkHeight < 40) {
      sparkHeight = 40
    }

    let sparkAreaBg = '#364c5950'
    const pkTextColor = 'var(--zsse-g14-chromium)'
    if (staticLegend) {
      sparkAreaBg = colors[0].hex
    }

    return (
      <div
        style={{height: '100%'}}
        ref={divElement => (this.divElement = divElement)}
      >
        {isRefreshing ? <GraphLoadingDots /> : null}

        <CustomProperties
          properties={{
            '--px-kpi-spark-line-color': '#ffffff30',
            '--px-kpi-spark-area-color': sparkAreaBg,
            '--px-base-text-color': pkTextColor,
          }}
        >
          <px-kpi
            width={width}
            height={height}
            spark-type="line"
            spark-width={sparkWidth}
            spark-height={sparkHeight}
            title={title}
            value={`${kpiMainValue.y.toFixed(2)} ${prefix}`}
            uom={axes.y.title}
            status-icon={
              kpiMainValue.y >= kpiMainPreValue.y ? 'px-nav:up' : 'px-nav:down'
            }
            status-color={kpiMainValue.y >= kpiMainPreValue.y ? 'green' : 'red'}
            status-label={`${kpiChangePerc}${suffix}`}
            spark-data={JSON.stringify(timeSeries.jsonflatten)}
          />
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
