import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'
import {timeSeriesToPxSeries} from 'utils/timeSeriesTransformers'
import _ from 'lodash'

import Plot from 'react-plotly.js'

import {colorsStringSchema} from 'shared/schemas'
import {ErrorHandlingWith} from 'src/shared/decorators/errors'
import InvalidData from 'src/shared/components/InvalidData'

// const validateTimeSeries = timeseries => {
//   return _.every(timeseries, r =>
//     _.every(
//       r,
//       (v, i) => (i === 0 && Date.parse(v)) || _.isNumber(v) || _.isNull(v)
//     )
//   )
// }
@ErrorHandlingWith(InvalidData)
class XYChart extends Component {
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
    this.axisData = this.parseDataFromProps()
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
    // console.log(JSON.stringify(this._timeSeries.timeSeries))
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
      data,
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

    const newData = [
      {
        x: [0, 13, 100, 83, 0],
        y: [2400, 2900, 2900, 2400, 2400],
        // hoveron: 'points+fills',
        line: {
          dash: 'dash',
          color: colors[1].hex,
        },
        autorange: true,
        name: 'old shape',
        // text: 'Points + Fills',
        hoverinfo: 'none',
      },
      {
        x: this.axisData[2],
        y: this.axisData[1],
        fill: 'toself',
        fillcolor: colors[0].hex,
        opacity: 0.5,
        // hoveron: 'points',
        line: {
          color: colors[0].hex,
        },
        autorange: true,
        name: 'last shape',
        // text: 'Points only',
        hoverinfo: 'none',
      },
    ]

    const {width, height} = this.state
    return (
      <div
        id="xychart"
        style={{height: '100%'}}
        ref={divElement => (this.divElement = divElement)}
      >
        {isRefreshing ? <GraphLoadingDots /> : null}

        <Plot
          data={newData}
          layout={{
            autosize: true,
            width: width - 2,
            height: height + 40,
            plot_bgcolor: 'transparent',
            paper_bgcolor: 'transparent',
            tracetoggle: false,
            xaxis: {
              title: 'position',
              titlefont: {
                family: 'Roboto, monospace',
                size: 12,
                color: '#7f7f7f',
              },
              color: '#B4C2CA',
            },
            yaxis: {
              title: 'force',
              titlefont: {
                family: 'Roboto, monospace',
                size: 12,
                color: '#7f7f7f',
              },
              color: '#B4C2CA',
            },
            showlegend: staticLegend,
            legend: {
              orientation: 'h',
              x: 0,
              y: 1.2,
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
            scrollZoom: false,
            displaylogo: false,
            displayModeBar: true,
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
            toImageButtonOptions: {
              format: 'png',
              width: 800,
              height: 600,
              filename: `${data[0].response.results[0].series[0].name.toLowerCase()}_${new Date().getTime()}`,
            },
          }}
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

XYChart.defaultProps = {
  underlayCallback: () => {},
  isGraphFilled: true,
  overrideLineColors: null,
  staticLegend: false,
}

XYChart.propTypes = {
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

export default XYChart
