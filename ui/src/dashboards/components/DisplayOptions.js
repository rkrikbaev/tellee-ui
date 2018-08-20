import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import GraphTypeSelector from 'src/dashboards/components/GraphTypeSelector'
import GaugeOptions from 'src/dashboards/components/GaugeOptions'
import SingleStatOptions from 'src/dashboards/components/SingleStatOptions'
import AxesOptions from 'src/dashboards/components/AxesOptions'
import TableOptions from 'src/dashboards/components/TableOptions'
import PxPercentCircleOptions from 'src/dashboards/components/PxPercentCircleOptions'
import PxKpiOptions from 'src/dashboards/components/PxKpiOptions'
import PxGaugeOptions from 'src/dashboards/components/PxGaugeOptions'
import PxMstatOtions from 'src/dashboards/components/PxMstatOptions'
import PxRadarOptions from 'src/dashboards/components/PxRadarOptions'
import PxGanttOptions from 'src/dashboards/components/PxGanttOptions'

import {buildDefaultYLabel} from 'shared/presenters'
import {ErrorHandling} from 'src/shared/decorators/errors'

@ErrorHandling
class DisplayOptions extends Component {
  constructor(props) {
    super(props)

    const {axes, queryConfigs} = props

    this.state = {
      axes: this.setDefaultLabels(axes, queryConfigs),
    }
  }

  componentWillReceiveProps(nextProps) {
    const {axes, queryConfigs} = nextProps

    this.setState({axes: this.setDefaultLabels(axes, queryConfigs)})
  }

  setDefaultLabels(axes, queryConfigs) {
    return queryConfigs.length
      ? {
          ...axes,
          y: {...axes.y, defaultYLabel: buildDefaultYLabel(queryConfigs[0])},
        }
      : axes
  }

  renderOptions = () => {
    const {
      cell: {type},
      staticLegend,
      onToggleStaticLegend,
      onResetFocus,
      queryConfigs,
    } = this.props
    switch (type) {
      case 'gauge':
        return <GaugeOptions onResetFocus={onResetFocus} />
      case 'single-stat':
        return <SingleStatOptions onResetFocus={onResetFocus} />
      case 'px-percent-circle':
        return <PxPercentCircleOptions onResetFocus={onResetFocus} />
      case 'px-gauge':
        return <PxGaugeOptions onResetFocus={onResetFocus} />
      case 'px-kpi':
        return (
          <PxKpiOptions
            onToggleStaticLegend={onToggleStaticLegend}
            staticLegend={staticLegend}
          />
        )
      case 'px-mstat':
        return (
          <PxMstatOtions
            onToggleStaticLegend={onToggleStaticLegend}
            staticLegend={staticLegend}
          />
        )
      case 'px-radar':
        return (
          <PxRadarOptions
            onToggleStaticLegend={onToggleStaticLegend}
            staticLegend={staticLegend}
          />
        )
      case 'px-timeseries':
        return (
          <PxRadarOptions
            onToggleStaticLegend={onToggleStaticLegend}
            staticLegend={staticLegend}
          />
        )
      case 'table':
        return (
          <TableOptions
            onResetFocus={onResetFocus}
            queryConfigs={queryConfigs}
          />
        )
      case 'px-gantt':
        return (
          <PxGanttOptions
            onResetFocus={onResetFocus}
            queryConfigs={queryConfigs}
          />
        )
      default:
        return (
          <AxesOptions
            onToggleStaticLegend={onToggleStaticLegend}
            staticLegend={staticLegend}
          />
        )
    }
  }

  render() {
    return (
      <div className="display-options">
        <GraphTypeSelector />
        {this.renderOptions()}
      </div>
    )
  }
}

const {arrayOf, bool, func, shape, string} = PropTypes

DisplayOptions.propTypes = {
  cell: shape({
    type: string.isRequired,
  }).isRequired,
  axes: shape({
    y: shape({
      bounds: arrayOf(string),
      label: string,
      defaultYLabel: string,
    }),
  }).isRequired,
  queryConfigs: arrayOf(shape()).isRequired,
  onToggleStaticLegend: func.isRequired,
  staticLegend: bool,
  onResetFocus: func.isRequired,
}

const mapStateToProps = ({
  cellEditorOverlay: {
    cell,
    cell: {axes},
  },
}) => ({
  cell,
  axes,
})

export default connect(mapStateToProps, null)(DisplayOptions)
