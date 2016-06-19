function formatDepot(depot) {
  return {
    geometry: {
      x: depot.point.x,
      y: depot.point.y,
    },
    attributes: {
      Name: depot.name,
    },
  };
}

function getDepots(depots) {
  return {
    features: depots.map(formatDepot),
  };
}

function formatOrder(order) {
  return {
    geometry: {
      x: order.point.x,
      y: order.point.y,
    },
    attributes: {
      Name: order.name,
    },
  };
}

function getOrders(orders) {
  return {
    features: orders.map(formatOrder),
  };
}

function getRoute(depot, i) {
  return {
    attributes: {
      Name: `Route ${i + 1}`,
      StartDepotName: depot.name,
      EndDepotName: depot.name,
      EarliestStartTime: 1455609600000,
      LatestStartTime: 1455609600000,
    },
  };
}

function getRoutes(depots) {
  return {
    features: depots.map(getRoute),
  };
}

function showRoutes(results) {
  console.log('showRoutes', results);
}

function showStops(results) {
  console.log('showStops', results);
}

function showDirections(results) {
  console.log('showDirections', results);
}

function getGeomappingDataFromArcGis(Geoprocessor, Point, data) {
  data = data.map(d => {
    d.point = new Point(d.loc[0], d.loc[1]);
    return d;
  });

  const geoserviceUrl = 'https://logistics.arcgis.com/arcgis/rest/services/World/VehicleRoutingProblem/GPServer/SolveVehicleRoutingProblem';
  const arcgis = "zlut5gMuE4iwuIom6enafnzQZkYBFpmteWcUOojhQFV5sa-zNfynF7EOQ1TDnEsQDxqQ1LLB8KT6qeKdVSeBS5CNxjDuB9WU7MLvJUhvNfem-e9TBdPgrDBe9HKCpx27mFsky-LKoPtlTvnVZ82Qig..";
  const depots = data.slice(0, 1);
  const orders = data.slice(1);
  const geoprocessor = new Geoprocessor(`${geoserviceUrl}?token=${arcgis}`);
  const params = {
    default_date: 1455609600000,
    time_units: "Minutes",
    distance_units: "Miles",
    depots: JSON.stringify(getDepots(depots)),
    orders: JSON.stringify(getOrders(orders)),
    routes: JSON.stringify(getRoutes(depots)),
    populate_directions: true,
  };

  geoprocessor.submitJob(params).then(results => {
    geoprocessor.getResultData(results.jobId, "out_routes").then(showRoutes);
    geoprocessor.getResultData(results.jobId, "out_stops").then(showStops);
    geoprocessor.getResultData(results.jobId, "out_directions").then(showDirections);
  });
}

function setupGeomapping(Geoprocessor, Point) {
  const data = [{
      "_id" : "5765f170bad0f48e9605cdc4",
      "name" : "Fibonacci Brewing Company",
      "address" : "1445 Compton Rd",
      "city" : "Cincinnati",
      "state" : "OH",
      "zip" : "45231",
      "phone" : "5138321422",
      "loc" : [
          -84.540985,
          39.231448
      ],
      "website" : "http://www.fibbrew.com",
      "twitter" : "https://twitter.com/fibbrewing",
      "facebook" : "https://www.facebook.com/fibonaccibrewing",
      "logo" : "http://d3d27zyflwslfn.cloudfront.net/images/fibonacci.jpeg"
  }, {
      "_id" : "5765f170bad0f48e9605cdc8",
      "name" : "Mt. Carmel Brewing Company",
      "address" : "4362 Mt. Carmel-Tobasco Rd.",
      "city" : "Cincinnati",
      "state" : "OH",
      "zip" : "45244",
      "phone" : "5132402739",
      "loc" : [
          -84.300243,
          39.093579
      ],
      "website" : "http://www.mtcarmelbrewingcompany.com",
      "twitter" : "https://twitter.com/MtCarmelBrewing",
      "facebook" : "https://www.facebook.com/mtcarmelbrewing",
      "logo" : "http://d3d27zyflwslfn.cloudfront.net/images/mtcarmel.png"
  }, {
      "_id" : "5765f170bad0f48e9605cdcf",
      "name" : "Urban Artifact",
      "address" : "1660 Blue Rock St",
      "city" : "Cincinnati",
      "state" : "OH",
      "zip" : "45223",
      "phone" : "5136204729",
      "loc" : [
          -84.54202,
          39.160671
      ],
      "website" : "http://www.artifactbeer.com",
      "twitter" : "https://twitter.com/ArtifactBeer",
      "facebook" : "https://www.facebook.com/urbanartifactbrewing",
      "logo" : "http://d3d27zyflwslfn.cloudfront.net/images/urbanartifact.png"
  }];
  getGeomappingDataFromArcGis(Geoprocessor, Point, data);
}

const dependencies = [
  "esri/tasks/Geoprocessor",
  "esri/geometry/Point",
];

require(dependencies, setupGeomapping);