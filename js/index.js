const canadaStyleSelect = new ol.style.Style({
  fill: new ol.style.Fill({
    color: [255, 0, 0, 0.6] 
  }),
  stroke: new ol.style.Stroke({
    color: [255, 0, 0, 1],
    width: 2,
    lineCap: 'round'
  })
});

function getStyleByCirc(feature) {
  var parti = feature.get('parti_politique'); 

  var fillColor;

  switch (parti) {
    case 'P.L.Q./Q.L.P.':
      fillColor = '#e41a1c';
      break;
    case 'C.A.Q.-E.F.L.':
      fillColor = '#377eb8';
      break;
    case 'Q.S.':
      fillColor = '#984ea3'; 
      break;
    case 'P.Q.':
      fillColor = '#ff7f00'; 
      break;
    default:
      fillColor = '#cccccc'; 
  }

  return new ol.style.Style({
    fill: new ol.style.Fill({ color: fillColor }),
    stroke: new ol.style.Stroke({
      color: '#333',
      width: 1
    })
  });
}

const pointStyle = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 5,
    fill : new ol.style.Fill({
      color: '#666666'
    }),
    stroke: new ol.style.Stroke({
      color: '#bada55'
    })
  })
});

const view = new ol.View({
  center: ol.proj.transform([-73.56, 45.50],'EPSG:4326', 'EPSG:3857'),
  zoom: 6  
});

const osmLayer = new ol.layer.Tile({
  title : 'OSM',
  type : 'base',
  source: new ol.source.OSM()
});
osmLayer.setVisible(true);

const esriImagery = new ol.layer.Tile({
  title: 'Esri World Imagery',
  type: 'base',
  visible: false,
  source: new ol.source.XYZ({
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attributions: 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
  })
});

const cartoPositron = new ol.layer.Tile({
  title: 'CartoDB Positron',
  type: 'base',
  visible: false,
  source: new ol.source.XYZ({
    url: 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    attributions: '&copy; <a href="https://carto.com/">CARTO</a>'
  })
});

var basemap = new ol.layer.Group({
  title: 'Fonds de carte',
  fold: 'open',
  visible: true,
  layers: [osmLayer, esriImagery, cartoPositron]
});

const vectorLayer1 = new ol.layer.Vector({
  id: 'Parti Gagnant',
  title: 'Circonscription',
  source: new ol.source.Vector({
    url: './data/parti_circonscription.geojson',
    format: new ol.format.GeoJSON(),
  }),
  style: getStyleByCirc
});
vectorLayer1.setVisible(true);

const vectormap = new ol.layer.Group({
  title: 'Couches',
  fold: 'open',
  layers: [vectorLayer1]
});

const selectInteraction = new ol.interaction.Select({
  condition: ol.events.condition.pointerMove,
  layers: function (layer) {
    return layer.get('id') === 'Parti Gagnant';
  },
  style: canadaStyleSelect
});

const map = new ol.Map({
  target: 'map'
});

var layerSwitcher = new ol.control.LayerSwitcher({
  reverse: true,
  groupSelectStyle: 'group'
});

const MousePosition = new ol.control.MousePosition({
  coordinateFormat: ol.coordinate.createStringXY(2),
  projection: 'EPSG:3857'
});

const ScaleLine = new ol.control.ScaleLine({
  units: 'metric',
  minWidth: 100
});

map.addControl(MousePosition);
map.addLayer(basemap);
map.addLayer(vectormap);
map.setView(view);
map.addInteraction(selectInteraction);
map.addControl(layerSwitcher);
map.addControl(ScaleLine);
