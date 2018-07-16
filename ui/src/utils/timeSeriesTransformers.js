import {map, reduce} from 'fast.js'
import {groupByTimeSeriesTransform} from 'src/utils/groupByTimeSeriesTransform'

export const timeSeriesToDygraph = (raw = [], isInDataExplorer) => {
  const isTable = false
  const {sortedLabels, sortedTimeSeries} = groupByTimeSeriesTransform(
    raw,
    isTable
  )

  const dygraphSeries = reduce(
    sortedLabels,
    (acc, {label, responseIndex}) => {
      if (!isInDataExplorer) {
        acc[label] = {
          axis: responseIndex === 0 ? 'y' : 'y2',
        }
      }
      return acc
    },
    {}
  )

  return {
    labels: ['time', ...map(sortedLabels, ({label}) => label)],
    timeSeries: map(sortedTimeSeries, ({time, values}) => [
      new Date(time),
      ...values,
    ]),
    dygraphSeries,
  }
}

export const timeSeriesToTableGraph = raw => {
  const isTable = true
  const {sortedLabels, sortedTimeSeries} = groupByTimeSeriesTransform(
    raw,
    isTable
  )

  const labels = ['time', ...map(sortedLabels, ({label}) => label)]

  const tableData = map(sortedTimeSeries, ({time, values}) => [time, ...values])
  const data = tableData.length ? [labels, ...tableData] : [[]]
  return {
    data,
    sortedLabels,
  }
}

export const timeSeriesToPxSeries = (raw = [], limitOutputForKpi) => {
  const isTable = true
  const {sortedLabels, sortedTimeSeries} = groupByTimeSeriesTransform(
    raw,
    isTable
  )

  const labels = ['time', ...map(sortedLabels, ({label}) => label)]

  const tableData = map(sortedTimeSeries, ({time, values}) => [time, ...values])

  const timeSeries = {jsonflatten: []}

  let sliceArr = 0
  if (limitOutputForKpi) {sliceArr = tableData.length-30} // get max last 30 records for KPI

  tableData.slice(sliceArr).forEach(function(_value) {
    const map1 = {}
    if (limitOutputForKpi) {
      map1['x'] = _value[0]
      map1['y'] = _value[1]
    } else {
      _value.forEach(function(_row, _idx) {
        if (labels[_idx] === 'time') {
          map1['timeStamp'] = _row
        }
        else {
          if (_row === null) {
            _row = 0
          }
          map1[labels[_idx]] = _row
        }
      })
    }
    timeSeries.jsonflatten.push(map1)
  })

  return {
    timeSeries,
    sortedLabels,
    tableData,
    labels,
  }
}
