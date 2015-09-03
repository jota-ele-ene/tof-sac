// Declare Variables
var apiKey,
    sessionId,
    token;
    //session;
var subscriber = 'null';

// get the APIKEY and TOKEN 
$(document).ready(function() {
	console.log('Voy a intentar generar la sesion');
	 $('#stop').hide();
    archiveID = null;
    getApiAndToken();
});


function getApiAndToken() {
 // make an Ajax Request to get the apiKey, sessionId and token from the server
    $.get(SAMPLE_SERVER_BASE_URL + '/session', function(res) {

    var apiKey = res.apiKey; //45315992;
	var sessionId = res.sessionId; //'1_MX40NTMxNTk5Mn5-MTQ0MDE0OTY0MTM5OX5QdGhwa081WlprQ0xhMEhsaHVuODVZYWh-UH4'; 
	var token = res.token; //'T1==cGFydG5lcl9pZD00NTMxNTk5MiZzaWc9OTBmYjdlNTY2MTA2YzZhMWE0NDFiYWQ0ZDAzYjhjZjg0YWYxOWY1NDpyb2xlPXB1Ymxpc2hlciZzZXNzaW9uX2lkPTFfTVg0ME5UTXhOVGs1TW41LU1UUTBNREUwT1RZME1UTTVPWDVRZEdod2EwODFXbHByUTB4aE1FaHNhSFZ1T0RWWllXaC1VSDQmY3JlYXRlX3RpbWU9MTQ0MDE1MTMxMyZub25jZT0wLjIwOTM5MjYyMDkxNDc4MDE3JmV4cGlyZV90aW1lPTE0NDA3NTM3MTYmY29ubmVjdGlvbl9kYXRhPQ==';
	//initializeSession();
	console.log('he pedido iniciar sesión', apiKey, sessionId, token);
    });
}


		function Conectar() {
			console.log('estoy dentro de la función Conectar');
			subscriber = 'null';
			var session = OT.initSession(apiKey, sessionId); 
			  session.on({ 
				  streamCreated: function(event) { 
					subscriber = session.subscribe(event.stream, 'subscribersDiv', {width: 800, height: 600, insertMode: 'append', showControls: true}); 
					console.log('Estoy conectado a una sesión', sessionId, token);
				  } 
			  }); 
			
			 // Handler for sessionDisconnected event
   			 session.on('sessionDisconnected', function(event) {
        		console.log('You were disconnected from the session.', event.reason);
    		});

    		// Handler for archiveStarted event
    		session.on('archiveStarted', function(event) {
        		archiveID = event.id;
    		});
			
			  session.connect(token, function(error) {
				if (error) {
				  console.log(error.message);
				} else {
				  console.log('Estoy conectado a una sesión 2', sessionId, token);
				}
			  });
			  
		}
	
			function Desconectar(subscriberId) {
			  console.log('Estoy intentando desconectar',subscriberId);
			  session.unsubscribe(subscriberId);
				
			  document.getElementById("iniciar").style.display = "none";
			 }
		
		function Reconectar() {
			console.log('estoy dentro de la función reconectar');
			  session.on({ 
				  streamCreated: function(event) { 
					session.subscribe(event.stream, 'subscribersDiv', {width: 800, height: 600, insertMode: 'append', showControls: true}); 
					console.log('Estoy reconectado a una sesión', sessionId, token);
				  } 
			  }); 
			  session.connect(token, function(error) {
				if (error) {
				  console.log(error.message);
				} else {
				  console.log('Estoy reconectado a una sesión 2', sessionId, token);
				}
			  });
			  document.getElementById("reconectar").style.display = "none";

			  document.getElementById("cerrar").style.display = "block";
			  
		}

// Start Recording
function startArchive() {
    // make an Ajax Request to start the recording
    $.post(SAMPLE_SERVER_BASE_URL + '/start/' + sessionId);
    $('#start').hide();
    $('#stop').show();
}


// Stop Recording
function stopArchive() {
    // make an Ajax Request to stop the recording
    $.post(SAMPLE_SERVER_BASE_URL + '/stop/' + archiveID);
    $('#stop').hide();
    $('#start').show();
    $('#view').prop('disabled', false);
}


// View the Archive that was just created
function viewArchive() {
    // make an Ajax Request to view the archive
    window.open(SAMPLE_SERVER_BASE_URL + '/view/' + archiveID);
    $('#view').prop('disabled', true);

}