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
    this.state = {
      height: 0,
      width: 0,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.queryDate = new Date().getTime()
    const arePropsEqual = _.isEqual(this.props, nextProps)
    const areStatesEqual = _.isEqual(this.state, nextState)
    return !arePropsEqual || !areStatesEqual
  }

  componentWillUpdate() {
    this.oldData = true
  }

  componentDidUpdate() {
    const {width, height} = this.state
    const {autoRefresh} = this.props
    const colors = [
      'orange',
      'green',
      'yellow',
      'red',
      'black',
      'grey',
      'inherit',
    ]

    const rectangle = document.querySelector('#pulseContainer')
    const circles = document.querySelectorAll('.pulseCircle')
    const hiddenCircle = document.querySelector('.pulseHiddenCircle')
    const text = document.querySelector('.delay')

    rectangle.style.width = `${width}px`
    rectangle.style.height = `${height}px`
    for (let j = 0; j < circles.length; j++) {
      circles[j].style.width = `${height / 4}px`
      circles[j].style.height = `${height / 4}px`
    }
    hiddenCircle.style.width = `${height / 5}px`
    hiddenCircle.style.height = `${height / 5}px`

    const setHiddenCircle = (colorId, status, animation) => {
      hiddenCircle.style.backgroundColor = colors[colorId]
      hiddenCircle.style.visibility = status
      hiddenCircle.style.animation = animation
      text.style.animation = animation
    }
    setHiddenCircle(0, 'hidden', 'none')

    const setAnimationProps = (colorId, status) => {
      for (let j = 0; j < circles.length; j++) {
        circles[j].style.backgroundColor = colors[colorId]
        circles[j].style.webkitAnimationPlayState = status
      }
    }
    setAnimationProps(0, 'running')

    const checkData = () => {
      for (let i = 0; i <= 120; i++) {
        if (!autoRefresh) {
          this.oldData = false
          setTimeout(() => {
            setAnimationProps(6, 'paused')
            setHiddenCircle(5, 'visible', 'crescendo 1.5s ease-in')
          }, 3000)
          return
        } else if (this.oldData) {
          this.oldData = false
          setTimeout(() => {
            setAnimationProps(6, 'paused')
            setHiddenCircle(1, 'visible', 'crescendo 1.5s ease-in')
          }, 3000)
          return
        } else if (i > 30 && !this.oldData) {
          setAnimationProps(2, 'running')
        } else if (i > 30 && i < 120 && !this.oldData) {
          setAnimationProps(3, 'running')
        } else if (i > 120 && !this.oldData) {
          setAnimationProps(6, 'paused')
          setHiddenCircle(1, 'visible', 'crescendo 1.5s ease-in')
          return
        }
      }
    }
    checkData()

    const convertMS = ms => {
      let h, m, s
      s = Math.round(ms / 1000)
      m = Math.round(s / 60)
      s %= 60
      h = Math.round(m / 60)
      m %= 60
      // d = Math.floor(h / 24)
      h %= 24
      if (h) {
        return (this.delay = `${h}h`)
      }
      if (m) {
        return (this.delay = `${m}m`)
      }
      if (s) {
        return (this.delay = `${s}s`)
      }
      if (!s) {
        return (this.delay = `${ms}ms`)
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
        <div id="pulseContainer">
          <div className="item">
            <p className="delay">{this.delay}</p>
          </div>
          <div className="pulseHiddenCircle" />
          <div className="pulseCircle" style={{animationDelay: '0s'}} />
          <div className="pulseCircle" style={{animationDelay: '.3s'}} />
          <div className="pulseCircle" style={{animationDelay: '.6s'}} />
          <div className="pulseCircle" style={{animationDelay: '.9s'}} />
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
