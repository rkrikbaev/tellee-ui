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

// function *flatEntries(map) {
//   for (let [k, v] of map) {
//     yield k;
//     yield v;
//   }
// }

export const timeSeriesToPxSeries = (raw = []) => {
  const isTable = true
  const {sortedLabels, sortedTimeSeries} = groupByTimeSeriesTransform(
    raw,
    isTable
  )

  const timeCorrectionGlitch = 21600000

  const regexEvent = /color:(.*?),icon:(.*?),text:(.*?)$/

  let labels = ['time', ...map(sortedLabels, ({label}) => label)]

  let _labels = labels // copy labels

  const tableData = map(sortedTimeSeries, ({time, values}) => [time, ...values])

  const timeSeries = {jsonflatten: []}

  const sliceArr = 0

  const eventsData = []
  const eventsConfig = {}

  tableData.slice(sliceArr).forEach(function(_value) {
    const map1 = {}
    _value.forEach(function(_row, _idx) {
      const currentLabel = labels[_idx]
      if (currentLabel.endsWith('.eventInfo') && _row !== null) {
        //
        _labels = _labels.filter(e => e !== currentLabel) // HAHAHA
        const parsedEvent = regexEvent.exec(_row)
        if (parsedEvent !== null) {
          const eventText = parsedEvent[3]
          eventsData.push({
            time: _value[0] + timeCorrectionGlitch,
            label: eventText,
          })
          eventsConfig[eventText] = {
            color: `${parsedEvent[1]}`,
            type: 'fa',
            icon: `${parsedEvent[2]}`,
            offset: [0, 0],
            lineWeight: 6,
            size: 24,
          }
        }
      } else if (currentLabel === 'time') {
        map1.timeStamp = _row + timeCorrectionGlitch // tempopary fix
      } else {
        if (_row === null) {
          _row = 0
        }
        map1[labels[_idx]] = _row
      }
    })
    timeSeries.jsonflatten.push(map1)
  })

  labels = _labels

  return {
    timeSeries,
    sortedLabels,
    tableData,
    labels,
    eventsData,
    eventsConfig,
  }
}

export const timeSeriesToPxKpi = (raw = []) => {
  const isTable = true
  const {sortedLabels, sortedTimeSeries} = groupByTimeSeriesTransform(
    raw,
    isTable
  )

  const labels = ['time', ...map(sortedLabels, ({label}) => label)]

  const tableData = map(sortedTimeSeries, ({time, values}) => [time, ...values])

  const timeSeries = {jsonflatten: []}

  let sliceArr = 0
  if (tableData.length > 30) {
    sliceArr = tableData.length - 30
  }

  tableData.slice(sliceArr).forEach(function(_value) {
    const map1 = {}
    map1.x = _value[0]
    let yval = _value[1]
    if (yval === null) {
      yval = 0
    }
    map1.y = yval
    timeSeries.jsonflatten.push(map1)
  })

  return {
    timeSeries,
    sortedLabels,
    tableData,
    labels,
  }
}
