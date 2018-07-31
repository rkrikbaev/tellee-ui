import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'
import {timeSeriesToPxSeries} from 'utils/timeSeriesTransformers'

import CustomProperties from 'react-custom-properties'
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
class PxInbox extends Component {
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

    // const {timeSeries} = this._timeSeries

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

    // const prefix = axes ? axes.y.prefix : ''
    // const suffix = axes ? axes.y.suffix : ''
    const {width, height} = this.state
    const demoValue = [
      {
        id: '1',
        title: 'CMS Cold Spot',
        subtitle: 'GT240182',
        severity: 'important',
        date: '2016-10-05T01:29',
        alertId: '749581',
        alertSource: 'Combustion',
        receivedDateTime: '2016-10-05T08:00',
        caseNumber: '127587937',
        customer: 'Dorothy Vaughan',
        serialNumber: 'GT769375',
        dlnType: 'DLN 2.6',
        model: '7FA+e',
      },
      {
        id: '2',
        title: 'Drum Level Anomaly',
        subtitle: 'Block 2',
        severity: '',
        date: '2018-07-04T01:27',
        // alertId: '249375',
        // alertSource: 'Ignition',
        // receivedDateTime: '2016-10-04T03:30',
        // caseNumber: '857463748',
        // customer: 'Mary Jackson',
        // serialNumber: 'GE783556',
        // dlnType: 'DLN 1.4',
        // model: '2MA+c',
      },
      {
        id: '3',
        title: 'GT Vibration',
        subtitle: 'GT20145',
        severity: 'error',
        date: '2016-10-03T01:21',
        alertId: '749581',
        alertSource: 'Combustion',
        receivedDateTime: '2016-10-03T01:50',
        caseNumber: '5635221',
        customer: 'Katherine Johnson',
        serialNumber: 'DM528443',
        dlnType: 'DLN 1.0',
        model: '9985A',
      },
      {
        id: '4',
        title: 'Drum Level Anomaly Detected During Routine Service',
        subtitle: 'Block 4 of GT23183 of Power Plant XYZ',
        severity: 'information',
        date: '2016-10-03T01:05',
        alertId: '1999574',
        alertSource: 'Combustion',
        receivedDateTime: '2016-10-03T10:03',
        caseNumber: '44938',
        customer: 'Sally Ride',
        serialNumber: 'GT769375',
        dlnType: 'DLN 2.6',
        model: '7FA+e',
      },
      {
        id: '5',
        title: 'GT Trip',
        subtitle: 'GT23193',
        severity: 'important',
        date: '2016-10-02T12:30',
        alertId: '482001',
        alertSource: 'Combustion',
        receivedDateTime: '2016-10-02T11:16',
        caseNumber: '127587937',
        customer: 'Ilan Ramon',
        serialNumber: 'IL194800',
        dlnType: 'DLN 6',
        model: 'TTA3',
      },
      {
        id: '6',
        title: 'CMS Hot Spot',
        subtitle: 'GT240183',
        severity: 'warning',
        date: '2016-10-01T02:30',
        alertId: '482000',
        alertSource: 'Combustion',
        receivedDateTime: '2016-10-01T11:16',
        caseNumber: '127587105',
        customer: 'Sally Ride',
        serialNumber: 'IL194893',
        dlnType: 'DLN 6',
        model: 'TTA3',
      },
    ]

    const _width = `${30 * width / 100}px` // i love this type messing
    const _height = `${height}px`

    return (
      <div
        style={{height: '100%'}}
        ref={divElement => (this.divElement = divElement)}
      >
        {isRefreshing ? <GraphLoadingDots /> : null}
        <CustomProperties
          properties={{
            '--px-inbox-height': _height,
            '--px-inbox-list-width': _width,
          }}
        >
          <px-inbox-demo list-items={JSON.stringify(demoValue)} />
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

PxInbox.defaultProps = {
  underlayCallback: () => {},
  isGraphFilled: true,
  overrideLineColors: null,
  staticLegend: false,
}

PxInbox.propTypes = {
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

export default PxInbox
