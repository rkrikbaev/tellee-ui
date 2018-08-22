import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import FancyScrollbar from 'shared/components/FancyScrollbar'
import Form from 'react-jsonschema-form'

import {GRAPH_TYPES} from 'src/dashboards/graphics/graph'

import {updateAxes} from 'src/dashboards/actions/cellEditorOverlay'
import {ErrorHandling} from 'src/shared/decorators/errors'

import ThresholdsList from 'src/shared/components/ThresholdsList'

@ErrorHandling
class PxGanttOptions extends Component {
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
      definitions: {
        Color: {
          title: 'Color',
          type: 'string',
          anyOf: [
            {
              type: 'string',
              enum: ['#ff0000'],
              title: 'Red',
            },
            {
              type: 'string',
              enum: ['#00ff00'],
              title: 'Green',
            },
            {
              type: 'string',
              enum: ['#0000ff'],
              title: 'Blue',
            },
            {
              type: 'string',
              enum: ['#e7e778'],
              title: 'Yellow',
            },
          ],
        },
      },
      type: 'object',
      required: ['stateOne', 'stateTwo', 'stateThree', 'stateFour'],
      properties: {
        stateOne: {
          title: 'State 1',
          type: 'string',
          minLength: 3,
          maxLength: 6,
        },
        stateOneColor: {
          $ref: '#/definitions/Color',
          title: 'State 1 Color',
        },
        stateTwo: {
          title: 'State 2',
          type: 'string',
          minLength: 3,
          maxLength: 6,
        },
        stateTwoColor: {
          $ref: '#/definitions/Color',
          title: 'State 2 Color',
        },
        stateThree: {
          title: 'State 3',
          type: 'string',
          minLength: 3,
          maxLength: 6,
        },
        stateThreeColor: {
          $ref: '#/definitions/Color',
          title: 'State 3 Color',
        },
        stateFour: {
          title: 'State 4',
          type: 'string',
          minLength: 3,
          maxLength: 6,
        },
        stateFourColor: {
          $ref: '#/definitions/Color',
          title: 'State 4 Color',
        },
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
        y: {prefix}, // base, bounds,  defaultYLabel,label,
      },
      type,
      onResetFocus,
    } = this.props

    console.log(this.props)
    const {menuOption} = GRAPH_TYPES.find(graph => graph.type === type)
    const formData = this.isJsonString(prefix) ? JSON.parse(prefix) : ''
    return (
      <FancyScrollbar
        className="display-options--cell y-axis-controls"
        autoHide={false}
      >
        <div className="display-options--cell-wrapper">
          <h5 className="display-options--header">{menuOption} Controls</h5>
          {/* <div className="form-group col-sm-12">
            <ThresholdsList
              showListHeading={true}
              onResetFocus={onResetFocus}
            />
          </div> */}
          <div className="form-group col-sm-12 pxGanttOptions-form">
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
                  Apply
                </button>
              </div>
            </Form>
          </div>
        </div>
      </FancyScrollbar>
    )
  }
}

const {arrayOf, bool, func, shape, string} = PropTypes

PxGanttOptions.defaultProps = {
  axes: {
    y: {
      prefix: '',
    },
  },
}

PxGanttOptions.propTypes = {
  type: string.isRequired,
  axes: shape({
    y: shape({
      bounds: arrayOf(string),
      label: string,
      defaultYLabel: string,
    }),
  }).isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(PxGanttOptions)
