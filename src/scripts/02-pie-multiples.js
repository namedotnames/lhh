import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const pie = d3.pie().value(function(d) {
  return d.minutes
})

const radius = 100

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

const colorScale = d3.scaleOrdinal().range(['#f6ddcc', '#bb8fce', '#d57f8d'])

// eslint-disable-next-line import/no-absolute-path
d3.csv(require('/data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  const nested = d3
    .nest()
    .key(d => d.project)
    .entries(datapoints)

  container
    .selectAll('svg')
    .data(nested)
    .enter()
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('transform', `translate(${width / 2},${height / 2})`)
    .each(function(d) {
      const svg = d3.select(this)
      svg
        .append('path')
        .data(pie(datapoints))
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.task))
    })
}
