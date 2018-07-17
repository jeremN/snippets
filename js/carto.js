class cartographie {

	constructor() {
		this.map = null;
		this.APIkey = '';
		L.mapquest.key = this.APIkey;
		this.geocoder = L.mapquest.geocoding();
	}

	//@param {element: HTMLelement || id}
	load(element) {
		this.map = L.mapquest.map(element, {
			center: [48.79212, 2.14545],
			layers: L.mapquest.tileLayer('light'),
			zoom: 10
		});
	}
	update(element) {
		this.map = L.mapquest.map(element, {
			center: [48.79212, 2.14545],
			layers: L.mapquest.tileLayer('light'),
			zoom: 10
		});
	}

	//@param {options: {title: string, url: url, ranked: number}}
	//@param {fn: callback function}
	geoCoder(item, fn) {


		if(!item.dataset.cartoLat) {
			let address = item.dataset.cartoAdress;

			this.geocoder.geocode(address, (error, response) => {

				let locate = response.results[0].locations[0].displayLatLng;
				item.dataset.cartoLat = `${locate.lat}`;
				item.dataset.cartoLng = `${locate.lng}`;
				fn(item);

			});
		}
		else {
			 fn(item);
		}

	}

	arrayUnique(arr) {
		return arr.filter(function(item, index){
			return arr.indexOf(item) >= index;
		});
	}

	//@param {lat, lng : number}
	//@parem {icon: createMarker()}
	addMarker(lat, lng, mapIcon) {
		
		mapIcon = !mapIcon ? this.defaultIcon() : mapIcon;
		return L.marker([lat, lng], {icon: mapIcon});
	}

	//
	defaultIcon() {	
		return L.icon({
			iconUrl: '../assets/images/illustration/gmap-marker-home.png',
			iconSize: [60, 60],
			iconAnchor: [30, 60],
			popupAnchor: [30, 60]
		});
	}

	//@param {string: title}
	customIcon(string) {
		return L.divIcon({
			className: 'carto-marker',
			iconSize: null,
			iconAnchor: [20, 40],
			popupAnchor: [0, 0],
			html: `<h2>${string}</h2>`
		});
	}

	//@param {array: markers}
	createGroupMap(array) {

		let	max = array.length,
			group = [];

		for(const element of array) {

			//console.log(array[j].dataset.cartoLat);
			let icon = this.customIcon( element.dataset.cartoRank );
			let marker = this.addMarker(element.dataset.cartoLat, element.dataset.cartoLng, icon);
			marker.bindPopup(`<h2>${element.dataset.cartoTitle}</h2><a href="${element.dataset.cartoUrl}" title="Voir la fiche de ${element.dataset.cartoTitle}">Voir la fiche</a>`)

			group.push(marker);
		}
		
		//https://gist.github.com/telekosmos/3b62a31a5c43f40849bb, delete duplicate node
		group.reduce((x,y) => x.includes(y) ? x : [...x, y], []);

		let featGroup = L.featureGroup(group).addTo(this.map);
		this.map.fitBounds(featGroup.getBounds());

	}
}

export default cartographie;
