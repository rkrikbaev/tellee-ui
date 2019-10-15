import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import FancyScrollbar from 'shared/components/FancyScrollbar'
import Form from 'react-jsonschema-form'

import {GRAPH_TYPES} from 'src/dashboards/graphics/graph'

import {updateAxes} from 'src/dashboards/actions/cellEditorOverlay'
import {ErrorHandling} from 'src/shared/decorators/errors'

// import ThresholdsList from 'src/shared/components/ThresholdsList'

@ErrorHandling
class GisOptions extends Component {
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
      type: 'object',
      required: ['items'],
      properties: {
        items: {
          title: 'Devices',
          type: 'array',
          items: {
            type: 'object',
            required: ['link'],
            properties: {
              link: {
                type: 'string',
                minLength: 3,
                maxLength: 50,
              },
            },
          },
        },
      },
    }

    const defData = {
      items: [
        {
          link: 'http://flash.zeinetsse.com',
        },
      ],
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
        y2: {
          ...axes.y2,
          prefix: _prefix,
        },
      }
      handleUpdateAxes(newAxes)
    }

    const {
      axes: {
        y2: {prefix}, // base, bounds,  defaultYLabel,label,
      },
      type,
      // onResetFocus,
    } = this.props

    const {menuOption} = GRAPH_TYPES.find(graph => graph.type === type)
    const formData = this.isJsonString(prefix) ? JSON.parse(prefix) : defData
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
          <div className="form-group col-sm-12 gisOptions-form">
            <Form
              schema={schema}
              uiSchema={uiSchema}
              formData={formData}
              className="form-group-wrapper mozilla-dynamic-forms"
              onChange={onSubmit}
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

GisOptions.defaultProps = {
  axes: {
    y2: {
      prefix: '',
    },
  },
}

GisOptions.propTypes = {
  type: string.isRequired,
  axes: shape({
    y2: shape({
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

export default connect(mapStateToProps, mapDispatchToProps)(GisOptions)
