(function(){

	var $window   = $(window);
	var $document = $(document);
	var $body     = $('body');

	var screen_width  = $window.width(),
		screen_height = $window.height();

	$window.resize(function(){
		screen_width  = $window.width();
		screen_height = $window.height();
	});

	// All the balloons
	var balloons = {};

	// Balloon constructor
	function Balloon(b_id, b_img, b_x){
		this.bid = b_id;
		this.img = b_img;
		this.bx = b_x;
	}

	// Spawn a balloon
	function spawnMessage(key, auth, msg, x, nb){
		var b_id = '#' + key,
			b_img = (nb%4) + '.png',
			b_x = x;

		// Add in array
		balloons[key] = new Balloon(b_id, b_img, b_x);

		// Display it
		$body.append('<div id="'+key+'" class="balloon"><div class="message"><span>'+auth+'</span><p>'+msg+'</p></div></div>');
		$(balloons[key].bid)
			.css({
				background: 'url(images/' + balloons[key].img + ')',
				left: balloons[key].bx
			});
		
		// Prepare its clear
		setTimeout(function(){
			$(balloons[key].bid).remove();
			delete balloons[key];
		}, 50 * (screen_height + 300));
	}

	function changeMessage(key, msg){
		$(balloons[key].bid).find('p').html(msg);
	}

	function displayMessage(key, auth, msg, x, nb){
		if (balloons.hasOwnProperty(key)){
			changeMessage(key, msg);
		}
		else{
			spawnMessage(key, auth, msg, x, nb);
		}
	}

	// Animate balloons
	function anim(){
		for (var key in balloons){
			$(balloons[key].bid).css(
				{bottom: '+=0.5', left: '+=0.1'}
			);
		}
	}

	// Sockets
	var socket = io.connect();
	var nb    = null,
		ukey  = null,
		uname = prompt("Nom : ");

	// Set ID for the client
	socket.on('newClient', function(n){
		nb   = n;
		ukey = 'b' + n;
	});

	socket.on('newMessage', function(key, auth, msg, x, nb){
		displayMessage(key, auth, msg, x, nb);
	});

	// Send a message
	var msg = $('#message');
	msg.keypress(function(e) {
    	if(e.which == 13){
    		var rand_x = parseInt((Math.random()*(10000%(screen_width-300))));
        	socket.emit('newMessage', ukey, uname, this.value, rand_x, nb);
        	displayMessage(ukey, uname, this.value, rand_x, nb);
        	this.value = '';
    	}
	});

	setInterval(anim,25);
})();