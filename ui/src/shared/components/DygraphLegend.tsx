import React, {PureComponent, ChangeEvent} from 'react'
import {connect} from 'react-redux'
import Dygraph from 'dygraphs'

import _ from 'lodash'
import classnames from 'classnames'
import uuid from 'uuid'

import * as actions from 'src/dashboards/actions'
import {SeriesLegendData} from 'src/types/dygraphs'
import DygraphLegendSort from 'src/shared/components/DygraphLegendSort'

import {makeLegendStyles, removeMeasurement} from 'src/shared/graphs/helpers'
import {ErrorHandling} from 'src/shared/decorators/errors'
import {NO_CELL} from 'src/shared/constants'

interface ExtendedDygraph extends Dygraph {
  graphDiv: HTMLElement
}

interface Props {
  dygraph: ExtendedDygraph
  cellID: string
  onHide: () => void
  onShow: (MouseEvent) => void
  activeCellID: string
  setActiveCell: (cellID: string) => void
}

interface LegendData {
  x: string | null
  series: SeriesLegendData[]
  xHTML: string
}

interface State {
  legend: LegendData
  sortType: string
  isAscending: boolean
  filterText: string
  isSnipped: boolean
  isFilterVisible: boolean
  legendStyles: object
  pageX: number | null
  cellID: string
}

@ErrorHandling
class DygraphLegend extends PureComponent<Props, State> {
  private legendRef: HTMLElement | null = null

  constructor(props) {
    super(props)

    this.props.dygraph.updateOptions({
      legendFormatter: this.legendFormatter,
      highlightCallback: this.highlightCallback,
      unhighlightCallback: this.unhighlightCallback,
    })

    this.state = {
      legend: {
        x: null,
        series: [],
        xHTML: '',
      },
      sortType: 'numeric',
      isAscending: false,
      filterText: '',
      isSnipped: false,
      isFilterVisible: false,
      legendStyles: {},
      pageX: null,
      cellID: null,
    }
  }

  public componentWillUnmount() {
    if (
      !this.props.dygraph.graphDiv ||
      !this.props.dygraph.visibility().find(bool => bool === true)
    ) {
      this.setState({filterText: ''})
    }
  }

  public render() {
    const {
      legend,
      filterText,
      isSnipped,
      isAscending,
      isFilterVisible,
    } = this.state

    return (
      <div
        className={`dygraph-legend ${this.hidden}`}
        ref={el => (this.legendRef = el)}
        onMouseLeave={this.handleHide}
        style={this.styles}
      >
        <div className="dygraph-legend--header">
          <div className="dygraph-legend--timestamp">{legend.xHTML}</div>
          <DygraphLegendSort
            isAscending={isAscending}
            isActive={this.isAphaSort}
            top="A"
            bottom="Z"
            onSort={this.handleSortLegend('alphabetic')}
          />
          <DygraphLegendSort
            isAscending={isAscending}
            isActive={this.isNumSort}
            top="0"
            bottom="9"
            onSort={this.handleSortLegend('numeric')}
          />
          <button
            className={classnames('btn btn-square btn-sm', {
              'btn-default': !isFilterVisible,
              'btn-primary': isFilterVisible,
            })}
            onClick={this.handleToggleFilter}
          >
            <span className="icon search" />
          </button>
          <button
            className={classnames('btn btn-sm', {
              'btn-default': !isSnipped,
              'btn-primary': isSnipped,
            })}
            onClick={this.handleSnipLabel}
          >
            Snip
          </button>
        </div>
        {isFilterVisible && (
          <input
            className="dygraph-legend--filter form-control input-sm"
            type="text"
            value={filterText}
            onChange={this.handleLegendInputChange}
            placeholder="Filter items..."
            autoFocus={true}
          />
        )}
        <div className="dygraph-legend--divider" />
        <div className="dygraph-legend--contents">
          {this.filtered.map(({label, color, yHTML, isHighlighted}) => {
            const seriesClass = isHighlighted
              ? 'dygraph-legend--row highlight'
              : 'dygraph-legend--row'
            return (
              <div key={uuid.v4()} className={seriesClass}>
                <span style={{color}}>
                  {isSnipped ? removeMeasurement(label) : label}
                </span>
                <figure>{yHTML || 'no value'}</figure>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  private handleHide = (): void => {
    this.props.onHide()
    this.props.setActiveCell(NO_CELL)
  }

  private handleToggleFilter = (): void => {
    this.setState({
      isFilterVisible: !this.state.isFilterVisible,
      filterText: '',
    })
  }

  private handleSnipLabel = (): void => {
    this.setState({isSnipped: !this.state.isSnipped})
  }

  private handleLegendInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    const {dygraph} = this.props
    const {legend} = this.state
    const filterText = e.target.value

    legend.series.map((__, i) => {
      if (!legend.series[i]) {
        return dygraph.setVisibility(i, true)
      }

      dygraph.setVisibility(i, !!legend.series[i].label.match(filterText))
    })

    this.setState({filterText})
  }

  private handleSortLegend = sortType => () => {
    this.setState({sortType, isAscending: !this.state.isAscending})
  }

  private highlightCallback = (e: MouseEvent) => {
    this.props.setActiveCell(this.props.cellID)
    this.setState({pageX: e.pageX})
    this.props.onShow(e)
  }

  private legendFormatter = legend => {
    if (!legend.x) {
      return ''
    }

    const {legend: prevLegend} = this.state
    const highlighted = legend.series.find(s => s.isHighlighted)
    const prevHighlighted = prevLegend.series.find(s => s.isHighlighted)

    const yVal = highlighted && highlighted.y
    const prevY = prevHighlighted && prevHighlighted.y

    if (legend.x === prevLegend.x && yVal === prevY) {
      return ''
    }

    this.setState({legend})
    return ''
  }

  private unhighlightCallback = e => {
    const {top, bottom, left, right} = this.legendRef.getBoundingClientRect()

    const mouseY = e.clientY
    const mouseX = e.clientX

    const mouseBuffer = 5
    const mouseInLegendY = mouseY <= bottom && mouseY >= top - mouseBuffer
    const mouseInLegendX = mouseX <= right && mouseX >= left
    const isMouseHoveringLegend = mouseInLegendY && mouseInLegendX

    if (!isMouseHoveringLegend) {
      this.handleHide()
    }
  }

  private get filtered(): SeriesLegendData[] {
    const {legend, sortType, isAscending, filterText} = this.state
    const withValues = legend.series.filter(s => !_.isNil(s.y))
    const sorted = _.sortBy(
      withValues,
      ({y, label}) => (sortType === 'numeric' ? y : label)
    )

    const ordered = isAscending ? sorted : sorted.reverse()
    return ordered.filter(s => s.label.match(filterText))
  }

  private get isAphaSort(): boolean {
    return this.state.sortType === 'alphabetic'
  }

  private get isNumSort(): boolean {
    return this.state.sortType === 'numeric'
  }

  private get isVisible(): boolean {
    const {cellID, activeCellID} = this.props

    return cellID === activeCellID
  }

  private get hidden(): string {
    if (this.isVisible) {
      return ''
    }

    return 'hidden'
  }

  private get styles() {
    const {
      dygraph: {graphDiv},
    } = this.props
    const {pageX} = this.state
    return makeLegendStyles(graphDiv, this.legendRef, pageX)
  }
}

const mapDispatchToProps = {
  setActiveCell: actions.setActiveCell,
}

const mapStateToProps = ({dashboardUI}) => ({
  activeCellID: dashboardUI.activeCellID,
})

export default connect(mapStateToProps, mapDispatchToProps)(DygraphLegend)
