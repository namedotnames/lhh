import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }

const height = 400 - margin.top - margin.bottom

const width = 780 - margin.left - margin.right

// At the very least you'll need scales, and

// you'll need to read in the file. And you'll need

// and svg, too, probably.

const svg = d3

  .select('#chart-1')

  .append('svg')

  .attr('height', height + margin.top + margin.bottom)

  .attr('width', width + margin.left + margin.right)

  .append('g')

  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  .attr('transform', `translate(${width / 2},${height / 2})`)

const pie = d3.pie().value(function(d) {
  return d.minutes
})

const radius = 100

const arc = d3

  .arc()

  .innerRadius(0)

  .outerRadius(radius)

const colorScale = d3.scaleOrdinal().range(['#f6ddcc', '#bb8fce', '#d57f8d'])

const angleScale = d3

  .scaleBand()

  .range([0, Math.PI * 2])

d3.csv(require('/data/time-breakdown.csv'))

  .then(ready)

  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  console.log(pie(datapoints))

  svg

    .selectAll('path')

    .data(pie(datapoints))

    .enter()

    .append('path')

    .attr('d', d => arc(d))

    .attr('fill', d => colorScale(d.data.task))

  const tasks = datapoints.map(d => d.task)
  svg

    .selectAll('.outside-label')

    .data(angleScale.domain(tasks))

    .enter()

    .append('text')

    .text(d => d)
    .attr('y', -radius)
    .attr('text-anchor', 'middle')

    .attr('alignment-baseline', 'middle')

    .attr('x', function(d) {
      const a = angleScale(d)

      const r = radius + 10

      return r * Math.sin(a)
    })

    .attr('y', function(d) {
      const a = angleScale(d)

      const r = radius + 10

      return r * Math.cos(a) * -1
    })
}
