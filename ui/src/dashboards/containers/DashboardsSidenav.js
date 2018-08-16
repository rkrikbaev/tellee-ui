import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import _ from 'lodash'
import {ErrorHandling} from 'src/shared/decorators/errors'
import {
  NavBlock,
  NavHeader,
  // NavListItem,
} from 'src/side_nav/components/NavItems'

@ErrorHandling
class DashboardsSidenav extends Component {
  checkFavourite = json => {
    const str = json.toString()
    try {
      const dashData = JSON.parse(str)
      if (dashData.dashboardType === 'favourite') {
        return true
      }
      return false
    } catch (e) {
      return false
    }
  }

  getDashboardParams = json => {
    const str = json.toString()
    try {
      return JSON.parse(str)
    } catch (e) {
      return {name: 'error, please edit name'}
    }
  }

  render() {
    const {dashboards, sourcePrefix, location} = this.props
    const filteredDashboards = dashboards.filter(d =>
      this.checkFavourite(d.name)
    )
    // const dashboardLink = `/sources/${this.props.source.id}`
    return _.sortBy(filteredDashboards, d => d.name.toLowerCase()).map(
      dashboard => (
        <NavBlock
          key={dashboard.id}
          highlightWhen={dashboard.id}
          icon={this.getDashboardParams(dashboard.name).icon}
          link={`${sourcePrefix}/dashboards/${dashboard.id}`}
          location={location}
        >
          <NavHeader
            link={`${sourcePrefix}/dashboards/${dashboard.id}`}
            title={this.getDashboardParams(dashboard.name).name}
          />
        </NavBlock>
      )
    )
  }
}

const {arrayOf, string, shape} = PropTypes

DashboardsSidenav.propTypes = {
  source: shape({
    id: string.isRequired,
    name: string.isRequired,
    links: shape({
      proxy: string.isRequired,
    }).isRequired,
    telegraf: string.isRequired,
  }),
  dashboards: arrayOf(shape()),
  sourcePrefix: string,
  location: string,
}

const mapStateToProps = ({dashboardUI: {dashboards, dashboard}}) => ({
  dashboards,
  dashboard,
})

export default connect(mapStateToProps, null)(DashboardsSidenav)
