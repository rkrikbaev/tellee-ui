import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  DASHBOARD_NAME_MAX_LENGTH,
  NEW_DASHBOARD,
} from 'src/dashboards/constants/index'
import {ErrorHandling} from 'src/shared/decorators/errors'
import Modal from 'react-responsive-modal'
import Form from 'react-jsonschema-form'

@ErrorHandling
class DashboardEditHeader extends Component {
  constructor(props) {
    super(props)

    this.state = {
      reset: false,
      open: false,
    }
  }

  onOpenModal = () => {
    this.setState({open: true})
  }

  onCloseModal = () => {
    this.setState({open: false})
  }

  onSubmit = ({formData}) => {
    const {onSave} = this.props
    const _formData = JSON.stringify(formData)
    onSave(_formData)
    this.setState({open: false})
  }

  handleKeyDown = e => {
    if (e.key === 'Enter') {
      this.inputRef.blur()
    }
    if (e.key === 'Escape') {
      this.inputRef.value = this.props.activeDashboard
      this.setState({reset: true}, () => this.inputRef.blur())
    }
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
    const {activeDashboard} = this.props
    const {open} = this.state

    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          maxLength: DASHBOARD_NAME_MAX_LENGTH,
        },
        icon: {
          type: 'string',
        },
        dashboardType: {
          title: 'Dashboard type',
          type: 'string',
          enum: ['generic', 'favourite', 'report'],
          enumNames: ['generic', 'favourite', 'report'],
        },
      },
    }

    const uiSchema = {
      title: {
        classNames: 'mozilla-dynamic-forms',
      },
      properties: {
        classNames: 'mozilla-dynamic-forms',
      },
      dashboardType: {
        'ui:autofocus': true,
        'ui:emptyValue': NEW_DASHBOARD,
      },
    }

    const getDashboardParams = json => {
      const str = json.toString()
      try {
        return JSON.parse(str)
      } catch (e) {
        return {name: 'error, please edit name'}
      }
    }

    const formData = this.isJsonString(activeDashboard)
      ? JSON.parse(activeDashboard)
      : ''

    return (
      <div className="dashboard-title">
        <Modal open={open} onClose={this.onCloseModal} top={true}>
          <h4>Edit dashboard params</h4>
          <div className="panel">
            <div className="panel-body">
              <Form
                schema={schema}
                uiSchema={uiSchema}
                formData={formData}
                className="form-group-wrapper mozilla-dynamic-forms"
                // onChange={log('changed')}
                onSubmit={this.onSubmit}
                // onError={log('errors')}
              >
                <div className="form-group col-sm-12 width800">
                  <button type="submit" className="btn btn-sm btn-success">
                    <i className="icon checkmark" />
                    Apply Icons
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </Modal>
        <h1 onClick={this.onOpenModal}>
          {getDashboardParams(activeDashboard).name}
        </h1>
      </div>
    )
  }
}

const {bool, func, string} = PropTypes

DashboardEditHeader.propTypes = {
  activeDashboard: string.isRequired,
  onSave: func.isRequired,
  onCancel: func.isRequired,
  isEditMode: bool,
}

export default DashboardEditHeader
