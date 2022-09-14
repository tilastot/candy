// https://observablehq.com/@dorrietang/candy-diagram-mapping-candies-to-features@617
function _1(md){return(
md`# Candy Diagram: Mapping Candies to Features`
)}

function _2(md){return(
md `### ew2575, dt2556, rz2345`
)}

function _3(md){return(
md `In our interactive below, we worked with candy data from FiveThirtyEight. During exploratory data analysis, we found that the ranking and "win-rate", or the percentage that surveyed individuals liked these cnadies, had a linear relationship. Therefore, the candies, listed on the left, are displayed in this order. The goal of our visualization was to discover and visualize the candy characteristics that are shared by the most popular candies. We decided to use a modified, linearly spaced dendrogram to show the relationship between candy ranks and characteristics. Upon mousing over specific characterstics, one can perceive the corresponding candies that exhibit the trait; the clustered and highlighted curves give the user a sense of proportion of candies that fall under each category, as well as a sense of where these candies rank in terms of individual preferences. 

Most of our challenges came from working with d3, being unfamiliar with the language. Our first barrier was the re-processing of our data to fit within the form of a d3 Graph object. In addition, we had to write custom lambda functions in order to incorporate new variables from our data. We also struggled with how much information we wanted to show upon initial view of the visualization. Originally, we wanted to incorporate bar graphs that showed and compared sugar percentage of all candies. However, this proved to be too cluttered given the 85 candies that we already displayed. We decided to show these characteristics via mouseover on specific candies and candy traits. 

In user testing, we learned the following. First, we understood that it was originally hard to perceive the text correlated to each highlighted line. To address this issue, we bolded and increased the font size of the candy or the trait being moused over, emphasizing the specific mouseover text as well as any connected nodes. If we had another week, we would like to have added a dropdown menu that would allow the list of candies to be sorted in different ways (such as by sugar content), as well as filters for characteristics so that users can view a subset of desired candies.

Work was split evenly amongst team members. We all contributed to brainstorming, coding, and data preprocessing.

Resources that helped us along the way: FiveThirtyEight original candy article, d3 documentations, other Observable notebooks (in specific, dendrogram and tree diagrams, as well as an arc diagram.
https://observablehq.com/@d3/arc-diagram
https://observablehq.com/@youmikoh/dota-2-pro-circuit-connectivity

Original design (arc diagram): https://observablehq.com/@erickawu/candy-diagram-mapping-candies-to-features
Our original design of the arc diagram was iterated on in the follwing manner: because there were only two categories, we decided to take the two groups and place them on left and right sides of the page for better navigation.`
)}

function _chart(d3,DOM,width,height,graph,source_list,margin,y,color,curve,step)
{
  const svg = d3.select(DOM.svg(width, height))
  .style("font-family", "'Helvetica Neue', Helvetica, Arial sans-serif");

  svg.append("style").text(`

    .hover path {
      stroke: grey;
    }

    .hover text {
      fill: black;
    }

    .hover g.primary text {
      fill: black;
      font-weight: 500;
      font-size: 15px;
    }

    .hover g.secondary text {
      fill: black;
      font-weight: 350;
    }

    .hover path.primary {
      stroke: orange;
      stroke-width: 1.7;
      stroke-opacity: 0.7;
    }

    `);

  const label = svg.append("g")
      .attr("font-size", 12)
      .attr("font-weight", 300)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(graph.nodes)
    .join("g")
      .attr("transform", d => `translate(${source_list.has(d.id) ? margin.left+600 : margin.left+100},${source_list.has(d.id) ? d.y = y(d.id) * 4 - 4450 : d.y = y(d.id)})`)
      .call(g => g.append("text")
          .attr("x", d => source_list.has(d.id) ? margin.left - 94 : margin.left - 106)
          .attr("text-anchor", d=> source_list.has(d.id)? "start" : "end")
          .attr("dy", "0.35em")
          .attr("fill", d => d3.lab(color(d.group)).darker(2))
          .text(d => d.id))
      .call(g => g.append("circle")
          .attr("r", 3)
          .attr("fill", d => color(d.group)));

  const path = svg.insert("g", "*")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 0.6)
    .selectAll("path")
    .data(graph.links)
    .join("path")
      .attr("stroke", d => d.source.group === d.target.group ? color(d.source.group) : "grey")
      .attr("d", curve);
  let highlight = svg.append("g")
    .attr("x", margin.left + 4000)
    .attr("y", 2000)
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#333")
    .attr("fill-opacity", 0.8)
    .style("font-size", "4vw")
    .style("font-weight", 700);
  let alias = highlight
     .append("text")
    .attr("x", margin.left + 120)
    .attr("y", 380)
    .attr("dy", "-0.3em");
  
  let rank_avg = highlight
    .append("text")
    .attr("x", margin.left + 120)
    .attr("y", 380)
    .attr("dy", "0.5em")
    .attr("fill-opacity", 0.6)
    .style("font-size", "2.5vw")
    .style("font-weight", 500);
  let sugar_connect = highlight
    .append("text")
    .attr("x", margin.left + 120)
    .attr("y", 380)
    .attr("dy", "1.4em")
    .style("font-size", "3vw")
    .style("font-weight", 600);
  let price = highlight
    .append("text")
    .attr("dy", "1.7em")
    .style("font-size", "3vw")
    .style("font-weight", 600);
  const overlay = svg.append("g")
      .attr("fill", "none")
      .attr("pointer-events", "all")
    .selectAll("rect")
    .data(graph.nodes)
    .join("rect")
      .attr("width", d => source_list.has(d.id) ? 100: margin.left + 60)
      .attr("height", step)
      .attr("y", d => source_list.has(d.id) ? d.y =  y(d.id) * 4 -4450 - step/2 : d.y = y(d.id) - step/2)
      .attr("x", d => source_list.has(d.id) ? margin.left+600 : margin.left - 50)
      .on("mouseover", d => { 
        svg.classed("hover", true);
        label.classed("primary", n => n === d);
        label.classed("secondary", n => n.sourceLinks.some(l => l.target === d) || n.targetLinks.some(l => l.source === d));
        path.classed("primary", l => l.source === d || l.target === d).filter(".primary").raise();
        if(source_list.has(d.id)){
          alias.text(d.id)
          rank_avg.text(d.avg + " average rank")
          sugar_connect.text(d.count + " connections")
        } else{
          alias.text(d.id)
          rank_avg.text("rank: " + d.rank)
          sugar_connect.text(Number((parseFloat(d.sugarpercent) * 100).toFixed(2)) + "% sugar")
        }
      })
      .on("mouseout", d => {
        svg.classed("hover", false);
        label.classed("primary", false);
        label.classed("secondary", false);
        path.classed("primary", false).order();
        alias.text("")
        rank_avg.text("")
        sugar_connect.text("")
      });

  return svg.node();
}


function _curve(margin){return(
function curve(d) {
  const y1 = d.source.y;
  const y2 = d.target.y;
  return `M${margin.left + 600},${y1}
          C${margin.left + 400},${y1}
          ${margin.left + 300},${y2}
          ${margin.left + 100},${y2}`;
}
)}

function _y(d3,graph,margin,height){return(
d3.scalePoint(graph.nodes.sort((a,b) => d3.ascending(+a.rank, +b.rank)).map(d => d.id), [margin.top, height - margin.bottom])
)}

function _margin(){return(
{top: 20, right: 20, bottom: 20, left: 100}
)}

function _height(data,step,margin){return(
(data.nodes.length - 1) * step + margin.top + margin.bottom
)}

function _step(){return(
14
)}

function _color(d3,graph){return(
d3.scaleOrdinal(graph.nodes.map(d => d.group).sort(d3.ascending), ["black", "orange"])
)}

function _graph(data,source_list)
{
  const nodes = data.nodes.map(({id, group, sugarpercent, rank, avg, count}) => ({
    id,
    sourceLinks: [],
    targetLinks: [],
    group,
    rank,
    sugarpercent,
    avg,
    count
  }));

  const nodeById = new Map(nodes.map(d => [d.id, d]));

  const links = data.links.map(({source, target, value}) => ({
    source: nodeById.get(source),
    target: nodeById.get(target),
    value
  }));
  
  for (const link of links) {
    const {source, target, value} = link;
    source.sourceLinks.push(link);
    target.targetLinks.push(link);
    source_list.add(link.source.id)
  }

  return {nodes, links};
}


function _12(source_list){return(
source_list
)}

function _source_list(){return(
new Set()
)}

function _data(d3){return(
d3.json("https://raw.githubusercontent.com/erickawu/candydata/master/data_dv4%20(2).json")
)}

function _d3(require){return(
require("d3@5")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("chart")).define("chart", ["d3","DOM","width","height","graph","source_list","margin","y","color","curve","step"], _chart);
  main.variable(observer("curve")).define("curve", ["margin"], _curve);
  main.variable(observer("y")).define("y", ["d3","graph","margin","height"], _y);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("height")).define("height", ["data","step","margin"], _height);
  main.variable(observer("step")).define("step", _step);
  main.variable(observer("color")).define("color", ["d3","graph"], _color);
  main.variable(observer("graph")).define("graph", ["data","source_list"], _graph);
  main.variable(observer()).define(["source_list"], _12);
  main.variable(observer("source_list")).define("source_list", _source_list);
  main.variable(observer("data")).define("data", ["d3"], _data);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
