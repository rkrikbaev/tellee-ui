import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import _ from 'lodash'
import classnames from 'classnames'
import Authorized, {EDITOR_ROLE} from 'src/auth/Authorized'

import ConfirmButton from 'shared/components/ConfirmButton'

const AuthorizedEmptyState = ({onCreateDashboard}) => (
  <div className="generic-empty-state">
    <h4 style={{marginTop: '90px'}}>
      Looks like you don’t have any dashboards
    </h4>
    <br />
    <button
      className="btn btn-sm btn-primary"
      onClick={onCreateDashboard}
      style={{marginBottom: '90px'}}
    >
      <span className="icon plus" /> Create Dashboard
    </button>
  </div>
)

const unauthorizedEmptyState = (
  <div className="generic-empty-state">
    <h4 style={{margin: '90px 0'}}>Looks like you don’t have any dashboards</h4>
  </div>
)

const getDashboardParams = json => {
  const str = json.toString()
  try {
    return JSON.parse(str)
  } catch (e) {
    return {name: str}
  }
}

const DashboardsTable = ({
  dashboards,
  onDeleteDashboard,
  onCreateDashboard,
  onCloneDashboard,
  dashboardLink,
}) => {
  return dashboards && dashboards.length ? (
    <table className="table v-center admin-table table-highlight">
      <tbody>
        {_.sortBy(dashboards, d => d.id).map(
          dashboard =>
            getDashboardParams(dashboard.name).dashboardType ===
            'favourite' ? null : (
              <tr key={dashboard.id} className="dashboardsListTd">
                <td width="16">
                  {/* <px-icon class="blue" icon={getDashboardParams(dashboard.name).icon} />*/}
                  <div
                    className={classnames(
                      'icon',
                      'dashboardIcon',
                      getDashboardParams(dashboard.name).icon || 'fa-chart-bar'
                    )}
                  />
                </td>
                <td>
                  <Link to={`${dashboardLink}/dashboards/${dashboard.id}`}>
                    <span className="dashboardNames">
                      {getDashboardParams(dashboard.name).name}
                    </span>
                  </Link>
                </td>
                <td>
                  {dashboard.templates.length ? (
                    dashboard.templates.map(tv => (
                      <code className="table--temp-var" key={tv.id}>
                        {tv.tempVar}
                      </code>
                    ))
                  ) : (
                    <span className="empty-string">None</span>
                  )}
                </td>
                <Authorized
                  requiredRole={EDITOR_ROLE}
                  replaceWithIfNotAuthorized={<td />}
                >
                  <td className="text-right">
                    <button
                      className="btn btn-xs btn-default table--show-on-row-hover"
                      onClick={onCloneDashboard(dashboard)}
                    >
                      <span className="icon duplicate" />
                      Clone
                    </button>
                    <ConfirmButton
                      confirmAction={onDeleteDashboard(dashboard)}
                      size="btn-xs"
                      type="btn-danger"
                      text="Delete"
                      customClass="table--show-on-row-hover"
                    />
                  </td>
                </Authorized>
              </tr>
            )
        )}
      </tbody>
    </table>
  ) : (
    <Authorized
      requiredRole={EDITOR_ROLE}
      replaceWithIfNotAuthorized={unauthorizedEmptyState}
    >
      <AuthorizedEmptyState onCreateDashboard={onCreateDashboard} />
    </Authorized>
  )
}

const {arrayOf, func, shape, string} = PropTypes

DashboardsTable.propTypes = {
  dashboards: arrayOf(shape()),
  onDeleteDashboard: func.isRequired,
  onCreateDashboard: func.isRequired,
  onCloneDashboard: func.isRequired,
  dashboardLink: string.isRequired,
}

AuthorizedEmptyState.propTypes = {
  onCreateDashboard: func.isRequired,
}

export default DashboardsTable
