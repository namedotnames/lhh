import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
const month = datapoints.map(d => d.month_name)
const angleScale = d3
  .scaleBand()
  .domain(month)
  .range([0, Math.PI * 2])
const radius = 150
const radiusScale = d3
  .scaleLinear()
  .domain([0, 75])
  .range([0, radius])
const line = d3
  .radialLine()
  .angle(d => angleScale(d.month))
  .radius(d => radiusScale(d.high))

d3.csv(require('/data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])

  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'blue')
    .attr('stroke', 'blue')

  svg
    .append('circle')
    .attr('r', 3)
    .attr('cx', 0)
    .attr('cy', 0)
  const bands = [30, 50, 70, 90]
  svg
    .selectAll('.band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')
    .attr('r', function(d) {
      console.log(d)
      return radiusScale(d)
    })
    .lower()

  svg
    .selectAll('.label')
    .data(bands)
    .enter()
    .append('text')
    .text(d => d)
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')

  // Draw one line for every category that this scale knows about
  svg
    .selectAll('.radius-line')
    .data(angleScale.domain())
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', -radius)
    .attr('stroke', 'black')
    // .style/css knows about radians
    // .style('transform', function(d) {
    //   console.log(d, angleScale(d))
    //   return `rotate(${angleScale(d)}rad)`
    // })
    // for .attr you need to convert to degrees
    .attr('transform', function(d) {
      return `rotate(${(angleScale(d) * 180) / Math.PI})`
    })

  // Add one text element for every category
  // that our angleScale knows about
  // we aren't using .data(months) because
  // we want to be able to cut and paste
  svg
    .selectAll('.outside-label')
    .data(angleScale.domain())
    .enter()
    .append('text')
    .text(d => d)
    // .attr('y', -radius) // set it up at the top of the chart
    // .attr('dy', -10) // give a little offset to push it higher
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
