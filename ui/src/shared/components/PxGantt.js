import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'
import {timeSeriesToPxSeries} from 'utils/timeSeriesTransformers'
// import _ from 'lodash'

// import CustomProperties from 'react-custom-properties'
import {colorsStringSchema} from 'shared/schemas'
import {ErrorHandlingWith} from 'src/shared/decorators/errors'
import InvalidData from 'src/shared/components/InvalidData'
// import {start} from 'repl'

// const validateTimeSeries = timeseries => {
//   return _.every(timeseries, r =>
//     _.every(
//       r,
//       (v, i) => (i === 0 && Date.parse(v)) || _.isNumber(v) || _.isNull(v)
//     )
//   )
// }

@ErrorHandlingWith(InvalidData)
class PxGantt extends Component {
  constructor(props) {
    super(props)
    this.isValidData = true
    this.state = {
      height: 0,
      width: 0,
    }
  }

  componentWillMount() {
    const {data, isInDataExplorer} = this.props
    this.parseTimeSeries(data, isInDataExplorer)
    this.parseDataFromProps()
  }

  parseTimeSeries(data) {
    this._timeSeries = timeSeriesToPxSeries(data)
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

  parseDataFromProps = () => {
    const values = this._timeSeries.tableData
    let temp = {}
    const result = []
    for (let i = 0; i < values.length; i++) {
      if (typeof temp.state === 'undefined') {
        temp = this.makeObj(values[i][0], values[i][0], values[i][1])
      } else if (temp.state === values[i][1]) {
        temp.ending_time = values[i][0]
      } else {
        result.push(temp)
        temp = this.makeObj(values[i][0], values[i][0], values[i][1])
      }

      if (values.length - 1 === i) {
        result.push(temp)
      }
    }
    return result
  }

  makeObj = (timeStart, timeEnd, state) => {
    return {
      starting_time: timeStart,
      ending_time: timeEnd,
      color: this.getColor(state),
      stateName: this.getName(state),
      state,
    }
  }

  isJsonString = json => {
    {
      const str = json.toString()
      try {
        JSON.parse(str)
      } catch (e) {
        return false
      }
      return true
    }
  }

  getColor = state => {
    let {prefix} = this.props.axes.y
    if (!this.isJsonString(prefix)) {
      return 'white'
    }
    prefix = JSON.parse(prefix)
    switch (state) {
      case 4:
        return prefix.stateFourColor // green
      case 3:
        return prefix.stateThreeColor // light pirple
      case 2:
        return prefix.stateTwoColor // brown
      case 1:
        return prefix.stateOneColor // red
    }
  }

  getName = state => {
    let {prefix} = this.props.axes.y
    if (!this.isJsonString(prefix)) {
      return 'NoName'
    }
    prefix = JSON.parse(prefix)
    switch (state) {
      case 4:
        return prefix.stateFour
      case 3:
        return prefix.stateThree
      case 2:
        return prefix.stateTwo
      case 1:
        return prefix.stateOne
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
      // preffix,
      // suffix,
      // title,
      // colors,
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
    // If data for this grapconsole.log(this.props)h is being fetched for the first time, show a graph-wide spinner.
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

    const ganttMainValue =
      timeSeries.jsonflatten[timeSeries.jsonflatten.length - 1]
    if (ganttMainValue === undefined) {
      return <InvalidData />
    }

    const {width, height} = this.state
    // this is not good....
    /* let _width = width
    let _height = height
    if (_width > _height) {
      _width = _height
    }
    if (_height > _width) {
      _height = _width
    } */

    // const prefix = axes ? axes.y.prefix : ''
    // const suffix = axes ? axes.y.suffix : ''

    const pxGanttData = JSON.stringify(this.parseDataFromProps())
    return (
      <div
        style={{height: '100%'}}
        ref={divElement => (this.divElement = divElement)}
      >
        {isRefreshing ? <GraphLoadingDots /> : null}
        {/*  --------------------------------------------- */}
        <polymer-d3-timeline data={pxGanttData} width={width} height={height} />
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

PxGantt.defaultProps = {
  underlayCallback: () => {},
  isGraphFilled: true,
  overrideLineColors: null,
  staticLegend: false,
}

PxGantt.propTypes = {
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

export default PxGantt
