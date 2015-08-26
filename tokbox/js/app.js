// Declare Variables
var apiKey,
    sessionId,
    token,
    session;

// get the APIKEY and TOKEN 
$(document).ready(function() {
	console.log('Voy a intentar generar la sesion');
    getApiAndToken();
});


function getApiAndToken() {
 // make an Ajax Request to get the apiKey, sessionId and token from the server
    //$.get(SAMPLE_SERVER_BASE_URL + '/session', function(res) {

    var apiKey = 45315992;
	var sessionId = '1_MX40NTMxNTk5Mn5-MTQ0MDE0OTY0MTM5OX5QdGhwa081WlprQ0xhMEhsaHVuODVZYWh-UH4'; 
	var token = 'T1==cGFydG5lcl9pZD00NTMxNTk5MiZzaWc9OTBmYjdlNTY2MTA2YzZhMWE0NDFiYWQ0ZDAzYjhjZjg0YWYxOWY1NDpyb2xlPXB1Ymxpc2hlciZzZXNzaW9uX2lkPTFfTVg0ME5UTXhOVGs1TW41LU1UUTBNREUwT1RZME1UTTVPWDVRZEdod2EwODFXbHByUTB4aE1FaHNhSFZ1T0RWWllXaC1VSDQmY3JlYXRlX3RpbWU9MTQ0MDE1MTMxMyZub25jZT0wLjIwOTM5MjYyMDkxNDc4MDE3JmV4cGlyZV90aW1lPTE0NDA3NTM3MTYmY29ubmVjdGlvbl9kYXRhPQ==';
	initializeSession();
	console.log('he pedido iniciar sesión', apiKey, sessionId, token);
    //});
}


function initializeSession() {
    // Initialize Session Object
    session = OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream
    session.on('streamCreated', function(event) {
        session.subscribe(event.stream, 'subscriber', {
            insertMode: 'append',
            width: '100%',
            height: '100%'
        });
    });

    // Handler for sessionDisconnected event
    session.on('sessionDisconnected', function(event) {
        console.log('You were disconnected from the session.', event.reason);
    });

    // Connect to the Session
    session.connect(token, function(error) {
        // If the connection is successful, initialize a publisher and publish to the session
        if (!error) {
            var publisher = OT.initPublisher('publisher', {
                insertMode: 'append',
                width: '100%',
                height: '100%'
            });

            session.publish(publisher);

        } else {
            console.log('There was an error connecting to the session', error.code, error.message);
        }

    });

    // Receive a message and append it to the history
    var msgHistory = document.querySelector('#history');
    session.on('signal:chat', function(event) {
        var msg = document.createElement('p');
        msg.innerHTML = event.data;
        msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
        msgHistory.appendChild(msg);
        msg.scrollIntoView();
    });

}


// Text Chat
var form = document.querySelector('form');
var msgTxt = document.querySelector('#msgTxt');

// Send a signal once the user enters data in the form.This will send the data entered to all participants                      
form.addEventListener('submit', function(event) {
    event.preventDefault();

    session.signal({
        type: 'chat',
        data: msgTxt.value
    }, function(error) {
        if (!error) {
            msgTxt.value = '';
        }
    });
});
