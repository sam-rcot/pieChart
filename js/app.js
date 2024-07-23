import * as d3 from "d3";
import html2canvas from "html2canvas";

const chart = document.querySelector("#chart");
const width = 500;
const height = 500;
const margin = 50;
const radius = Math.min(width, height) / 2 - margin;
const innerRadius = radius * 0.9;

// chart.style.width = `${width}px`;
// chart.style.height = `${height}px`;

const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2})`);

const initialData = {a: 15, b: 85};
const colors = ["#003643", "white"];
const overlayColors = ["#43cfb5", "white"];

const pie = d3.pie().value(d => d[1]);

let dataReady = pie(Object.entries(initialData));

const arc = d3.arc().innerRadius(0).outerRadius(radius);
const overlayArc = d3.arc().innerRadius(0).outerRadius(innerRadius);

const paths = svg.selectAll('path')
  .data(dataReady)
  .enter()
  .append('path')
  .attr('d', arc)
  .attr('fill', (d, i) => colors[i])
  .attr("stroke", "white")
  .style("stroke-width", "2px")
  .style("opacity", 1);

const overlayPaths = svg.selectAll('path.overlay')
  .data(dataReady)
  .enter()
  .append('path')
  .attr('d', overlayArc)
  .attr('fill', (d, i) => overlayColors[i])
  .attr("stroke", "white")
  .style("stroke-width", "2px")
  .style("opacity", 1);

// Update the label and chart dynamically on input
document.getElementById('percentage').addEventListener('input', function () {
  const percentage = +this.value;
  updateChart(percentage);
});

document.getElementById('label').addEventListener('input', function () {
  const label = this.value;
  updateLabel(label);
});

document.getElementById('saveBtn').addEventListener('click', function (event) {
  event.preventDefault(); // Prevent the page from refreshing

  const label = document.getElementById('chart-label').innerText;
  const formattedLabel = label.toLowerCase().replace(/\s+/g, '_');

  html2canvas(document.querySelector('.container'), {
    useCORS: true,
    allowTaint: true,
    scale: 2 // Scale to get 150 DPI (2x scale for 300x300px output from 150x150px canvas)
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = `${formattedLabel}.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  });
});

function updateLabel(label) {
  const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
  document.getElementById('chart-label').innerText = capitalizedLabel;
}

function updateChart(percentage) {
  const updatedData = {a: percentage, b: 100 - percentage};
  dataReady = pie(Object.entries(updatedData));

  paths.data(dataReady)
    .attr('d', arc)
    .attr('fill', (d, i) => colors[i]);

  overlayPaths.data(dataReady)
    .attr('d', overlayArc)
    .attr('fill', (d, i) => overlayColors[i]);

  document.getElementById('percentageText').innerText = `${percentage}%`;
}
