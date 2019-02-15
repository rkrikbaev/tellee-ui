import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'
import {timeSeriesToPxSeries} from 'utils/timeSeriesTransformers'
import _ from 'lodash'
import Plot from 'react-plotly.js'

import {colorsStringSchema} from 'shared/schemas'
import {ErrorHandlingWith} from 'src/shared/decorators/errors'
import InvalidData from 'src/shared/components/InvalidData'
import {getLineColorsHexes} from 'src/shared/constants/graphColorPalettes'
// import { SUPERADMIN_ROLE } from '../../auth/Authorized'

@ErrorHandlingWith(InvalidData)
class XyGraph extends Component {
  constructor() {
    super()
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
    this.parseDataFromProps()
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

  parseTimeSeries(data) {
    this._timeSeries = timeSeriesToPxSeries(data)
    // NEED FIX VALIDATOR!
    // this.isValidData = validateTimeSeries(
    //   _.get(this._timeSeries, 'timeSeries', [])
    // )
  }

  parseDataFromProps = () => {
    const values = this._timeSeries.tableData
    const date = [],
      force = [],
      position = [],
      result = []
    date.push(values[0][0])
    date.push(values[values.length - 1][0])
    for (let i = 0; i < values.length; i++) {
      force.push(values[i][1])
      position.push(values[i][2])

      if (values.length - 1 === i) {
        result.push(date, force, position)
      }
    }
    return result
  }

  componentDidUpdate() {
    const axisData = this.parseDataFromProps()
    this.newData = [
      {
        x: [0, 13, 100, 83, 0],
        y: [2400, 2900, 2900, 2400, 2400],
        // hoveron: 'points+fills',
        line: {
          dash: 'dash',
          color: '#B4C2CA',
        },
        autorange: true,
        name: 'old shape',
        // text: 'Points + Fills',
        hoverinfo: 'none',
      },
      {
        x: axisData[2],
        y: axisData[1],
        fill: 'toself',
        fillcolor: '#e763fa',
        opacity: 0.5,
        // hoveron: 'points',
        line: {
          color: '#e763fa',
        },
        autorange: true,
        name: 'last shape',
        // text: 'Points only',
        hoverinfo: 'none',
      },
    ]
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

    // const {labels, timeSeries, eventsData, eventsConfig} = this._timeSeries
    // getLineColorsHexes(colors, labels.length)

    if (isFetchingInitially) {
      return <GraphSpinner />
    }

    const {width, height} = this.state

    return (
      <div
        id="xygraphContainer"
        style={{height: '100%'}}
        ref={divElement => (this.divElement = divElement)}
      >
        {isRefreshing ? <GraphLoadingDots /> : null}
        {/*  --------------------------------------------- */}
        <Plot
          data={this.newData}
          layout={{
            width: width - 2,
            height,
            plot_bgcolor: 'transparent',
            paper_bgcolor: 'transparent',
            xaxis: {
              title: 'position',
              titlefont: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f',
              },
              color: '#B4C2CA',
            },
            yaxis: {
              title: 'force',
              titlefont: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f',
              },
              color: '#B4C2CA',
            },
            showlegend: true,
            legend: {
              orientation: 'h',
              traceorder: 'normal',
              font: {
                family: 'sans-serif',
                size: 12,
                color: '#B4C2CA',
              },
              bgcolor: 'transparent',
              border: 'none',
            },
          }}
          config={{
            showLink: false,
            scrollZoom: true,
            displaylogo: false,
            modeBarButtonsToRemove: [
              'sendDataToCloud',
              'select2d',
              'lasso2d',
              'hoverClosestCartesian',
              'hoverCompareCartesian',
              'pan2d',
              // 'zoomIn2d',
              // 'zoomOut2d',
              'autoScale2d',
              'resetScale2d',
              'zoom2d',
              'toggleSpikelines',
            ],
            displayModeBar: true,
          }}
        />
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

XyGraph.defaultProps = {
  underlayCallback: () => {},
  isGraphFilled: true,
  overrideLineColors: null,
  staticLegend: false,
}

XyGraph.propTypes = {
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

export default XyGraph
