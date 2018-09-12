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

  componentDidUpdate() {
    const {width, height} = this.state
    const {autoRefresh} = this.props
    const {values} = this.props.data[0].response.results[0].series[0]
    const colors = ['inherit', 'grey', 'red', 'green']

    const circles = document.querySelectorAll('.pulseCircle')
    const hiddenCircle = document.querySelector('.pulseHiddenCircle')
    const rectangle = document.querySelector('#pulseContainer')

    const setDefaultSize = colorId => {
      hiddenCircle.style.visibility = 'visible'
      hiddenCircle.style.width = `${height / 4}px`
      hiddenCircle.style.height = `${height / 4}px`
      hiddenCircle.style.backgroundColor = colors[colorId]
    }

    const setAnimationProps = (status, colorId) => {
      for (let i = 0; i < circles.length; i++) {
        circles[i].style.webkitAnimationPlayState = status
        circles[i].style.backgroundColor = colors[colorId]
      }
    }

    rectangle.style.width = `${width}px`
    rectangle.style.height = `${height}px`

    for (let i = 0; i < circles.length; i++) {
      circles[i].style.width = `${height / 4}px`
      circles[i].style.height = `${height / 4}px`
    }

    if (!autoRefresh) {
      setDefaultSize(1)
      setAnimationProps('paused', 0)
    } else if (autoRefresh && !values) {
      hiddenCircle.style.visibility = 'hidden'
      setAnimationProps('running', 2)
      setTimeout(() => {
        setDefaultSize(2)
        setAnimationProps('paused', 0)
      }, 3000)
    } else if (autoRefresh && values) {
      hiddenCircle.style.visibility = 'hidden'
      setAnimationProps('running', 3)
      setTimeout(() => {
        setDefaultSize(3)
        setAnimationProps('paused', 0)
      }, 3000)
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

    // const {
    //   // data,
    //   // axes,
    //   // preffix,
    //   // suffix,
    //   // title,
    //   // colors,
    //   // cellID,
    //   // onZoom,
    //   // queries,
    //   // hoverTime,
    //   // timeRange,
    //   // cellHeight,
    //   // ruleValues,
    //   // isBarGraph,
    //   // isRefreshing,
    //   // setResolution,
    //   // isGraphFilled,
    //   // showSingleStat,
    //   // displayOptions,
    //   // staticLegend,
    //   // underlayCallback,
    //   // overrideLineColors,
    //   // isFetchingInitially,
    //   // handleSetHoverTime,
    // } = this.props

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

    return (
      <div
        style={{height: '100%'}}
        ref={divElement => (this.divElement = divElement)}
      >
        {/*  --------------------------------------------- */}
        <div id="pulseContainer">
          {/* <div class="item">
            <img src="./refresh-button.png" />
          </div> */}
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

// const GraphLoadingDots = () => (
//   <div className="graph-panel__refreshing">
//     <div />
//     <div />
//     <div />
//   </div>
// )

// const GraphSpinner = () => (
//   <div className="graph-fetching">
//     <div className="graph-spinner" />
//   </div>
// )

const {number, arrayOf, shape} = PropTypes

Pulse.propTypes = {
  autoRefresh: number,
  data: arrayOf(shape({}).isRequired).isRequired,
}

export default Pulse
