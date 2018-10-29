const defaultMargin = {
	top: 20,
	right: 75,
	bottom: 45,
	left: 50
}

const defaultColors = ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f"];

class loadD3 {
	async init() {
		return new Promise((resolve, reject) => {
			$script('https://d3js.org/d3.v5.min.js', () => resolve());
		});
	}
}

class jsonData {
	constructor() {
		this.data = null;
	}

	getData() {

	}

	returnData() {

	}
}

class chartScale {

	getScale(data) {
		const xExtent = d3.extent(data, d => d[0]);
		const yExtent = d3.extent(data, d => d[1]);

		if( yExtent[0] > 0) {
			yExtent[0] = 0;
		}

		return {xExtent, yExtent};
	}
}

class tooltip {
	constructor() {

	}

	renderTooltip() {
		
	}
}

class renderChart extends loadD3 {
	
	//@param config -> object
	constructor(config) {
		super();
		this.data = config.data;
		this.container = config.container;
		this.margin = config.margin || defaultMargin;
		this.render();
	}

	async render() {

		if(!d3) {
			await super.init();
		}

		this.width = this.container.offsetWidth;
		this.height = this.width / 2;
		this.container.innerHTML = '';

		this.svg = d3.select(this.container).append('svg')
			.attr('width', this.width)
			.attr('height', this.height);

		this.axes = this.svg.append('g')
			.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
	}
}

export class lineChart extends renderChart {

	//@param config -> object
	constructor(config) {
		super(config);
		this.getScale();
		this.addAxes();
		this.drawLine();
	}

	getScale() {
		const m = this.margin;
		const xExtent = new chartScale().getScale(this.data).xExtent;
		const yExtent = new chartScale().getScale(this.data).yExtent;

		this.xScale = d3.scaleTime()
			.range([0, this.width - m.right])
			.domain(xExtent);
		this.yScale = d3.scaleLinear()
			.range([this.height - (m.top + m.bottom), 0])
			.domain(yExtent);
	}

	addAxes() {
		const m = this.margin;

		const xAxis = d3.axisBottom()
			.scale(this.xScale)
			.ticks(d3.timeMonth);

		const yAxis = d3.axisLeft()
			.scale(this.yScale)
			.tickFormat(d3.format("d"));

		this.axes.append('g')
			.attr('class', 'x-axis')
			.attr('transform', `translate(0, ${this.height - (m.top + m.bottom)})`)
			.call(xAxis);

		this.axes.append('g')
			.attr('class', 'y-axis')
			.call(yAxis);
	}

	drawLine() {
		const line  = d3.line()
			.x( d => this.xScale(d[0]))
			.y( d => this.yScale(d[1]));

		this.axes.append('path')
			.datum(this.data)
			.classed('line', true)
			.attr('d', line)
			.style('fill', 'none')
			.style('stroke', this.lineColor || '#000');
	}

	setColor(newColor) {
		this.axes.select('.line')
			.style('stroke', newColor);
		this.lineColor = newColor;
	}

	setData(newData) {
		this.data = newData;
		this.render();
	}
}

export class barChart extends renderChart {
	
	//@param config -> object
	constructor(config) {
		super(config);
		this.getScale();
		this.addAxes();
		this.drawBar();
	}

	getScale() {
		const m = this.margin;
		const yExtent = new chartScale().getScale(this.data).yExtent;

		this.xScale = d3.scaleBand()
			.rangeRound([0, this.width - m.right])
			.padding(0.1)
			.domain(this.data.map( d => d[0]));

		this.yScale = d3.scaleLinear()
			.rangeRound([this.height - (m.top + m.bottom), 0]) 
			.domain(yExtent);
	}

	addAxes() {
		const m = this.margin;

		const xAxis = d3.axisBottom()
			.scale(this.xScale)
			.ticks(d3.timeMonth);

		const yAxis = d3.axisLeft()
			.scale(this.yScale)
			.tickFormat(d3.format("d"));

		this.axes.append('g')
			.attr('class', 'x-axis')
			.attr('transform', `translate(0, ${this.height - (m.top + m.bottom)})`)
			.call(xAxis);

		this.axes.append('g')
			.attr('class', 'y-axis')
			.call(yAxis);
	}

	drawBar() {
		this.axes.append('g')
			.style('fill', 'steelblue')
			.selectAll('.bar')
			.data(this.data)
			.enter()
			.append('rect')
				.classed('bar', true)
				.attr('x', d => this.xScale(d[0]))
				.attr('y', d => this.yScale(d[1]))
				.attr('height', d => this.yScale(0) - this.yScale(d[1]))
				.attr('width', this.xScale.bandwidth());
	}
}

export class pieChart extends renderChart {
	
	//@param config -> object
	constructor(config) {
		super(config);
		this.width = this.width > 500 ? 500 : this.width;
		this.height = this.width;
		this.radius = Math.min(this.width, this.height) / 2;
		this.color = d3.scaleOrdinal(config.colors || defaultColors);
		this.setArc();
		this.drawPie();
		this.addLabels();
	}

	setArc() {
		this.arc = d3.arc()
			.innerRadius(0)
			.outerRadius(this.radius);
	}

	addLabels() {
		this.outerArc = d3.arc()
			.outerRadius(this.radius * 0.8)
			.innerRadius(this.radius * 0.8);

		this.axes.append('g')
			.selectAll('text')
			.data(this.pie(this.data))
			.enter()
			.append('text')
				.attr('dy', '.35em')
				.attr('transform', d => `translate(${this.outerArc.centroid(d)})`)
				.html( d => `${d.data[0]} - valeur: ${d.data[1]}`);
	}


	drawPie() {
		this.axes.attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);

		this.pie = d3.pie()
			.value( d => d[1] )
			.sort(null);

		this.axes.append('g')
			.selectAll('path')
			.data(this.pie(this.data))
			.enter()
			.append('path')
				.attr('fill', (d, i) => this.color(i))
				.attr('d', this.arc);
	}
}
