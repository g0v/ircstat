var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y/%m/%d").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.number); });

d3.select("body").append("div").text("speak frequency / date Chart");
var svg2 = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("g0v-count.json", function(error, data) {
  var valve = data[0];
  color.domain(data[0][1]);
  data.splice(0,1);
  data.forEach(function(d) {
    d.date = parseDate(d[0]);
  });
  var counts = color.domain().map(function(n,i) {
    return {
      name: n,
      values: data.map(function(d) {
        return {date: d.date, number: +d[1][i]};
      })
    };
  });
  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    d3.min(counts, function(c) { return d3.min(c.values, function(v) { return v.number; }); }),
    d3.max(counts, function(c) { return d3.max(c.values, function(v) { return v.number; }); })
  ]);

  svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg2.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Count");

  var count = svg2.selectAll(".count")
      .data(counts)
    .enter().append("g")
      .attr("class", "count");

  count.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

  count.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.number) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });
});

