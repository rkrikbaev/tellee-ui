import React from 'react'
import ThemeColorDropdown from 'src/shared/components/ThemeColorDropdown'
import SourceIndicator from 'shared/components/SourceIndicator'
import {Trans} from 'react-i18next'
import LocalizationSwitcher from 'src/shared/components/LocalizationSwitcher'

const DashboardsHeader = () => (
  <div className="page-header">
    <div className="page-header__container">
      <div className="page-header__left">
        <h1 className="page-header__title">
          <Trans>Dashboards</Trans>
        </h1>
      </div>
      <div className="page-header__right">
        <SourceIndicator />
        <ThemeColorDropdown />
        <LocalizationSwitcher />
      </div>
    </div>
  </div>
)

export default DashboardsHeader
