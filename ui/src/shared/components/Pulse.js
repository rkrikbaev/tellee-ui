import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'
import _ from 'lodash'

import {ErrorHandlingWith} from 'src/shared/decorators/errors'
import InvalidData from 'src/shared/components/InvalidData'
// import { SUPERADMIN_ROLE } from '../../auth/Authorized'

@ErrorHandlingWith(InvalidData)
class Pulse extends Component {
  constructor() {
    super()
    this.isValidData = true
    this.oldData = false
    this.queryDate = 0
    this.delay = 0
    this.unit = 's'
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

  componentWillUpdate() {
    this.queryDate = new Date().getTime()
    this.oldData = true
  }

  componentDidUpdate() {
    const {height} = this.state
    const {autoRefresh} = this.props
    const colors = [
      '#FFB94A', // default color
      '#32B08C', // data successfully came
      '#FFF6B8', // waiting data more than 10 sec less than 30 sec
      '#DC4E58', // waiting data more than 30 sec less than 120 sec
      '#2F1F29', // data didn't come
      '#748B99D2', // dashboard on pause
      'inherit', // color for hide animation
    ]

    const circles = document.querySelectorAll('.pulseCircle')
    const hiddenCircle = document.querySelector('.pulseHiddenCircle')

    for (let j = 0; j < circles.length; j++) {
      circles[j].style.width = `${height / 2}px`
      circles[j].style.height = `${height / 2}px`
    }

    const setHiddenCircle = colorId => {
      hiddenCircle.style.backgroundColor = colors[colorId]
    }
    setHiddenCircle(0)

    const setAnimationProps = (colorId, status) => {
      for (let j = 0; j < circles.length; j++) {
        circles[j].style.backgroundColor = colors[colorId]
        circles[j].style.webkitAnimationPlayState = status
      }
    }
    setAnimationProps(0, 'running')

    let i = 0,
      timer = {}

    const isDataCame = () => {
      if (!autoRefresh) {
        this.oldData = false
        clearInterval(timer)
        setTimeout(() => {
          setHiddenCircle(5)
          setAnimationProps(6, 'paused')
        }, 400)
      } else if (this.oldData) {
        this.oldData = false
        clearInterval(timer)
        setTimeout(() => {
          setHiddenCircle(1)
          setAnimationProps(6, 'paused')
        }, 400)
      } else if (i > 10 && i < 30) {
        setHiddenCircle(2)
        setAnimationProps(6, 'paused')
      } else if (i > 30 && i < 120) {
        setHiddenCircle(0)
        setAnimationProps(0, 'running')
        setTimeout(() => {
          setHiddenCircle(3)
          setAnimationProps(6, 'paused')
        }, 400)
      } else if (i > 120) {
        setHiddenCircle(0)
        setAnimationProps(0, 'running')
        clearInterval(timer)
        setTimeout(() => {
          setHiddenCircle(4)
          setAnimationProps(6, 'paused')
        }, 400)
      }
    }

    timer = setTimeout(() => {
      i += 1
      isDataCame(i)
    }, 600)

    const convertMS = ms => {
      let m, s
      s = Math.round(ms / 1000)
      m = Math.round(s / 60)
      s %= 60
      m %= 60
      if (m) {
        this.delay = m
        this.unit = 'min'
      }
      if (s) {
        this.delay = s
        this.unit = 'sec'
      }
      if (!s) {
        this.delay = 0.1
        this.unit = 'sec'
      }
    }
    convertMS(new Date().getTime() - this.queryDate)
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
      // isFetchingInitially,
      // handleSetHoverTime,
    } = this.props

    return (
      <div
        style={{height: '100%'}}
        ref={divElement => (this.divElement = divElement)}
      >
        {isRefreshing ? <GraphLoadingDots /> : null}
        {/*  --------------------------------------------- */}
        <div
          id="pulseContainer"
          style={{
            width: this.state.width,
            height: this.state.height,
          }}
        >
          <div className="item">
            <p className="number">{this.delay}</p>
            <p className="unit">{this.unit}</p>
          </div>
          <div
            className="pulseHiddenCircle"
            style={{
              width: this.state.height / 2,
              height: this.state.height / 2,
            }}
          />
          <div className="pulseCircle" style={{animationDelay: '0s'}} />
          <div className="pulseCircle" style={{animationDelay: '.2s'}} />
          <div className="pulseCircle" style={{animationDelay: '.4s'}} />
          {/* <div className="pulseCircle" style={{animationDelay: '.6s'}} /> */}
        </div>
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

// const GraphSpinner = () => (
//   <div className="graph-fetching">
//     <div className="graph-spinner" />
//   </div>
// )

const {number, arrayOf, shape, bool} = PropTypes

Pulse.propTypes = {
  autoRefresh: number,
  data: arrayOf(shape({}).isRequired).isRequired,
  isRefreshing: bool,
}

export default Pulse
