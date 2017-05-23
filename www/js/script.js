/**
 *
 * HTML5 Color Picker
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2012, Script Tutorials
 * http://www.script-tutorials.com/
 */

$(function(){
    var bCanPreview = true; // can preview

    // mqtt 
    var btnConnect = document.querySelector('.btn-connect');
    var btnDisconnect = document.querySelector('.btn-disconnect');

    var inputBrokerWs = document.querySelector('.input-broker-ws');

    var client;
    var topic = 'color';
  
    btnConnect.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('MQTT connect to: ', inputBrokerWs.value);
        client = mows.createClient(inputBrokerWs.value);
        // appendMessage('connection open :)');
        client.on('message', function (topic, message) {
          console.log(message);
          // appendMessage(message);
        });
    });

    btnDisconnect.addEventListener('click', function(e) {
        e.preventDefault();
        client && client.end();
        // appendMessage('connection closed');
    });

    var mqttPublishMessage = function(msg) {
        client && client.publish(topic, msg);
    };

    // create canvas and context objects
    var canvas = document.getElementById('picker');
    var ctx = canvas.getContext('2d');

    // drawing active image
    var image = new Image();
    image.onload = function () {
        ctx.drawImage(image, 0, 0, image.width, image.height); // draw the image on the canvas
    }

    // select desired colorwheel
    var imageSrc = 'images/colorwheel1.png';
    switch ($(canvas).attr('var')) {
        case '2':
            imageSrc = 'images/colorwheel2.png';
            break;
        case '3':
            imageSrc = 'images/colorwheel3.png';
            break;
        case '4':
            imageSrc = 'images/colorwheel4.png';
            break;
        case '5':
            imageSrc = 'images/colorwheel5.png';
            break;
    }
    image.src = imageSrc;

    $('#picker').mousemove(function(e) { // mouse move handler
        if (bCanPreview) {
            // get coordinates of current position
            var canvasOffset = $(canvas).offset();
            var canvasX = Math.floor(e.pageX - canvasOffset.left);
            var canvasY = Math.floor(e.pageY - canvasOffset.top);

            // get current pixel
            var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
            var pixel = imageData.data;

            // update preview color
            var pixelColor = "rgb("+pixel[0]+", "+pixel[1]+", "+pixel[2]+")";
            $('.preview').css('backgroundColor', pixelColor);

            

            // update controls
            $('#rVal').val(pixel[0]);
            $('#gVal').val(pixel[1]);
            $('#bVal').val(pixel[2]);
            $('#rgbVal').val(pixel[0]+','+pixel[1]+','+pixel[2]);

            var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
            var hexColor = '#' + ('0000' + dColor.toString(16)).substr(-6)
            $('#hexVal').val(hexColor);

            console.log('Converting hexColor:', hexColor);
            var color = tinycolor(hexColor);
            var hsv = color.toHsv();
            console.log(hsv);
            $('#hsvH').val(hsv['h'].toFixed(2) );
            $('#hsvS').val(hsv['s'].toFixed(2) );
            $('#hsvV').val(hsv['v'].toFixed(2) );

            // publish hsv value to mqtt
            mqttPublishMessage( JSON.stringify(hsv) );
        }
    });
    $('#picker').click(function(e) { // click event handler
        bCanPreview = !bCanPreview;
    }); 
    $('.preview').click(function(e) { // preview click
        $('.colorpicker').fadeToggle("slow", "linear");
        bCanPreview = true;
    });
});