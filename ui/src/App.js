import React from 'react'
import PropTypes from 'prop-types'

import SideNav from 'src/side_nav'
import Notifications from 'shared/components/Notifications'
import Overlay from 'shared/components/OverlayTechnology'

import {I18nextProvider} from 'react-i18next'
import i18n from 'src/localizations/i18n'

const App = ({children}) => (
  <I18nextProvider i18n={i18n}>
    <div className="chronograf-root">
      <div className="divzsselogo" />
      <Overlay />
      <Notifications />
      <SideNav />
      {children}
    </div>
  </I18nextProvider>
)

const {node} = PropTypes

App.propTypes = {
  children: node.isRequired,
}

export default App
