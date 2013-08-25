var diameter = 960,
    format = d3.format(",d"),
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

d3.select("#container").append("div").text("發言量圖");
var svg = d3.select("#container").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

d3.csv("active.csv", function(error, root) {
  var node = svg.selectAll(".node")
      .data(bubble.nodes({children: root}))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
      .text(function(d) { return d.className + ": " + format(d.value); });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
 /*     .style("fill", "none")
      .style("stroke-width", function(d) { return parseInt(d.r/4); })*/
      .style("fill", function(d) { return d.className?color(d.className):"none"; });

  node.append("text")
      .attr("dy", ".3em")
      .attr("font-size", function(d) { return d.r/4+"px";})
      .attr("font-family", "century gothic")
      .style("text-anchor", "middle")
      .text(function(d) { return (d.className || "").substring(0, d.r / 3); })
      .style("display", function(d) {
        return (d.r<12)?"none":"block";
      });
});

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}

d3.select(self.frameElement).style("height", diameter + "px");
