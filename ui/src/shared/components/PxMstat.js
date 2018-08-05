import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'
import {timeSeriesToPxKpi} from 'utils/timeSeriesTransformers'

// import CustomProperties from 'react-custom-properties'
import {colorsStringSchema} from 'shared/schemas'
import {ErrorHandlingWith} from 'src/shared/decorators/errors'
import InvalidData from 'src/shared/components/InvalidData'
import classnames from 'classnames'

// const validateTimeSeries = timeseries => {
//   return _.every(timeseries, r =>
//     _.every(
//       r,
//       (v, i) => (i === 0 && Date.parse(v)) || _.isNumber(v) || _.isNull(v)
//     )
//   )
// }

@ErrorHandlingWith(InvalidData)
class PxMstat extends Component {
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

  render() {
    if (!this.isValidData) {
      return <InvalidData />
    }

    const {
      // data,
      axes,
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
      staticLegend,
      // underlayCallback,
      // overrideLineColors,
      isFetchingInitially,
      // handleSetHoverTime,
    } = this.props

    const {labels, tableData} = this._timeSeries

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
    const suffix = axes ? axes.y.suffix : ''
    const minimal = axes ? axes.y.scale : ''
    let minifyCss = ''
    if (minimal === 'log') {
      minifyCss = 'tile_count_min'
    }
    // prefix is icon list with comma separated delim.
    // need to be rewrited!
    // const prefixArray = prefix.split(',')
    const iconsArray = this.isJsonString(prefix) ? JSON.parse(prefix) : ''
    // prefixArray.forEach(key => {
    //   iconsArray.push(key)
    // })
    // const suffix = axes ? axes.y.suffix : ''
    const _labels = labels.filter(e => e !== 'time')

    const cols = `col-md-${12 / _labels.length} col-xs-${12 /
      _labels.length} tile_stats_count`
    return (
      <div
        style={{height: '100%'}}
        ref={divElement => (this.divElement = divElement)}
      >
        {isRefreshing ? <GraphLoadingDots /> : null}

        <div className={classnames('row tile_count', minifyCss)}>
          {_labels.map((value, key) => (
            <div className={cols} key={key}>
              <span className="count_top">
                <px-icon
                  className="icon"
                  icon={
                    typeof iconsArray[key] === 'undefined'
                      ? 'px-utl:attribute'
                      : iconsArray[key]
                  }
                />{' '}
                {typeof value === 'undefined'
                  ? ''
                  : value.substr(value.indexOf('.') + 1)}
              </span>
              <div className="count">
                {tableData[0][key + 1] === null
                  ? '0'
                  : tableData[0][key + 1].toFixed(2)}
              </div>
              {staticLegend ? (
                <span className="count_bottom">
                  <i className="green">
                    {tableData[1][key + 1] === null
                      ? '0'
                      : tableData[1][key + 1].toFixed(2)}
                  </i>{' '}
                  {suffix}
                </span>
              ) : null}
            </div>
          ))}
        </div>
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

PxMstat.defaultProps = {
  underlayCallback: () => {},
  isGraphFilled: true,
  overrideLineColors: null,
  staticLegend: false,
}

PxMstat.propTypes = {
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

export default PxMstat
