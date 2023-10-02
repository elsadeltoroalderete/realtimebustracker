var map;
		var markers = [];

		// load map
		function init(){
			var myOptions = {
				zoom      : 14,
				center    : { lat:40.7851,lng:-73.9683 },
				mapTypeId : google.maps.MapTypeId.ROADMAP
			};
			var element = document.getElementById('map');
  			map = new google.maps.Map(element, myOptions);
  			addMarkers();
		}

		// Add bus markers to map
		async function addMarkers(){
			// get bus data
			var locations = await getBusLocations();
			console.log(locations);

			// Extract the bus data array from the object
			var busData = locations.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity;

			console.log(busData);

			// loop through data, add bus markers
			busData.forEach(function(bus){
				var marker = getMarker(bus.MonitoredVehicleJourney.VehicleRef);		
				if (marker){
					moveMarker(marker,bus);
				} else {
				addMarker(bus);			
				}
			});

			// timer
			console.log(new Date());
			setTimeout(addMarkers,30000);
		}

		// Request train data from MBTA
		async function getBusLocations() {
  			const url = 'https://bustime.mta.info/api/siri/vehicle-monitoring.json?key=YOUR_API_KEY_HERE';
 			var response = await fetch(url);
  			var data = await response.json(); // Parse the response as JSON
  			return data; // Return the parsed JSON data
		}

		function addMarker(bus){
			var icon = getIcon(bus);
			var marker = new google.maps.Marker({
	    		position: {
	    			lat: bus.MonitoredVehicleJourney.VehicleLocation.Latitude,
                    lng: bus.MonitoredVehicleJourney.VehicleLocation.Longitude
	    		},
	    		map: map,
	    		icon: icon,
	    		id: bus.VehicleRef
			});
			markers.push(marker);
		}

		function getIcon(bus){
			// select icon based on train direction
			if (bus.MonitoredVehicleJourney.DirectionRef === 0) {
				return 'red.png';
			}
			return 'blue.png';	
		}

		function moveMarker(marker,bus) {
			// change icon if train has changed direction
			var icon = getIcon(bus);
			marker.setIcon(icon);

			// move icon to new lat/lon
    		marker.setPosition( {
    			lat: bus.MonitoredVehicleJourney.VehicleLocation.Latitude, 
                lng: bus.MonitoredVehicleJourney.VehicleLocation.Longitude
			});
		}

		function getMarker(VehicleRef){
			var marker = markers.find(function(item){
				return item.id === VehicleRef;
			});
			return marker;
		}

		window.onload = init;
