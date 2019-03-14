import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {emptyGraphCopy} from 'src/shared/copy/cell'
import {bindActionCreators} from 'redux'

import AutoRefresh from 'shared/components/AutoRefresh'
import LineGraph from 'shared/components/LineGraph'
import SingleStat from 'shared/components/SingleStat'
import GaugeChart from 'shared/components/GaugeChart'
import TableGraph from 'shared/components/TableGraph'
import PxPercentCircle from 'shared/components/PxPercentCircle'
import PxTimeSeries from 'shared/components/PxTimeseries'
import PxKpi from 'shared/components/PxKpi'
import PxKpiList from 'shared/components/PxKpiList'
import PxGantt from 'shared/components/PxGantt'
import GIS from 'shared/components/Gis'
import PxRadar from 'shared/components/PxRadar'
import XYChart from 'shared/components/XYChart'
import PxMstat from 'shared/components/PxMstat'
import PxInbox from 'shared/components/PxInbox'
import PxGauge from 'shared/components/PxGauge'
import Pulse from 'shared/components/Pulse'

import {colorsStringSchema} from 'shared/schemas'
import {setHoverTime} from 'src/dashboards/actions'
import {
  DEFAULT_TIME_FORMAT,
  DEFAULT_DECIMAL_PLACES,
} from 'src/dashboards/constants'

const RefreshingLineGraph = AutoRefresh(LineGraph)
const RefreshingSingleStat = AutoRefresh(SingleStat)
const RefreshingGaugeChart = AutoRefresh(GaugeChart)
const RefreshingTableGraph = AutoRefresh(TableGraph)
const RefreshingPxPercentCircle = AutoRefresh(PxPercentCircle)
const RefreshingPxTimeseries = AutoRefresh(PxTimeSeries)
const RefreshingPxKpi = AutoRefresh(PxKpi)
const RefreshingPxKpiList = AutoRefresh(PxKpiList)
const RefreshingPxGantt = AutoRefresh(PxGantt)
const RefreshingGIS = AutoRefresh(GIS)
const RefreshingPxRadar = AutoRefresh(PxRadar)
const RefreshingXYChart = AutoRefresh(XYChart)
const RefreshingPxMstat = AutoRefresh(PxMstat)
const RefreshingPxInbox = AutoRefresh(PxInbox)
const RefreshingPxGauge = AutoRefresh(PxGauge)
const RefreshingPulse = AutoRefresh(Pulse)
const RefreshingGraph = ({
  axes,
  inView,
  type,
  colors,
  onZoom,
  cellID,
  queries,
  hoverTime,
  tableOptions,
  templates,
  timeRange,
  cellHeight,
  autoRefresh,
  fieldOptions,
  timeFormat,
  decimalPlaces,
  resizerTopHeight,
  staticLegend,
  manualRefresh, // when changed, re-mounts the component
  editQueryStatus,
  handleSetHoverTime,
  grabDataForDownload,
  isInCEO,
}) => {
  const prefix = (axes && axes.y.prefix) || ''
  const suffix = (axes && axes.y.suffix) || ''
  if (!queries.length) {
    return (
      <div className="graph-empty">
        <p data-test="data-explorer-no-results">{emptyGraphCopy}</p>
      </div>
    )
  }

  if (type === 'single-stat') {
    return (
      <RefreshingSingleStat
        type={type}
        colors={colors}
        key={manualRefresh}
        queries={[queries[0]]}
        templates={templates}
        autoRefresh={autoRefresh}
        cellHeight={cellHeight}
        editQueryStatus={editQueryStatus}
        prefix={prefix}
        suffix={suffix}
        inView={inView}
      />
    )
  }

  if (type === 'px-percent-circle') {
    return (
      <RefreshingPxPercentCircle
        type={type}
        colors={colors}
        key={manualRefresh}
        queries={[queries[0]]}
        templates={templates}
        autoRefresh={autoRefresh}
        cellHeight={cellHeight}
        resizerTopHeight={resizerTopHeight}
        editQueryStatus={editQueryStatus}
        cellID={cellID}
        prefix={prefix}
        suffix={suffix}
        inView={inView}
      />
    )
  }

  if (type === 'px-gauge') {
    return (
      <RefreshingPxGauge
        type={type}
        colors={colors}
        key={manualRefresh}
        queries={queries}
        templates={templates}
        autoRefresh={autoRefresh}
        cellHeight={cellHeight}
        resizerTopHeight={resizerTopHeight}
        editQueryStatus={editQueryStatus}
        cellID={cellID}
        prefix={prefix}
        suffix={suffix}
        inView={inView}
      />
    )
  }

  if (type === 'gauge') {
    return (
      <RefreshingGaugeChart
        type={type}
        colors={colors}
        key={manualRefresh}
        queries={[queries[0]]}
        templates={templates}
        autoRefresh={autoRefresh}
        cellHeight={cellHeight}
        resizerTopHeight={resizerTopHeight}
        editQueryStatus={editQueryStatus}
        cellID={cellID}
        prefix={prefix}
        suffix={suffix}
        inView={inView}
      />
    )
  }

  if (type === 'table') {
    return (
      <RefreshingTableGraph
        type={type}
        cellID={cellID}
        colors={colors}
        inView={inView}
        hoverTime={hoverTime}
        key={manualRefresh}
        queries={queries}
        templates={templates}
        autoRefresh={autoRefresh}
        cellHeight={cellHeight}
        tableOptions={tableOptions}
        fieldOptions={fieldOptions}
        timeFormat={timeFormat}
        decimalPlaces={decimalPlaces}
        editQueryStatus={editQueryStatus}
        resizerTopHeight={resizerTopHeight}
        grabDataForDownload={grabDataForDownload}
        handleSetHoverTime={handleSetHoverTime}
        isInCEO={isInCEO}
      />
    )
  }

  const displayOptions = {
    stepPlot: type === 'line-stepplot',
    stackedGraph: type === 'line-stacked',
  }

  if (type === 'px-timeseries') {
    return (
      <RefreshingPxTimeseries
        type={type}
        axes={axes}
        cellID={cellID}
        colors={colors}
        onZoom={onZoom}
        queries={queries}
        inView={inView}
        key={manualRefresh}
        templates={templates}
        timeRange={timeRange}
        autoRefresh={autoRefresh}
        isBarGraph={type === 'bar'}
        staticLegend={staticLegend}
        displayOptions={displayOptions}
        editQueryStatus={editQueryStatus}
        grabDataForDownload={grabDataForDownload}
        handleSetHoverTime={handleSetHoverTime}
        showSingleStat={type === 'line-plus-single-stat'}
      />
    )
  }
  if (type === 'px-kpi') {
    return (
      <RefreshingPxKpi
        type={type}
        axes={axes}
        cellID={cellID}
        colors={colors}
        onZoom={onZoom}
        queries={queries}
        inView={inView}
        key={manualRefresh}
        templates={templates}
        timeRange={timeRange}
        autoRefresh={autoRefresh}
        cellHeight={cellHeight}
        isBarGraph={type === 'bar'}
        staticLegend={staticLegend}
        displayOptions={displayOptions}
        editQueryStatus={editQueryStatus}
        grabDataForDownload={grabDataForDownload}
        handleSetHoverTime={handleSetHoverTime}
        showSingleStat={type === 'line-plus-single-stat'}
      />
    )
  }
  if (type === 'px-kpi-list') {
    return (
      <RefreshingPxKpiList
        type={type}
        axes={axes}
        cellID={cellID}
        colors={colors}
        onZoom={onZoom}
        queries={queries}
        inView={inView}
        key={manualRefresh}
        templates={templates}
        timeRange={timeRange}
        autoRefresh={autoRefresh}
        cellHeight={cellHeight}
        isBarGraph={type === 'bar'}
        staticLegend={staticLegend}
        displayOptions={displayOptions}
        editQueryStatus={editQueryStatus}
        grabDataForDownload={grabDataForDownload}
        handleSetHoverTime={handleSetHoverTime}
        showSingleStat={type === 'line-plus-single-stat'}
      />
    )
  }
  if (type === 'px-gantt') {
    return (
      <RefreshingPxGantt
        type={type}
        axes={axes}
        cellID={cellID}
        colors={colors}
        onZoom={onZoom}
        queries={queries}
        inView={inView}
        key={manualRefresh}
        templates={templates}
        timeRange={timeRange}
        autoRefresh={autoRefresh}
        cellHeight={cellHeight}
        isBarGraph={type === 'bar'}
        staticLegend={staticLegend}
        displayOptions={displayOptions}
        editQueryStatus={editQueryStatus}
        grabDataForDownload={grabDataForDownload}
        handleSetHoverTime={handleSetHoverTime}
        showSingleStat={type === 'line-plus-single-stat'}
      />
    )
  }
  if (type === 'Gis') {
    return (
      <RefreshingGIS
        type={type}
        axes={axes}
        cellID={cellID}
        colors={colors}
        onZoom={onZoom}
        queries={queries}
        inView={inView}
        key={manualRefresh}
        templates={templates}
        timeRange={timeRange}
        autoRefresh={autoRefresh}
        cellHeight={cellHeight}
        isBarGraph={type === 'bar'}
        staticLegend={staticLegend}
        displayOptions={displayOptions}
        editQueryStatus={editQueryStatus}
        grabDataForDownload={grabDataForDownload}
        handleSetHoverTime={handleSetHoverTime}
        showSingleStat={type === 'line-plus-single-stat'}
      />
    )
  }
  if (type === 'pulse') {
    return (
      <RefreshingPulse
        type={type}
        axes={axes}
        cellID={cellID}
        colors={colors}
        onZoom={onZoom}
        queries={queries}
        inView={inView}
        key={manualRefresh}
        templates={templates}
        timeRange={timeRange}
        autoRefresh={autoRefresh}
        cellHeight={cellHeight}
        isBarGraph={type === 'bar'}
        staticLegend={staticLegend}
        displayOptions={displayOptions}
        editQueryStatus={editQueryStatus}
        grabDataForDownload={grabDataForDownload}
        handleSetHoverTime={handleSetHoverTime}
        showSingleStat={type === 'line-plus-single-stat'}
      />
    )
  }
  if (type === 'px-inbox') {
    return (
      <RefreshingPxInbox
        type={type}
        axes={axes}
        cellID={cellID}
        colors={colors}
        onZoom={onZoom}
        queries={queries}
        inView={inView}
        key={manualRefresh}
        templates={templates}
        timeRange={timeRange}
        autoRefresh={autoRefresh}
        cellHeight={cellHeight}
        isBarGraph={type === 'bar'}
        staticLegend={staticLegend}
        displayOptions={displayOptions}
        editQueryStatus={editQueryStatus}
        grabDataForDownload={grabDataForDownload}
        handleSetHoverTime={handleSetHoverTime}
        showSingleStat={type === 'line-plus-single-stat'}
      />
    )
  }
  if (type === 'px-mstat') {
    return (
      <RefreshingPxMstat
        type={type}
        axes={axes}
        cellID={cellID}
        colors={colors}
        onZoom={onZoom}
        queries={queries}
        inView={inView}
        key={manualRefresh}
        templates={templates}
        timeRange={timeRange}
        autoRefresh={autoRefresh}
        cellHeight={cellHeight}
        isBarGraph={type === 'bar'}
        staticLegend={staticLegend}
        displayOptions={displayOptions}
        editQueryStatus={editQueryStatus}
        grabDataForDownload={grabDataForDownload}
        handleSetHoverTime={handleSetHoverTime}
        showSingleStat={type === 'line-plus-single-stat'}
      />
    )
  }
  if (type === 'px-radar') {
    return (
      <RefreshingPxRadar
        type={type}
        axes={axes}
        cellID={cellID}
        colors={colors}
        onZoom={onZoom}
        queries={queries}
        inView={inView}
        key={manualRefresh}
        templates={templates}
        timeRange={timeRange}
        autoRefresh={autoRefresh}
        cellHeight={cellHeight}
        isBarGraph={type === 'bar'}
        staticLegend={staticLegend}
        displayOptions={displayOptions}
        editQueryStatus={editQueryStatus}
        grabDataForDownload={grabDataForDownload}
        handleSetHoverTime={handleSetHoverTime}
        showSingleStat={type === 'line-plus-single-stat'}
      />
    )
  }
  if (type === 'xy-chart') {
    return (
      <RefreshingXYChart
        type={type}
        axes={axes}
        cellID={cellID}
        colors={colors}
        onZoom={onZoom}
        queries={queries}
        inView={inView}
        key={manualRefresh}
        templates={templates}
        timeRange={timeRange}
        autoRefresh={autoRefresh}
        cellHeight={cellHeight}
        isBarGraph={type === 'bar'}
        staticLegend={staticLegend}
        displayOptions={displayOptions}
        editQueryStatus={editQueryStatus}
        grabDataForDownload={grabDataForDownload}
        handleSetHoverTime={handleSetHoverTime}
        showSingleStat={type === 'line-plus-single-stat'}
      />
    )
  }
  return (
    <RefreshingLineGraph
      type={type}
      axes={axes}
      cellID={cellID}
      colors={colors}
      onZoom={onZoom}
      queries={queries}
      inView={inView}
      key={manualRefresh}
      templates={templates}
      timeRange={timeRange}
      autoRefresh={autoRefresh}
      isBarGraph={type === 'bar'}
      staticLegend={staticLegend}
      displayOptions={displayOptions}
      editQueryStatus={editQueryStatus}
      grabDataForDownload={grabDataForDownload}
      handleSetHoverTime={handleSetHoverTime}
      showSingleStat={type === 'line-plus-single-stat'}
    />
  )
}

const {arrayOf, bool, func, number, shape, string} = PropTypes

RefreshingGraph.propTypes = {
  timeRange: shape({
    lower: string.isRequired,
  }),
  autoRefresh: number.isRequired,
  manualRefresh: number,
  templates: arrayOf(shape()),
  type: string.isRequired,
  cellHeight: number,
  resizerTopHeight: number,
  axes: shape(),
  queries: arrayOf(shape()).isRequired,
  editQueryStatus: func,
  staticLegend: bool,
  onZoom: func,
  grabDataForDownload: func,
  colors: colorsStringSchema,
  cellID: string,
  inView: bool,
  tableOptions: shape({
    verticalTimeAxis: bool.isRequired,
    sortBy: shape({
      internalName: string.isRequired,
      displayName: string.isRequired,
      visible: bool.isRequired,
    }).isRequired,
    wrapping: string.isRequired,
    fixFirstColumn: bool.isRequired,
  }),
  fieldOptions: arrayOf(
    shape({
      internalName: string.isRequired,
      displayName: string.isRequired,
      visible: bool.isRequired,
    }).isRequired
  ),
  timeFormat: string.isRequired,
  decimalPlaces: shape({
    isEnforced: bool.isRequired,
    digits: number.isRequired,
  }).isRequired,
  hoverTime: string.isRequired,
  handleSetHoverTime: func.isRequired,
  isInCEO: bool,
}

RefreshingGraph.defaultProps = {
  manualRefresh: 0,
  staticLegend: false,
  inView: true,
  timeFormat: DEFAULT_TIME_FORMAT,
  decimalPlaces: DEFAULT_DECIMAL_PLACES,
}

const mapStateToProps = ({dashboardUI, annotations: {mode}}) => ({
  mode,
  hoverTime: dashboardUI.hoverTime,
})

const mapDispatchToProps = dispatch => ({
  handleSetHoverTime: bindActionCreators(setHoverTime, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RefreshingGraph)
