const defaultOptions = {
	width: 256,
	height: 256,
	projection: '',
	polygon: '',
	cX: 2.5,
	cY: 46,
	scale: 1300,
	colors1: ['#f5f5fd', '#dddeec', '#bebfd8', '#9c9cc1', '#7e7fae', '#64659c'],
	colors2: ['#defbf7', '#6cefd9', '#5cedd5', '#00d7b5', '#025344'],
}

class chloropeth {


	//@param {hasLinks -> bool}
	constructor(hasLinks) {
		this.svg = null;
		this.container = null;
		this.svg = null;
		this.path = null;
		this.addLinks = !hasLinks ? false : hasLinks;
		this.geojson = null;
		this.highColor = null;
		this.lowColor = null;
		this.width = null;
	}

	//@param {element -> htmlElement}
	//@param {id -> string}
	async init(element, id, mapScale) {
		return new Promise((resolve, reject) => {
			$script('https://d3js.org/d3.v5.min.js', () => {

				this.width = document.querySelector(element).clientWidth;
				this.container = element;

				let	height = this.width,
					scale = this.width < 400 ? defaultOptions.scale : mapScale;

				let projection = d3.geoConicConformal()
									.center([2.454071, 46.279229])
									.scale(scale)
									.translate([this.width / 2, height / 2]);

				this.path = d3.geoPath().projection(projection);

				this.svg = d3.select(element).append('svg')
							.attr('id', id)
							.attr('class', 'd3-map-projection')
							.attr('width', this.width)
							.attr('height', height);

				resolve();
			});
		});
	}

	//@param {jsonPath -> url || json}
	renderBackground(jsonPath) {

		let svg = this.svg;
		let path = this.path;

		let countries = d3.json(jsonPath).then(function(geojson) {
			
			svg.selectAll('.map-countries')
					.data(geojson.features)
					.enter()
					.append('path')
					.attr('class', 'map-countries')
					.attr('d', path);
		});
	}

	//@param {jsonPath -> url || json}
	//@param {color -> colorHex}
	render(jsonPath, color) {

		let svg = this.svg;
		let path = this.path;
		let addLink = this.addLinks;
		let addTip = this.addTip;

		const regions = d3.json(jsonPath).then((geojson) => {

			this.geojson = geojson;

			svg.selectAll('.map-regions')
					.data(geojson.features)
					.enter()
					.append('path')
					.attr('class', 'map-regions')
					.attr('fill', color)
					.attr('d', path);

			if(addLink) {
				svg.selectAll('.map-regions')
					.data(geojson.features)
					.attr('data-href', (d) => d.properties.nom.toLowerCase())
					.on('click', (d) => {
						let url = 'top' + d.properties.nom.toLowerCase();
						window.location = url;
					});
			}

			this.addTooltip("#29225c");
		});
	}

	renderGradient(valueJson, jsonPath) {

		let svg = this.svg;
		let path = this.path;
		this.lowColor = '#bebfd8';
		this.highColor = '#64659c';

		//First process data json
		d3.json('../assets/js/datas/dataByRegions.json').then((data) => {

			let valueArray = [];

			for(let d = 0; d < data.length; d++) {
				valueArray.push(data[d].value);
			}

			const maxValue = d3.max(valueArray);

			let ramp = d3.scaleLinear()
							.domain([0, d3.max(valueArray)])
							.range([this.lowColor, this.highColor]);

			//Load geojson and merge value with state data
			d3.json('../assets/js/datas/regions.json').then((geojson) => {

				//Loop through each state value
				for(let j = 0; j < data.length; j++) {

					let dataName = data[j].nom,
						dataValue = data[j].value;

					for(let i = 0; i < geojson.features.length; i++) {
						let geoName = geojson.features[i].properties.nom;

						if(dataName === geoName) {
							geojson.features[i].properties.value = dataValue; //Copy data into geojson
							break; //stop looking through geojson
						}
					};
				}

				this.geojson = geojson;

				svg.selectAll('.map-regions')
						.data(geojson.features)
						.enter()
						.append('path')
						.attr('class', 'map-regions')
						.attr('fill', (d) => {
							return ramp(d.properties.value);
						})
						.attr('d', path)
						.style('cursor', 'pointer');

				this.addTooltip('#fff');
			});

			if(window.matchMedia("(max-width: 991px)").matches) {

				let options = {
					container: {
						width: '100%',
						height: 50
					},
					defs: {
						x1: '0%',
						y1: '100%',
						x2: '100%',
						y2: '100%'
					},
					stops: {
						high: this.highColor,
						low: this.lowColor
					},
					rect: {
						width: '100%',
						height: 10,
						transform: 'translate(0, 30)'
					},
					scaleDomain: [0, this.width],
					scaleRange: [0, maxValue],
					direction: 'horizontal',
					axisClass: 'xLegendAxis',
					axisTransform: 'translate(2, 30)'
				}

				this.addLegend(options);
			}
			else {

				let options = {
					container: {
						width: 50,
						height: 300
					},
					defs: {
						x1: '100%',
						y1: '0%',
						x2: '100%',
						y2: '100%'
					},
					stops: {
						high: this.highColor,
						low: this.lowColor
					},
					rect: {
						width: 10,
						height: 300,
						transform: 'translate(2, 10)'
					},
					scaleDomain: [300, 0],
					scaleRange: [0, maxValue],
					direction: 'vertical',
					axisTransform: 'translate(10, 10)'
				}

				this.addLegend(options);

			}
		});
	}

	//@param {geojson -> json}
	//@param {backgroundColor -> }
	addTooltip(backgroundColor) {

		let geojson = this.geojson;
		let svg = this.svg;

		let tooltip = d3.select('body').append('div')
						.attr('class', 'd3-map-tooltip')
						.style('background-color', backgroundColor)
						.style('opacity', 0);	

		svg.selectAll('.map-regions')
				.data(geojson.features)
				.on('mouseover', function(d) {

					tooltip.transition()
							.duration(200)
							.style('opacity', 1);

					tooltip.html(() => {

								if(d.properties.value != undefined || d.properties.value) {
									return `<p><span>${d.properties.nom} </span>
											<br>
											<span>${d.properties.value}</span></p>`;
								}
								else {
									return `${d.properties.nom}`
								}

							})
							.style('left', (d3.event.pageX + 10) + 'px')
							.style('top', (d3.event.pageY - 30) + 'px');

				})
				.on('mouseout', function(d) {

					tooltip.transition()
							.duration(500)
							.style('opacity', 0);

					tooltip.html('')
							.style('left', '0px')
							.style('top', '0px');
				})

	}

	//@param {nom -> string}
	//@param {value -> string || number}
	toolTipHtml(nom, value) {

		let val = !value ? '' : value;

		tipTemplate = `${nom}`
	}

	//@param {maxValue -> number}
	//@param {lowColor -> colorHex}
	//@param {highColor -> colorHex}
	//@param {direction -> string}
	addLegend(options) {

		let	legendContainer = d3.select('.sliceGraph-legend')
								.append('svg')
								.attr('width', options.container.width)
								.attr('height', options.container.height)
								.attr('class', 'd3-svg-legend');

		let	legend = legendContainer.append('defs')
								.append('svg:linearGradient')
								.attr('id', 'legendGradient')
								.attr('x1', options.defs.x1)
								.attr('y1', options.defs.y1)
								.attr('x2', options.defs.x2)
								.attr('y2', options.defs.y2)
								.attr('spreadMethod', 'pad');

		legend.append('stop')
			.attr('offset', '0%')
			.attr('stop-color', options.stops.high)
			.attr('stop-opacity', 1);

		legend.append('stop')
			.attr('offset', '100%')
			.attr('stop-color', options.stops.low)
			.attr('stop-opacity', 1);

		legendContainer.append('rect')
			.attr('width', options.rect.width)
			.attr('height', options.rect.height)
			.style('fill', 'url(#legendGradient)')
			.attr('transform', options.rect.transform);

			let a  = d3.scaleLinear()
						.range(options.scaleDomain)
						.domain(options.scaleRange);

			let axis = options.direction == 'horizontal' ? d3.axisTop(a) : d3.axisRight(a);

		legendContainer.append('g')
			.attr('class', 'legendAxis')
			.attr('transform', options.axisTransform)
			.call(axis);
	}
}

export default chloropeth;