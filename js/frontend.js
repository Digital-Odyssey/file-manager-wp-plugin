(function($){

	$(document).ready(function(e) {
		
	
	
	   
	   
	/* ==========================================================================
	   Methods
	   ========================================================================== */
	   var methods = {
		   
		   generateGoogleMap : function(id, latitude, longitude, message) {
								
			//console.log('map called');
			
			  var myLatlng = new google.maps.LatLng(latitude,longitude);
			  latLong = myLatlng;
			  var myOptions = {
				center: myLatlng, 
				zoom: 13,
				//mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeId : 'Styled', //custom styles
				mapTypeControlOptions : {
					mapTypeIds : [ 'Styled' ]
				}
			  };
			  
							
				var styleArray = [
				  {
					featureType: "all",
					stylers: [
					  { saturation: -80 }
					]
				  },{
					featureType: "road",
					stylers: [
					  { hue: wordpressOptionsObject.secondaryColor },
					  { saturation: 0 }
					]
				  },{
					featureType: "road.arterial",
					elementType: "geometry",
					stylers: [
					  { hue: wordpressOptionsObject.primaryColor },
					  { saturation: 100 }
					]
				  },{
					featureType: "poi.business",
					elementType: "labels",
					stylers: [
					  { visibility: "off" }
					]
				  }
				];
			   
					
												  
			  //alert(document.getElementById(id).getAttribute('id'));
			  
			  //clear the html div first
			  document.getElementById(id).innerHTML = "";
			  
			  var map = new google.maps.Map(document.getElementById(id), myOptions);
			  
			   var styledMapType = new google.maps.StyledMapType(styleArray, {
					name : 'Styled'
			   });
			  map.mapTypes.set('Styled', styledMapType);
			  
			  //var iconBase = wordpressOptionsObject.templateDir  + '/img/';
							  
			  var marker = new google.maps.Marker({
				  position: myLatlng,
				  map: map,
				  icon: wordpressOptionsObject.marker
			  });
	 
			  var contentString = message;
			  var infowindow = new google.maps.InfoWindow({
				  content: contentString
			  });
			  
			   
			  google.maps.event.addListener(marker, "click", function() {
				  infowindow.open(map,marker);
			  });
			   
			  marker.setMap(map);
			  
			  activeMap = map;
			  
			  google.maps.event.trigger(map, 'resize');
			  map.setCenter(latLong);
			  
			  //Remove right margin on InfoWindow
			  google.maps.event.addListener(infowindow, 'domready', function() {

				   // Reference to the DIV which receives the contents of the infowindow using jQuery
				   var iwOuter = $('.gm-style-iw');
				
				   /* The DIV we want to change is above the .gm-style-iw DIV.
					* So, we use jQuery and create a iwBackground variable,
					* and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
					*/
				   var iwBackground = iwOuter.prev();
				
				   // Remove the background shadow DIV
				   iwBackground.children(':nth-child(2)').css({'display' : 'none'});
				
				   // Remove the white background DIV
				   iwBackground.children(':nth-child(4)').css({'display' : 'none'});
				   
				   // Moves the infowindow 115px to the right.
				   iwOuter.parent().parent().css({left: '0'});
					
				   // Moves the shadow of the arrow 76px to the left margin 
				   //iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 0px !important;'});
					
				   // Moves the arrow 76px to the left margin 
				   //iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 0px !important;'});
				   
					// Changes the desired color for the tail outline.
					// The outline of the tail is composed of two descendants of div which contains the tail.
					// The .find('div').children() method refers to all the div which are direct descendants of the previous div. 
					iwBackground.children(':nth-child(3)').find('div').children().css({
						'box-shadow': 'rgba(72, 181, 233, 0.6)',
						'z-index' : 2
					});
					
					// Taking advantage of the already established reference to
					// div .gm-style-iw with iwOuter variable.
					// You must set a new variable iwCloseBtn.
					// Using the .next() method of JQuery you reference the following div to .gm-style-iw.
					// Is this div that groups the close button elements.
					var iwCloseBtn = iwOuter.next();
					
					// Apply the desired effect to the close button
					iwCloseBtn.css({
					  opacity: '1', // by default the close button has an opacity of 0.7
					  border: '2px solid #ccc', // increasing button border and new color
					  'border-radius': '25px', // circular effect
					  'padding' : '10px',
					  'top' : '0px',
					  'right' : '8px',
					  'background-color' : 'white',
					  'text-align' : 'center'
					  });
					  
					  iwCloseBtn.find('img').css({
						'top' : '-333px',
						'left' : '2px'  
					  });
					
					// The API automatically applies 0.7 opacity to the button after the mouseout event.
					// This function reverses this event to the desired value.
					iwCloseBtn.mouseout(function(){
					  $(this).css({opacity: '1'});
					});
				
			  });
			
		},
		   
	   }//end of methods
		
	});

})(jQuery);