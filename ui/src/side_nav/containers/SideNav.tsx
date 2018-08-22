import React, {PureComponent} from 'react'
import {withRouter, Link} from 'react-router'
import {connect} from 'react-redux'

import Authorized, {ADMIN_ROLE} from 'src/auth/Authorized'

import UserNavBlock from 'src/side_nav/components/UserNavBlock'
import FeatureFlag from 'src/shared/components/FeatureFlag'
import {I18n} from 'react-i18next'

import {
  NavBlock,
  NavHeader,
  NavListItem,
} from 'src/side_nav/components/NavItems'

import {DEFAULT_HOME_PAGE} from 'src/shared/constants'
import {Params, Location, Links, Me} from 'src/types/sideNav'
import {ErrorHandling} from 'src/shared/decorators/errors'
import DashboardsSidenav from 'src/dashboards/containers/DashboardsSidenav'

interface Props {
  params: Params
  location: Location
  isHidden: boolean
  isUsingAuth?: boolean
  logoutLink?: string
  links?: Links
  me: Me
}

@ErrorHandling
class SideNav extends PureComponent<Props> {
  constructor(props) {
    super(props)
  }

  public render() {
    const {
      params: {sourceID},
      location: {pathname: location},
      isHidden,
      isUsingAuth,
      logoutLink,
      links,
      me,
    } = this.props

    const sourcePrefix = `/sources/${sourceID}`
    const dataExplorerLink = `${sourcePrefix}/chronograf/data-explorer`

    const isDefaultPage = location.split('/').includes(DEFAULT_HOME_PAGE)
    return isHidden ? null : (
      <I18n>
        {t => (
          <nav className="sidebar">
            <div
              className={
                isDefaultPage ? 'sidebar--item active' : 'sidebar--item'
              }
            >
              <Link
                to={`${sourcePrefix}/${DEFAULT_HOME_PAGE}`}
                className="sidebar--square sidebar--logo"
              >
                <span className="sidebar--icon icon cubo-uniform" />
              </Link>
            </div>
            <NavBlock
              highlightWhen={['dashboards']}
              icon="dash-h"
              link={`${sourcePrefix}/dashboards`}
              location={location}
            >
              <NavHeader
                link={`${sourcePrefix}/dashboards`}
                title={t('Dashboards')}
              />
            </NavBlock>
            <DashboardsSidenav
              sourcePrefix={sourcePrefix}
              location={location}
            />
            <NavBlock
              highlightWhen={['data-explorer', 'delorean']}
              icon="graphline"
              link={dataExplorerLink}
              location={location}
            >
              <NavHeader link={dataExplorerLink} title={t('Data Explorer')} />
              <FeatureFlag name="time-machine">
                <NavHeader
                  link={`${sourcePrefix}/delorean`}
                  title={t('Time Machine')}
                />
              </FeatureFlag>
            </NavBlock>
            {/*<NavBlock*/}
            {/*highlightWhen={['hosts']}*/}
            {/*icon="cubo-node"*/}
            {/*link={`${sourcePrefix}/hosts`}*/}
            {/*location={location}*/}
            {/*>*/}
            {/*<NavHeader*/}
            {/*link={`${sourcePrefix}/hosts`}*/}
            {/*title={t('Host List')}*/}
            {/*/>*/}
            {/*</NavBlock>*/}
            <Authorized
              requiredRole={ADMIN_ROLE}
              replaceWithIfNotUsingAuth={
                <NavBlock
                  highlightWhen={['admin-influxdb']}
                  icon="crown2"
                  link={`${sourcePrefix}/admin-influxdb/databases`}
                  location={location}
                >
                  <NavHeader
                    link={`${sourcePrefix}/admin-influxdb/databases`}
                    title={t('InfluxDB Admin')}
                  />
                </NavBlock>
              }
            >
              <NavBlock
                highlightWhen={[
                  'admin-chronograf',
                  'admin-influxdb',
                  'alerts',
                  'alert-rules',
                  'tickscript',
                ]}
                icon="crown2"
                link={`${sourcePrefix}/admin-chronograf/current-organization`}
                location={location}
              >
                <NavHeader
                  link={`${sourcePrefix}/admin-chronograf/current-organization`}
                  title={t('Admin')}
                />
                <NavListItem
                  link={`${sourcePrefix}/admin-chronograf/current-organization`}
                >
                  {t('Orgs and Users')}
                </NavListItem>
                <NavListItem link={`${sourcePrefix}/admin-influxdb/databases`}>
                  InfluxDB
                </NavListItem>
                <NavListItem link={`${sourcePrefix}/alert-rules`}>
                  {t('Manage Tasks')}
                </NavListItem>
                <NavListItem link={`${sourcePrefix}/alerts`}>
                  {t('Alert History')}
                </NavListItem>
              </NavBlock>
            </Authorized>
            <NavBlock
              highlightWhen={['manage-sources', 'kapacitors']}
              icon="cog-thick"
              link={`${sourcePrefix}/manage-sources`}
              location={location}
            >
              <NavHeader
                link={`${sourcePrefix}/manage-sources`}
                title={t('Configuration')}
              />
            </NavBlock>
            {isUsingAuth ? (
              <UserNavBlock
                logoutLink={logoutLink}
                links={links}
                me={me}
                sourcePrefix={sourcePrefix}
              />
            ) : null}
          </nav>
        )}
      </I18n>
    )
  }
}

const mapStateToProps = ({
  auth: {isUsingAuth, logoutLink, me},
  app: {
    ephemeral: {inPresentationMode},
  },
  links,
}) => ({
  isHidden: inPresentationMode,
  isUsingAuth,
  logoutLink,
  links,
  me,
})

export default connect(mapStateToProps)(withRouter(SideNav))
