import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import _ from 'lodash'
import uuid from 'uuid'

import FancyScrollbar from 'shared/components/FancyScrollbar'
import Threshold from 'src/dashboards/components/Threshold'
// *****************************************************
// COMPONENT NOTES :
// *****************************************************

import {
  COLOR_TYPE_THRESHOLD,
  THRESHOLD_COLORS,
  MAX_THRESHOLDS,
  MIN_THRESHOLDS,
} from 'shared/constants/thresholds'

import {
  updateGaugeColors,
  updateAxes,
} from 'src/dashboards/actions/cellEditorOverlay'
import {colorsNumberSchema} from 'shared/schemas'
import {ErrorHandling} from 'src/shared/decorators/errors'

@ErrorHandling
class PxGaugeOptions extends Component {
  constructor() {
    super()
    this.state = {
      range1: '0,0',
      range2: '0,0',
      range3: '0,0',
      range4: '0,0',
    }
  }

  handleAddThreshold = () => {
    const {gaugeColors, handleUpdateGaugeColors, onResetFocus} = this.props
    const sortedColors = _.sortBy(gaugeColors, color => color.value)

    if (sortedColors.length <= MAX_THRESHOLDS) {
      const randomColor = _.random(0, THRESHOLD_COLORS.length - 1)

      const maxValue = sortedColors[sortedColors.length - 1].value
      const minValue = sortedColors[0].value

      const colorsValues = _.mapValues(gaugeColors, 'value')
      let randomValue

      do {
        randomValue = _.round(_.random(minValue, maxValue, true), 2)
      } while (_.includes(colorsValues, randomValue))

      const newThreshold = {
        type: COLOR_TYPE_THRESHOLD,
        id: uuid.v4(),
        value: randomValue,
        hex: THRESHOLD_COLORS[randomColor].hex,
        name: THRESHOLD_COLORS[randomColor].name,
      }

      const updatedColors = _.sortBy(
        [...gaugeColors, newThreshold],
        color => color.value
      )

      handleUpdateGaugeColors(updatedColors)
    } else {
      onResetFocus()
    }
  }

  handleDeleteThreshold = threshold => {
    const {handleUpdateGaugeColors, onResetFocus} = this.props
    const gaugeColors = this.props.gaugeColors.filter(
      color => color.id !== threshold.id
    )
    const sortedColors = _.sortBy(gaugeColors, color => color.value)

    handleUpdateGaugeColors(sortedColors)
    onResetFocus()
  }

  handleChooseColor = threshold => chosenColor => {
    const {handleUpdateGaugeColors} = this.props
    const gaugeColors = this.props.gaugeColors.map(
      color =>
        color.id === threshold.id
          ? {...color, hex: chosenColor.hex, name: chosenColor.name}
          : color
    )

    handleUpdateGaugeColors(gaugeColors)
  }

  handleUpdateColorValue = (threshold, value) => {
    const {handleUpdateGaugeColors} = this.props
    const gaugeColors = this.props.gaugeColors.map(
      color => (color.id === threshold.id ? {...color, value} : color)
    )

    handleUpdateGaugeColors(gaugeColors)
  }

  handleValidateColorValue = (threshold, targetValue) => {
    const {gaugeColors} = this.props

    const thresholdValue = threshold.value
    let allowedToUpdate = false

    const sortedColors = _.sortBy(gaugeColors, color => color.value)

    const minValue = sortedColors[0].value
    const maxValue = sortedColors[sortedColors.length - 1].value

    // If lowest value, make sure it is less than the next threshold
    if (thresholdValue === minValue) {
      const nextValue = sortedColors[1].value
      allowedToUpdate = targetValue < nextValue
    }
    // If highest value, make sure it is greater than the previous threshold
    if (thresholdValue === maxValue) {
      const previousValue = sortedColors[sortedColors.length - 2].value
      allowedToUpdate = previousValue < targetValue
    }
    // If not min or max, make sure new value is greater than min, less than max, and unique
    if (thresholdValue !== minValue && thresholdValue !== maxValue) {
      const greaterThanMin = targetValue > minValue
      const lessThanMax = targetValue < maxValue

      const colorsWithoutMinOrMax = sortedColors.slice(
        1,
        sortedColors.length - 1
      )

      const isUnique = !colorsWithoutMinOrMax.some(
        color => color.value === targetValue && color.id !== threshold.id
      )

      allowedToUpdate = greaterThanMin && lessThanMax && isUnique
    }

    return allowedToUpdate
  }

  handleUpdatePrefix = e => {
    const {handleUpdateAxes, axes} = this.props
    const newAxes = {...axes, y: {...axes.y, prefix: e.target.value}}

    handleUpdateAxes(newAxes)
  }

  handleLoadRanges = () => {
    const {
      axes: {
        y: {prefix},
      },
    } = this.props
    const regexRanges = /(?:\[\[(.*?)\]\])/gm
    const rangevals = prefix.split(regexRanges)
    this.setState({
      range1: typeof rangevals[1] === 'undefined' ? '0,0' : rangevals[1],
    })
    this.setState({
      range2: typeof rangevals[3] === 'undefined' ? '0,0' : rangevals[3],
    })
    this.setState({
      range3: typeof rangevals[5] === 'undefined' ? '0,0' : rangevals[5],
    })
    this.setState({
      range4: typeof rangevals[7] === 'undefined' ? '0,0' : rangevals[7],
    })
  }

  handleUpdateRanges = () => {
    const newRule = `[[${this.state.range1}]]:[[${this.state.range2}]]:[[${
      this.state.range3
    }]]:[[${this.state.range4}]]`

    const {handleUpdateAxes, axes} = this.props
    const newAxes = {...axes, y: {...axes.y, prefix: newRule}}

    handleUpdateAxes(newAxes)
  }

  handleUpdateRange1 = e => {
    this.setState({range1: e.target.value})
  }
  handleUpdateRange2 = e => {
    this.setState({range2: e.target.value})
  }
  handleUpdateRange3 = e => {
    this.setState({range3: e.target.value})
  }
  handleUpdateRange4 = e => {
    this.setState({range4: e.target.value})
  }

  handleUpdateSuffix = e => {
    const {handleUpdateAxes, axes} = this.props
    const newAxes = {...axes, y: {...axes.y, suffix: e.target.value}}

    handleUpdateAxes(newAxes)
  }

  get sortedGaugeColors() {
    const {gaugeColors} = this.props
    const sortedColors = _.sortBy(gaugeColors, 'value')

    return sortedColors
  }

  render() {
    const {
      gaugeColors,
      axes: {
        y: {suffix},
      },
    } = this.props

    const disableMaxColor = gaugeColors.length > MIN_THRESHOLDS
    // const disableAddThreshold = gaugeColors.length > MAX_THRESHOLDS

    return (
      <FancyScrollbar
        className="display-options--cell y-axis-controls"
        autoHide={false}
      >
        <div className="display-options--cell-wrapper">
          <h5 className="display-options--header">PX Gauge Controls</h5>
          <div className="thresholds-list">
            {/* <button*/}
            {/* className="btn btn-sm btn-primary"*/}
            {/* onClick={this.handleAddThreshold}*/}
            {/* disabled={disableAddThreshold}*/}
            {/* >*/}
            {/* <span className="icon plus" /> Add Threshold*/}
            {/* </button>*/}
            {this.sortedGaugeColors.map((color, index) => (
              <Threshold
                isMin={index === 0}
                isMax={index === gaugeColors.length - 1}
                visualizationType="gauge"
                threshold={color}
                key={uuid.v4()}
                disableMaxColor={disableMaxColor}
                onChooseColor={this.handleChooseColor}
                onValidateColorValue={this.handleValidateColorValue}
                onUpdateColorValue={this.handleUpdateColorValue}
                onDeleteThreshold={this.handleDeleteThreshold}
              />
            ))}
          </div>
          <div className="graph-options-group form-group-wrapper">
            {/* <div className="form-group col-xs-6">*/}
            {/* <label>Prefix</label>*/}
            {/* <input*/}
            {/* className="form-control input-sm"*/}
            {/* placeholder="Prefix"*/}
            {/* defaultValue={prefix}*/}
            {/* onChange={this.handleUpdatePrefix}*/}
            {/* maxLength="100"*/}
            {/* />*/}
            {/* </div>*/}
            <div className="form-group col-xs-12">
              <label>Suffix</label>
              <input
                className="form-control input-sm"
                placeholder="%, MPH, etc."
                defaultValue={suffix}
                onChange={this.handleUpdateSuffix}
                maxLength="100"
              />
            </div>
          </div>

          <div className="form-group col-xs-3">
            <label>Error</label>
            <input
              name="rangeerror"
              className="form-control input-sm"
              placeholder="Prefix"
              value={this.state.range1}
              onChange={this.handleUpdateRange1}
              maxLength="5"
            />
          </div>
          <div className="form-group col-xs-3">
            <label>Abnormal</label>
            <input
              name="rangeabnormal"
              className="form-control input-sm"
              placeholder="%, MPH, etc."
              value={this.state.range2}
              onChange={this.handleUpdateRange2}
              maxLength="5"
            />
          </div>
          <div className="form-group col-xs-3">
            <label>Anomaly</label>
            <input
              name="rangeanomaly"
              className="form-control input-sm"
              placeholder="Prefix"
              value={this.state.range3}
              onChange={this.handleUpdateRange3}
              maxLength="5"
            />
          </div>
          <div className="form-group col-xs-3">
            <label>Normal</label>
            <input
              name="rangenormal"
              className="form-control input-sm"
              placeholder="%, MPH, etc."
              value={this.state.range4}
              onChange={this.handleUpdateRange4}
              maxLength="5"
            />
          </div>
          <div className="form-group col-xs-6">
            <button
              className="btn btn-sm btn-default"
              onClick={this.handleLoadRanges}
            >
              <span className="icon plus" /> Load Threshold
            </button>
          </div>
          <div className="form-group col-xs-6">
            <button
              className="btn btn-sm btn-primary"
              onClick={this.handleUpdateRanges}
            >
              <span className="icon plus" /> Set Threshold
            </button>
          </div>
        </div>
      </FancyScrollbar>
    )
  }
}

const {func, shape} = PropTypes

PxGaugeOptions.propTypes = {
  gaugeColors: colorsNumberSchema,
  handleUpdateGaugeColors: func.isRequired,
  handleUpdateAxes: func.isRequired,
  axes: shape({}).isRequired,
  onResetFocus: func.isRequired,
}

const mapStateToProps = ({
  cellEditorOverlay: {
    gaugeColors,
    cell: {axes},
  },
}) => ({
  gaugeColors,
  axes,
})

const mapDispatchToProps = dispatch => ({
  handleUpdateGaugeColors: bindActionCreators(updateGaugeColors, dispatch),
  handleUpdateAxes: bindActionCreators(updateAxes, dispatch),
})
export default connect(mapStateToProps, mapDispatchToProps)(PxGaugeOptions)
