import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'
import {timeSeriesToPxSeries} from 'utils/timeSeriesTransformers'

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

const sn = {
  label: 'Serial Number',
  value: 'SN999999999TR',
  uom: '',
}

@ErrorHandlingWith(InvalidData)
class PxKpiList extends Component {
  constructor(props) {
    super(props)
    this.isValidData = true
    this.chartValue = []
    this.status = ''
    this.label = ''
    this.state = {
      height: 0,
      width: 0,
      elementStyle: {},
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
    this.parseDataFromProps()
  }

  parseTimeSeries(data) {
    this._timeSeries = timeSeriesToPxSeries(data)
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

  parseDataFromProps = () => {
    const {tableData} = this._timeSeries
    const chartArray = []
    chartArray.push(
      sn,
      {
        label: 'Availability',
        value: `${
          tableData[tableData.length - 1][1]
            ? tableData[tableData.length - 1][1].toFixed(1)
            : tableData[tableData.length - 1][1]
        }`,
        uom: '%',
      },
      {
        label: 'Reliability',
        value: `${
          tableData[tableData.length - 1][4]
            ? tableData[tableData.length - 1][4].toFixed(1)
            : tableData[tableData.length - 1][4]
        }`,
        uom: '%',
      },
      {
        label: 'Run hours',
        value: `${
          tableData[tableData.length - 1][5]
            ? tableData[tableData.length - 1][5].toFixed(1)
            : tableData[tableData.length - 1][5]
        }`,
        uom: 'h',
      },
      {
        label: 'Standby hours',
        value: `${
          tableData[tableData.length - 1][6]
            ? tableData[tableData.length - 1][6].toFixed(1)
            : tableData[tableData.length - 1][6]
        }`,
        uom: 'h',
      }
    )
    this.makeString(chartArray)
  }

  makeString = array => {
    const arrayx = array.reduce((previous, current) => {
      const stringArray = `${previous ? '' : '['}${previous}${
        previous ? ', ' : ''
      }{"label": "${current.label}", "value": "${current.value}", "uom": "${
        current.uom
      }"}${current.label === 'Standby hours' ? ']' : ''}`
      return stringArray
    }, '')
    this.chartValue = [arrayx].toString()
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

    // If data for this graph is being fetched for the first time, show a graph-wide spinner.
    if (isFetchingInitially) {
      return <GraphSpinner />
    }

    // const prefix = axes ? axes.y.prefix : ''
    // const suffix = axes ? axes.y.suffix : '%'

    const {height} = this.state
    const {tableData} = this._timeSeries

    for (let i = 0; i < tableData[tableData.length - 1].length; i++) {
      if (tableData[tableData.length - 1][i] === undefined) {
        return <InvalidData />
      }
    }

    let elementStyle = {}
    switch (true) {
      case height <= 312:
        elementStyle = {
          imgHeight: 60,
          listPadding: 0.5,
          fontSize: 1,
          uomMargin: 0,
        }
        break
      case 312 <= height && height <= 400:
        elementStyle = {
          imgHeight: 80,
          listPadding: 0.7,
          fontSize: 1.3,
          uomMargin: 0.12,
        }
        break
      default:
        elementStyle = {
          imgHeight: 100,
          listPadding: 1,
          fontSize: 1.3,
          uomMargin: 0.12,
        }
    }

    switch (tableData[tableData.length - 1][7]) {
      case 'В РАБОТЕ':
        elementStyle.stateColor = '#7CE490'
        break
      case 'ОСТАНОВ':
        elementStyle.stateColor = '#ffb94a'
        break
      case 'НЕИСПРАВНОСТЬ':
        elementStyle.stateColor = '#DC4E58'
        break
      default:
        elementStyle.stateColor = 'black'
    }

    const kpiMainValue = tableData[tableData.length - 1]
    const kpiMainPreValue = tableData[tableData.length - 2]

    if (kpiMainValue === undefined) {
      return <InvalidData />
    }

    if (kpiMainPreValue === undefined) {
      return <InvalidData />
    }

    if (kpiMainValue[2] === null) {
      kpiMainValue[2] = 0
    }
    if (kpiMainPreValue[2] === null) {
      kpiMainPreValue[2] = 0
    }
    let kpiChangePerc = (
      ((kpiMainValue[2] - kpiMainPreValue[2]) / kpiMainPreValue[2]) *
      100
    ).toFixed(2)
    if (kpiChangePerc < 0) {
      kpiChangePerc = ~kpiChangePerc + 1
    }
    let sparkAreaBg = '#364c5950'
    const pkTextColor = 'var(--zsse-g14-chromium)'
    if (staticLegend) {
      sparkAreaBg = colors[0].hex
    }

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
            height: elementStyle.imgHeight,
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
            height={height}
            delta={elementStyle.fontSize}
            caps={elementStyle.uomMargin}
            listui={elementStyle.listPadding}
            statecolor={elementStyle.stateColor}
            label={tableData[tableData.length - 1][3]}
            values={this.chartValue}
            status-icon={
              kpiMainValue[3] >= kpiMainPreValue[3]
                ? 'px-nav:up'
                : 'px-nav:down'
            }
            status-color={
              kpiMainValue[3] >= kpiMainPreValue[3] ? 'green' : 'red'
            }
            status-label={
              tableData[tableData.length - 1][2]
                ? tableData[tableData.length - 1][2].toFixed(1)
                : tableData[tableData.length - 1][2]
            }
            footer={tableData[tableData.length - 1][7] || 'Not Valid'}
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
