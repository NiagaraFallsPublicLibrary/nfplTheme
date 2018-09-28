
var hours = locationStatus();
var oo = hours[0];
var cc = hours[1];

var victoria =  {
                "title": 'Victoria Avenue Library',
                "lat": '43.104103',
                "lng": '-79.072765',
                "description": '',
                "address": '4848 Victoria Avenue, Niagara Falls ON L2E 4C5',
                "phone": '905-356-8080',
                "directions":'http://maps.google.com/maps?hl=en&amp;saddr=&amp;daddr=43.104103,-79.072765',
                "open": parseTime(locationStatus('Vict')[0]), 
                "close": parseTime(locationStatus('Vict')[1])
                };
                		
var stamford =  {
                "title": 'Stamford Centre Library',
                "lat": '43.119863',
                "lng": '-79.100488',
                "description": '',
                "address": 'Town & Country Plaza, 3643 Portage Road, Niagara Falls ON',
                "phone": '905-357-0410',
                "directions":'http://maps.google.com/maps?hl=en&amp;saddr=&amp;daddr=43.119778,-79.100553',
                "open" : parseTime(locationStatus('Stam')[0]), 
                "close": parseTime(locationStatus('Stam')[1])
                };

var community = {
                "title": 'Community Centre Library',
                "lat": '43.071399',
                "lng": '-79.124242',
                "description": '',
                "address": 'MacBain Community Centre, 7150 Montrose Road, Niagara Falls ON L2H 3N3',
                "phone": '905-371-1200',
                "directions":'http://maps.google.com/maps?hl=en&amp;saddr=&amp;daddr=43.071399,-79.124242',
                "open" : parseTime(locationStatus('Comm')[0]), 
                "close": parseTime(locationStatus('Comm')[1])
                };

var chippawa =  {
                "title": 'Chippawa Library',
                "lat": '43.058733',
                "lng": '-79.051419',
                "description": '',
                "address": '3763 Main Street, Niagara Falls ON',
                "phone": '905-295-4391',
                "directions":'http://maps.google.com/maps?hl=en&amp;saddr=&amp;daddr=43.058652,-79.051316',
                "open" : parseTime(locationStatus('Chip')[0]), 
                "close": parseTime(locationStatus('Chip')[1])
                };

var novel =     {
                "title": 'Novel Branch @ Gale Centre',
                "lat": '43.113296',
                "lng": '-79.080421',
                "description": '',
                "address": '5152 Thorold Stone Road',
                "phone": '',
                "directions":'http://maps.google.com/maps?hl=en&amp;saddr=&amp;daddr=43.1132965,-79.080421',
                "open" : parseTime(locationStatus('Nove')[0]), 
                "close": parseTime(locationStatus('Nove')[1])
                };

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
	
function LoadMap() {
   
    var l = document.getElementById("lo").value;
    var location = l;
    var markers = "";
    switch(location){
        case "AllLocations":
            markers = [victoria, stamford, community, chippawa, novel];
            break;
        case "Victoria":
            markers = [victoria];
            break;
        case "Stamford":
            markers = [stamford];
            break;
        case "Community":
            markers = [community];
            break;
        case "Chippawa":
            markers = [chippawa];
            break;
        case "Novelbranch":
            markers = [novel];
            break;
        default:
            markers = [victoria, stamford, community, chippawa, novel];
    }


    var mapOptions = {
        mapTypeId: google.maps.MapTypeId.HYBRID,
        mapTypeControl: false,
        gestureHandling: 'cooperative'
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var bounds = new google.maps.LatLngBounds();
    //Create and open InfoWindow.
    var infoWindow = new google.maps.InfoWindow();

    for (var i = 0; i < markers.length; i++) {
        var data = markers[i];
        var myLatlng = new google.maps.LatLng(data.lat, data.lng);
        var pos = new google.maps.LatLng(data.lat, data.lng);        
        var image = {
            url: mapIcon(data.open, data.close),
            // This marker is 20 pixels wide by 30 pixels tall.
            size: new google.maps.Size(20, 30),
            // The origin for this image is 0,0.
            origin: new google.maps.Point(0,0),
            // The anchor for this image is the base of the image at 0,30.
            anchor: new google.maps.Point(17, 34)
        };
        bounds.extend(pos);
        var marker = new google.maps.Marker({
            position: pos,
            map: map,
            title: data.title + " - " + branchStatus(data.open, data.close),
            icon: image,
            draggable: false,
            animation: google.maps.Animation.DROP
        });
        
        //Attach click event to the marker.
        (function (marker, data) {
            google.maps.event.addListener(marker, "click", function (e) {
                //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
                var title = data.title;
                var status = branchStatus(data.open, data.close);
                var address = data.address.replace(/,/g, "<br/>");
                var phone = data.phone;
                var directions = data.directions;
                var description = data.description;
                var open = (data.open.getTime() == data.close.getTime()) ? "" : data.open.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                var closed = (data.open.getTime() == data.close.getTime()) ? "" : data.close.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

                var infoContent = "<div class='infoWindow'><div class='infoTitle'>" + title + "</div><div class='info'><div>" + status + "</div><p>" + ((open == "" && closed == "") ? "Closed Today" : open + " - " + closed) + "</p><p>" + address + "</p><p>" + phone + "</p></div><div class='dir'><a id='infoDirections' href='" + directions + "'><span><img src='/themes/nfplTheme/images/siteImage/ArrowRight.png' /></span><span> Directions</span>" + description + "</div></div>";
                infoWindow.setContent(infoContent);
                infoWindow.open(map, marker);
            });
        })(marker, data);
    }
    map.fitBounds(bounds);
}

function mapIcon(open,close){
    var result = branchStatus(open, close);
    var markerImg = "";
    var markerGreen = "themes/nfplTheme/images/custom/markerGreen.png";
    var markerRed = "themes/nfplTheme/images/custom/markerRed.png";
    var markerOrangeStar = "themes/nfplTheme/images/custom/markerOrangeStar.png";
    var markerGreenStar = "themes/nfplTheme/images/custom/markerGreenStar.png";

    
    switch(result){
        case "Open":
            markerImg = markerGreen;
            break;
        case "Closed":
            markerImg = markerRed;
            break;
        case "Opening Within One Hour":
            markerImg = markerOrangeStar;
            break;
        case "Closing Within One Hour":
            markerImg = markerGreenStar;
            break;
            }
    return markerImg;
}
	
function branchStatus(open, close){
    var tDate = new Date();
    var minute = 60000;
    var hour = minute * 60;
    var status = "";
    
    //Open
    if  (tDate.getTime() > open.getTime() && tDate.getTime() < close.getTime() - hour)
        status = "Open";
    //Closed
    if  ((open.getTime() == close.getTime()) || (tDate.getTime() < open.getTime() || tDate.getTime() > close.getTime()))
        status = "Closed";
    //Open Soon
    if	(tDate.getTime() < open.getTime() && tDate.getTime() > open.getTime() - hour)
        status = "Opening Within One Hour";
    //Closed Soon
    if	(tDate.getTime() < close.getTime() && tDate.getTime() > close.getTime() - hour)
        status = "Closing Within One Hour";
        
    return status;
}
	
//Acceptable formats to parse
//var times = ['1:00 pm','1:00 p.m.','1:00 p','1:00pm','1:00p.m.','1:00p','1 pm','1 p.m.','1 p','1pm','1p.m.', '1p','13:00','13'];
function parseTime(time){
    var d = new Date();
    var t = time;
    t = t.match(/(\d+)(?::(\d\d))?\s*(p?)/);
    d.setHours( parseInt(t[1]) + (t[3] ? 12 : 0) );
    d.setMinutes( parseInt(t[2]) || 0 );
    return d;
}
	
//Get the location's weekly hours and find today's times
//Returns the opening and closing times for the location suggested (l) as Vict, Stam, Chip, Comm or Nove
function locationStatus(l)	{
    var today = new Date();
    var dayOfWeek = today.getDay();
    var day = today.getDate();
    var month = today.getMonth();

    //NEW HOURS
    var Vict = [ ['0:00','0:00'], ['9:00','20:00'] , ['9:00','20:00'] , ['9:00','20:00'] , ['9:00','20:00'],  ['9:00','17:00'], ['9:00','17:00'] ];
    var Stam = [ ['0:00','0:00'], ['9:00','20:00'] , ['9:00','17:00'] , ['9:00','17:00'] , ['9:00','20:00'],  ['9:00','17:00'], ['9:00','17:00'] ];
    var Chip = [ ['0:00','0:00'], ['13:30','20:00'] , ['0:00','0:00'] , ['10:00','20:00'] , ['0:00','0:00'],  ['10:00','17:00'], ['10:00','3:00'] ];
    var Comm = [ ['11:00','15:00'], ['9:00','20:00'] , ['9:00','20:00'] , ['9:00','20:00'] , ['9:00','20:00'],  ['9:00','20:00'], ['9:00','17:00'] ]; 
    var Nove = [ ['8:00','23:00'], ['8:00','23:00'], ['8:00','23:00'], ['8:00','23:00'], ['8:00','23:00'], ['8:00','23:00'], ['8:00','23:00']]; 


    var n;
    if(l != undefined)
    {
        switch(l){
            case "Vict":
                n = Vict;
                break;
            case "Stam":
                n = Stam;
                break;
            case "Chip":
                n = Chip;
                break;
            case "Comm":
                n = Comm;
                break;
            case "Nove":
                n = Nove;
                break;
    }

    //Get the hours for today from the location requested
    var open = n[dayOfWeek][0];
    var close = n[dayOfWeek][1];
    var times = [open, close]}
    else
    {
        var times = [0,0];
    }
    return times;
}