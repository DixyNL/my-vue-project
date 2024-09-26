<template>
  <div class="displayBox">
    <p>Node name: {{ selectedObj.name }}</p>
    <p>Node description: {{ selectedObj.description }}</p>
    <p>Node parent: {{ selectedObj.parent }}</p>
    <button @click="clearObject">X</button>
  </div>
  <button @click="getBiggerGraph">Get bigger Graph data</button>
  <div class="tree-chart">
    <svg ref="tree"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";

const apiRoute = process.env.API_PORT || 3000;
const host = 'http://localhost';

export default {
  name: "TreeChart",
  data() {
    return {
      chartData: [],
      selectedObj: {},
    };
  },
  mounted() {
    this.getGraph();
  },
  methods: {
    getGraph() {
      fetch(`${host}:${apiRoute}/api/data`)
        .then(response => response.json())
        .then(data => {
          this.chartData = data.data;
          this.reloadTree();
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },

    getBiggerGraph() {
      fetch(`${host}:${apiRoute}/api/data/big`)
        .then(response => response.json())
        .then(data => {
          this.chartData = data.data;
          this.reloadTree();
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },

    reloadTree(){
      this.clearTree();
      this.drawTree();
    },
    clearTree() {
      d3.select(this.$refs.tree).selectAll("*").remove();
    },
    selectNode(object, event) {
      this.selectedObj = object;

      d3.selectAll(".node rect")
        .classed("selected", false)
        .attr("stroke-width", 2);

      const selectedRect = d3.select(event.target);
      selectedRect.classed("selected", true)
        .attr("stroke-width", 5);

      console.log("Selected Node:", this.chartData);
    },
    clearObject() {
      this.selectedObj = {};
      d3.selectAll(".node rect").classed("selected", false).attr("stroke-width", 2);
      console.log("Selected Node:", this.chartData);

    },
    drawTree() {
      const data = this.chartData;
      const width = 1200;
      const height = 1200;
      const margin = { top: 20, right: 90, bottom: 30, left: 90 };

      const svg = d3
        .select(this.$refs.tree)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const root = d3
        .stratify()
        .id((nodeData) => nodeData.name)
        .parentId((nodeData) => (nodeData.parent === "" ? null : nodeData.parent))(data);

      const treeLayout = d3.tree().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);
      const treeData = treeLayout(root);

      svg
        .selectAll(".link")
        .data(treeData.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2)
        .attr("d", d3.linkHorizontal().x((nodeData) => nodeData.y).y((nodeData) => nodeData.x));

      const node = svg
        .selectAll(".node")
        .data(treeData.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (nodeData) => `translate(${nodeData.y},${nodeData.x})`)
        .on("click", (event, nodeData) => this.selectNode(nodeData.data, event));

      const rectWidth = 120;
      const rectHeight = 50;

      node
        .append("rect")
        .attr("width", rectWidth)
        .attr("height", rectHeight)
        .attr("x", -(rectWidth / 2))
        .attr("y", -(rectHeight / 2))
        .attr("fill", (nodeData) => (nodeData.children ? "#a16a33" : "#42b983"))
        .attr("stroke", "#333")
        .attr("stroke-width", 2)
        .on("mouseover", function () {
          d3.select(this).attr("fill", (nodeData) => (nodeData.children ? "#8a5828" : "#388f6c"));
        })
        .on("mouseout", function () {
          d3.select(this).attr("fill", (nodeData) => (nodeData.children ? "#a16a33" : "#42b983"));
        });

      node
        .append("text")
        .attr("dy", ".35em")
        .attr("x", (nodeData) => (nodeData.children ? -10 : 10))
        .style("text-anchor", (nodeData) => (nodeData.children ? "end" : "start"))
        .text((nodeData) => nodeData.data.name);
    },
  }
};
</script>


<style scoped>
.displayBox {
  border: 2px solid #42b983;
  padding: 10px;
  margin: 20px;
  border-radius: 5px;
  background-color: #f9f9f9;
  text-align: left;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.displayBox p {
  margin: 5px 0;
}

.selected {
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
}
</style>
