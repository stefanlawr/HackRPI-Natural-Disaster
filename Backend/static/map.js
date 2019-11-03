mapboxgl.accessToken =
  'pk.eyJ1Ijoic3N0cmF1YzEiLCJhIjoiY2syaHl6eDNpMWI4azNucDBoaTZuamFnZSJ9.9EjV8zoR-lN2pSXc0VTDKA';
let latlng;

let geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-77.032, 38.913]
      },
      properties: {
        title: 'Mapbox',
        description: 'Washington, D.C.'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-122.414, 37.776]
      },
      properties: {
        title: 'Mapbox',
        description: 'San Francisco, California'
      }
    }
  ]
};

const foo = this.document.querySelector('#map');
let map = new mapboxgl.Map({
  container: foo, // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9 // starting zoom
});

// Gets lat/lng of mouse cursor
map.on('mousemove', e => {
  let coords = e.lngLat.wrap();
  latlng = [coords.lng, coords.lat];
});

// Adds marker to click
map.on('click', () => {
  try {
    geojson = JSON.parse(sessionStorage.getItem('geo'));
    geojson.features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: latlng
      },
      properties: {
        title: 'Marker',
        description: `${latlng}`
      }
    });
    console.log(latlng);

    render();

    sessionStorage.setItem('geo', JSON.stringify(geojson));
  } catch {
    console.log('Pin failed');
  }
});

const render = () => {
  // console.log(geojson);
  geojson.features.forEach(marker => {
    let el = document.createElement('div');
    el.className = 'marker';
    new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
  });
};

map.on('load', () => {
  sessionStorage.getItem('geo', JSON.stringify(geojson));
  geojson = JSON.parse(sessionStorage.getItem('geo'));
  render();
});
