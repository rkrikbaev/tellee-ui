import React from 'react'
import PropTypes from 'prop-types'
import {isCellUntitled} from 'src/dashboards/utils/cellGetters'

const LayoutCellHeader = ({isEditable, cellName}) => {
  const headingClass = `dash-graph--heading ${
    isEditable ? 'dash-graph--draggable dash-graph--heading-draggable' : ''
  }`

  let customColor = ''
  const regexColor = /head#[A-Fa-f0-9]{6}/
  const colorSearch = regexColor.exec(cellName)
  if (colorSearch !== null) {
    cellName = cellName.replace(colorSearch, '')
    customColor = colorSearch[0].replace('head', '')
  }

  const regexColorBody = /body#[A-Fa-f0-9]{6}/
  const colorSearchBody = regexColorBody.exec(cellName)
  if (colorSearchBody !== null) {
    cellName = cellName.replace(colorSearchBody, '')
  }
  return (
    <div className={headingClass} style={{background: customColor}}>
      <span
        className={
          isCellUntitled(cellName)
            ? 'dash-graph--name dash-graph--name__default'
            : 'dash-graph--name'
        }
      >
        {cellName}
      </span>
    </div>
  )
}

const {bool, string} = PropTypes

LayoutCellHeader.propTypes = {
  isEditable: bool,
  cellName: string,
}

export default LayoutCellHeader
