import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

// import OptIn from 'shared/components/OptIn'
import Input from 'src/dashboards/components/DisplayOptionsInput'
import {Tabber, Tab} from 'src/dashboards/components/Tabber'
import FancyScrollbar from 'shared/components/FancyScrollbar'
// import LineGraphColorSelector from 'src/shared/components/LineGraphColorSelector'
import Form from 'react-jsonschema-form'

import {
  AXES_SCALE_OPTIONS,
  // TOOLTIP_Y_VALUE_FORMAT,
} from 'src/dashboards/constants/cellEditor'
import {GRAPH_TYPES} from 'src/dashboards/graphics/graph'

import {updateAxes} from 'src/dashboards/actions/cellEditorOverlay'
import {ErrorHandling} from 'src/shared/decorators/errors'

const {LINEAR, LOG, BASE_10} = AXES_SCALE_OPTIONS // BASE_2,
// const getInputMin = scale => (scale === LOG ? '0' : null)

@ErrorHandling
class PxMstatOptions extends Component {
  handleSetPrefixSuffix = e => {
    const {handleUpdateAxes, axes} = this.props
    const {prefix, suffix} = e.target.form

    const newAxes = {
      ...axes,
      y: {
        ...axes.y,
        prefix: prefix.value,
        suffix: suffix.value,
      },
    }

    handleUpdateAxes(newAxes)
  }

  // handleSetYAxisBoundMin = min => {
  //   const {handleUpdateAxes, axes} = this.props
  //   const {
  //     y: {
  //       bounds: [, max],
  //     },
  //   } = this.props.axes
  //   const newAxes = {...axes, y: {...axes.y, bounds: [min, max]}}
  //
  //   handleUpdateAxes(newAxes)
  // }
  //
  // handleSetYAxisBoundMax = max => {
  //   const {handleUpdateAxes, axes} = this.props
  //   const {
  //     y: {
  //       bounds: [min],
  //     },
  //   } = axes
  //   const newAxes = {...axes, y: {...axes.y, bounds: [min, max]}}
  //
  //   handleUpdateAxes(newAxes)
  // }

  // handleSetLabel = label => {
  //   const {handleUpdateAxes, axes} = this.props
  //   const newAxes = {...axes, y: {...axes.y, label}}
  //
  //   handleUpdateAxes(newAxes)
  // }

  handleSetScale = scale => () => {
    const {handleUpdateAxes, axes} = this.props
    const newAxes = {...axes, y: {...axes.y, scale}}

    handleUpdateAxes(newAxes)
  }
  //
  // handleSetBase = base => () => {
  //   const {handleUpdateAxes, axes} = this.props
  //   const newAxes = {...axes, y: {...axes.y, base}}
  //
  //   handleUpdateAxes(newAxes)
  // }

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
    const schema = {
      title: 'Predix icons for each Stat Value',
      type: 'array',
      items: {
        type: 'string',
        maxLength: 30,
        minLength: 3,
      },
    }
    const uiSchema = {
      title: {
        classNames: 'mozilla-dynamic-forms',
      },
      items: {
        classNames: 'mozilla-dynamic-forms',
      },
    }

    // const log = type => {
    //   console.log(console, type)
    // }

    const onSubmit = ({formData}) => {
      const {handleUpdateAxes, axes} = this.props
      const _prefix = JSON.stringify(formData)

      const newAxes = {
        ...axes,
        y: {
          ...axes.y,
          prefix: _prefix,
        },
      }
      handleUpdateAxes(newAxes)
    }

    const {
      axes: {
        y: {prefix, suffix, scale}, // base, bounds,  defaultYLabel,label,
      },
      type,
      staticLegend,
      onToggleStaticLegend,
    } = this.props

    // const [min, max] = bounds

    const {menuOption} = GRAPH_TYPES.find(graph => graph.type === type)
    const formData = this.isJsonString(prefix) ? JSON.parse(prefix) : ''
    return (
      <FancyScrollbar
        className="display-options--cell y-axis-controls"
        autoHide={false}
      >
        <div className="display-options--cell-wrapper">
          <h5 className="display-options--header">{menuOption} Controls</h5>
          <form autoComplete="off" className="form-group-wrapper">
            <div className="form-group col-sm-12">
              <Input
                name="suffix"
                id="suffix"
                value={suffix}
                labelText="Bottom title value"
                onChange={this.handleSetPrefixSuffix}
                maxLength="5"
                colWidth="12"
              />
            </div>
            <div className="form-group col-md-12">
              <Tabber labelText="Include prev. values">
                <Tab
                  text="Yes"
                  isActive={staticLegend}
                  onClickTab={onToggleStaticLegend(true)}
                />
                <Tab
                  text="No"
                  isActive={!staticLegend}
                  onClickTab={onToggleStaticLegend(false)}
                />
              </Tabber>
            </div>
            <div className="form-group col-md-12">
              <Tabber labelText="Minimal Size(do not name the cell in this mode)">
                <Tab
                  text="No"
                  isActive={scale === LINEAR}
                  onClickTab={this.handleSetScale(LINEAR)}
                />
                <Tab
                  text="Yes"
                  isActive={scale === LOG}
                  onClickTab={this.handleSetScale(LOG)}
                />
              </Tabber>
            </div>
          </form>
          <Form
            schema={schema}
            uiSchema={uiSchema}
            formData={formData}
            className="form-group-wrapper mozilla-dynamic-forms"
            // onChange={log('changed')}
            onSubmit={onSubmit}
            // onError={log('errors')}
          >
            <div className="form-group col-sm-12 text-right">
              <button type="submit" className="btn btn-sm btn-success">
                Apply Icons
              </button>
            </div>
          </Form>
        </div>
      </FancyScrollbar>
    )
  }
}

const {arrayOf, bool, func, shape, string} = PropTypes

PxMstatOptions.defaultProps = {
  axes: {
    y: {
      bounds: ['', ''],
      prefix: '',
      suffix: '',
      base: BASE_10,
      scale: LINEAR,
      defaultYLabel: '',
    },
  },
}

PxMstatOptions.propTypes = {
  type: string.isRequired,
  axes: shape({
    y: shape({
      bounds: arrayOf(string),
      label: string,
      defaultYLabel: string,
    }),
  }).isRequired,
  onToggleStaticLegend: func.isRequired,
  staticLegend: bool,
  handleUpdateAxes: func.isRequired,
}

const mapStateToProps = ({
  cellEditorOverlay: {
    cell: {axes, type},
  },
}) => ({
  axes,
  type,
})

const mapDispatchToProps = dispatch => ({
  handleUpdateAxes: bindActionCreators(updateAxes, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(PxMstatOptions)
