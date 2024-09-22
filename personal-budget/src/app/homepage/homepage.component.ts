import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent implements AfterViewInit {
  private data: any = []

  private margin = { top: 10, right: 30, bottom: 30, left: 40 };
  private width = 450;
  private height = 450;
  private svg: any;
  private colors: any;
  private radius = Math.min(this.width, this.height) / 2 - this.margin.left;

  public dataSource: any = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
          '#ba68c8',
          '#81c784',
          '#64b5f6',
          '#ffb74d',
          '#4bc0c0',
          '#9966ff',
        ],
      },
    ],
    labels: [],
  };

  constructor(private http: HttpClient, private dataService: DataService) {}

  ngAfterViewInit(): void {
    this.dataService.getData().subscribe(
      (response) => {
        this.dataSource = response; 
        console.log(this.dataSource)
        this.createChart()
        for(var i =0;i<this.dataSource.labels.length;i++){
          var obj = {
            label : this.dataSource.labels[i],
            value: this.dataSource.datasets[0].data[i]
          }
          this.data.push(obj);
        }
        try {
          this.createSvg();
          this.createColors(this.data);
          this.drawChart();
        }
        catch (error) {

        }
      }
    );
  }

  createChart() {
    try {
      var ctx = <HTMLCanvasElement>document.getElementById('myChart');
      var pieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource,
      });
    } catch (error) {}
  }

  private createSvg(): void {
    this.svg = d3
      .select("#d3chart")
      .append("svg")
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.width / 2 + "," + this.height / 2 + ")"
      );
  }

  private createColors(data:any): void {
    let index = 0;
    const defaultColors = ['#ffcd56',
      '#ff6384',
      '#36a2eb',
      '#fd6b19',
      '#ba68c8',
      '#81c784',
      '#64b5f6',
      '#ffb74d',
      '#4bc0c0',
      '#9966ff'
  ]
    const colorsRange:any = [];
    this.data.forEach((element: any) => {
      if (element.color) colorsRange.push(element.color);
      else {
        colorsRange.push(defaultColors[index]);
        index++;
      }
    });
    this.colors = d3
      .scaleOrdinal()
      .domain(data.map((d:any) => d.value.toString()))
      .range(colorsRange);
  }

  private drawChart(): void {
    var pie = d3
      .pie()
      .sort(null)
      .value((d:any) => {
        return d.value;
      });
    var pieData = pie(<any>this.data);

    var arc = d3
      .arc()
      .innerRadius(this.radius * 0.5) 
      .outerRadius(this.radius * 0.8);

    var outerArc = d3
      .arc()
      .innerRadius(this.radius * 0.9)
      .outerRadius(this.radius * 0.9);

    this.svg
      .selectAll("allSlices")
      .data(pieData)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d:any) => this.colors(d.data.value))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    this.svg
      .selectAll("allPolylines")
      .data(pieData)
      .enter()
      .append("polyline")
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr("points", (d:any) => {
        var posA = arc.centroid(d); 
        var posB = outerArc.centroid(d);
        var posC = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; 
        posC[0] = this.radius * 0.95 * (midangle < Math.PI ? 1 : -1); 
        return [posA, posB, posC];
      });

    this.svg
      .selectAll("allLabels")
      .data(pieData)
      .enter()
      .append("text")
      .text((d:any) => {
        return d.data.label;
      })
      .attr("transform", (d:any) => {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = this.radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return "translate(" + pos + ")";
      })
      .style("text-anchor", (d:any) => {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? "start" : "end";
      });
  }
}
