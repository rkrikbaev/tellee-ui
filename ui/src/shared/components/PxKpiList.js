import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'
import {timeSeriesToPxKpi} from 'utils/timeSeriesTransformers'

import _ from 'lodash'
import CustomProperties from 'react-custom-properties'
import {colorsStringSchema} from 'shared/schemas'
import {ErrorHandlingWith} from 'src/shared/decorators/errors'
import InvalidData from 'src/shared/components/InvalidData'
// import Pumpjack from '/static_assets/pumpjack.svg'
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
class PxKpiList extends Component {
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
    // this.parseTimeSeries(data, isInDataExplorer)
  }

  parseTimeSeries(data) {
    const {axes} = this.props
    const maxVal = axes.y.suffix
    // this._timeSeries = timeSeriesToPxKpi(data, maxVal > -1 ? maxVal : 30)
    // this.isValidData = validateTimeSeries(_.get(this._timeSeries, 'x', []))
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
    // const suffix = axes ? axes.y.suffix : '%'

    const {width, height} = this.state

    let sparkAreaBg = '#364c5950'
    const pkTextColor = 'var(--zsse-g14-chromium)'
    if (staticLegend) {
      sparkAreaBg = colors[0].hex
    }
    const val = '[{ "label":"Availability", "value":"99", "uom":"%"}, {"label":"Reliability", "value":"92.5", "uom":"%"}, {"label":"Starts", "value":"5", "uom":"@"}, {"label":"MTBT", "value":"97", "uom":"days"}]'
    const status = 'В РАБОТЕ'
    const footerText = `Статус: ${status}`
    return (
      <div
        id="px_kpi_list"
        style={{height: '100%'}}
        ref={divElement => (this.divElement = divElement)}
      >
        {isRefreshing ? <GraphLoadingDots /> : null}

        <img
          src="/static_assets/pumpjack.svg"
          style={{
            height: '100px',
            display: 'block',
            margin: '0 auto',
          }}
        />

        <CustomProperties
          properties={{
            '--px-kpi-spark-line-color': '#ffffff30',
            '--px-kpi-spark-area-color': sparkAreaBg,
            '--px-base-text-color': pkTextColor,
          }}
        >
          <px-kpi-list
            height={height - 160}
            label="Оладушка 1"
            values={val}
            status-icon="px-nav:up"
            status-color="green"
            status-label="12%"
            footer={footerText}
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

PxKpiList.defaultProps = {
  underlayCallback: () => {},
  isGraphFilled: true,
  overrideLineColors: null,
  staticLegend: false,
}

PxKpiList.propTypes = {
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

export default PxKpiList
