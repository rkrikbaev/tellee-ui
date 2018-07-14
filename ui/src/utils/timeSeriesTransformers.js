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

export const timeSeriesToPxSeries = raw => {
  const isTable = true
  const {sortedLabels, sortedTimeSeries} = groupByTimeSeriesTransform(
    raw,
    isTable
  )

  const labels = ['time', ...map(sortedLabels, ({label}) => label)]

  const tableData = map(sortedTimeSeries, ({time, values}) => [time, ...values])
  // const timeSeries = tableData.length ? [labels, ...tableData] : [[]]

  const obj = {'jsonflatten': []}
  tableData.forEach(function(_value) {
    obj.jsonflatten.push({
     'timeStamp':_value[0], 'y0':_value[1], 'y1':_value[2]
    })
  })

  console.log(JSON.stringify(obj))
  const timeSeries = obj
  return {
    timeSeries,
    sortedLabels,
  }
}
