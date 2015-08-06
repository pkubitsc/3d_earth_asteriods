(function () {

	var webglEl = document.getElementById('webgl');

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

	var width  = window.innerWidth,
		height = window.innerHeight;

	// Earth params
	var radius   = 0.5,
		segments = 32,
		rotation = 0;  

	var asteriodRadius = 0.1;
		asteriodSegments = 6;
		rotation = 0;

	var debrisRadius = 0.01;
		debrisSegments = 6;
		rotation = 0;

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
	camera.position.z = 1.5;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

	scene.add(new THREE.AmbientLight(0x333333));

	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(5,3,5);
	scene.add(light);

    var sphere = createSphere(radius, segments);
	sphere.rotation.y = rotation; 
	scene.add(sphere)

    var clouds = createClouds(radius, segments);
	clouds.rotation.y = rotation;
	scene.add(clouds)

	var stars = createStars(90, 64);
	scene.add(stars);

	var controls = new THREE.TrackballControls(camera);

	webglEl.appendChild(renderer.domElement);
	var asteriod;
	var g_flag;


	var asteriods = [];
	var debris = [];
	var hits = [];
	var i =0;
	var asteriodCounter =0;
	var debris_flag = false;
	render();

	function render() {
		controls.update();
		// sphere.rotation.y += 0.0005;
		// clouds.rotation.y += 0.0005;	
		// sphere.scale.x += .01;
		// sphere.scale.y += .01;
		// sphere.scale.z += .01;	
		requestAnimationFrame(render);
		renderer.render(scene, camera);
		
		sphere.geometry;

		// which contains the vertices and faces
		sphere.geometry.vertices; // an array
		sphere.geometry.faces; // also an array

		// its position
		//console.log(sphere.position); // contains x, y and z\
	if(g_flag){
		for(i = 0; i < asteriodCounter; i++){
		//console.log(asteriods[i].position);
			if (Math.abs(asteriods[i].position.x) > .372 || Math.abs(asteriods[i].position.y) > .372 || Math.abs(asteriods[i].position.z) > .372 ){
				var total = Math.pow(asteriods[i].position.x,2) + Math.pow(asteriods[i].position.y,2) + Math.pow(asteriods[i].position.z,2); 
				asteriods[i].translateX( -(asteriods[i].position.x / Math.pow(total,.5)) / 15 );
				asteriods[i].translateY(-(asteriods[i].position.y / Math.pow(total,.5)) / 15);
				asteriods[i].translateZ( -(asteriods[i].position.z / Math.pow(total,.5)) / 15 );

			}else if (Math.abs(asteriods[i].position.x) < .372 || Math.abs(asteriods[i].position.y) < .372 || Math.abs(asteriods[i].position.z) < .372 ){
				if(asteriods[i].scale.x < 1.05){
                    asteriods[i].material.map = THREE.ImageUtils.loadTexture('images/debris.jpg');
                    asteriods[i].material.bumpMap = THREE.ImageUtils.loadTexture('images/debrisBump.jpg');
                    asteriods[i].material.bumpScale = 1;
                    
                }
                if(asteriods[i].scale.x < 2){
                    asteriods[i].scale.x += 0.05;
                    asteriods[i].scale.y += 0.05;
                    asteriods[i].scale.z += 0.05;
                }


				 if(hits[i] == 1){
				 	for (var j = 0; j < 15; j++) {
				 		debris[j] = createDebris(getRandomInt(1,10)/200, debrisSegments);

				 		scene.add(debris[j]);

						debris[j].position.x = asteriods[i].position.x;
						debris[j].position.y = asteriods[i].position.y;
						debris[j].position.z = asteriods[i].position.z;

				 	};
				 	

					debris_flag = true;
				  	hits[i] = 0;
				 }
			} if(debris_flag ){
				// if(i == 0){){
				// console.log("asdl;asdl;asl;asals;adfls;");
				 	for (var j = 0; j < 15; j++) {
				 			var debrisTotal = Math.pow(debris[j].position.x,2) + Math.pow(debris[j].position.y,2) + Math.pow(debris[j].position.z,2); 
							// debris[j].translateX(((debris[j].position.x + getRandomInt(-10, 10) ) / Math.pow(debrisTotal,.5)) / 500 );
							// debris[j].translateY(((debris[j].position.y + getRandomInt(-10, 10) ) / Math.pow(debrisTotal,.5)) / 500 );
							// debris[j].translateZ(((debris[j].position.z + getRandomInt(-10, 10) ) / Math.pow(debrisTotal,.5)) / 500 );
							var x =((debris[j].position.x  * Math.sin(j) ) / Math.pow(debrisTotal,.5)) / 200 ;
							var y = ((debris[j].position.y * Math.cos(j) ) / Math.pow(debrisTotal,.5)) / 200 ;
							var z = ((debris[j].position.z * Math.tan(j) ) / Math.pow(debrisTotal,.5)) / 200 ;
							debris[j].translateX(x);
							debris[j].translateY(y);
							debris[j].translateZ(z);
					}
		
			}
			}
		}
	}


	webglEl.addEventListener("mousedown", function(e){
        //create a new ball under the current mouse position if pressing the left button  
        var event = e || window.event;      
        var client_x_r = event.clientX - this.offsetLeft;
        var client_y_r = event.clientY - this.offsetTop;

		if (e.button == 2) { 
			
			 asteriods [asteriodCounter] = createAsteriod(asteriodRadius, asteriodSegments);
				//asteriods[asteriodCounter].rotation.y = rotation; 
				hits[asteriodCounter] = 1;
				scene.add(asteriods[asteriodCounter]);


				asteriods[asteriodCounter].position.x = getRandomInt(-10,10);
				asteriods[asteriodCounter].position.y = getRandomInt(-10,10);
				asteriods[asteriodCounter].position.z = getRandomInt(-10,10);
			
				asteriodCounter++;
		}

		g_flag = true;

        });

	    webglEl.addEventListener("mouseup", function(e){
        var event = e || window.event;      

  		});

	function getRandomInt(min, max) {
  		return Math.floor(Math.random() * (max - min)) + min;
	}

	function createSphere(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/2_no_clouds_4k.jpg'),
				bumpMap:     THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
				bumpScale:   0.005,
				specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
				specular:    new THREE.Color('grey')								
			})
		);
	}
	function createAsteriod(asteriodRadius, asteriodSegments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(asteriodRadius, asteriodSegments, asteriodSegments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/asteriod.jpg'),
				bumpMap:     THREE.ImageUtils.loadTexture('images/asteriod.jpg'),
				bumpScale:   0.005,
			})
		);
	}
	function createDebris(debris, debrisSegments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(debris, debrisSegments, debrisSegments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/debris.jpg'),
				bumpMap:     THREE.ImageUtils.loadTexture('images/debris.jpg'),
				bumpScale:   0.005,
			})
		);
	}
	function createClouds(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius + 0.007, segments, segments),			
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/fair_clouds_4k.png'),
				transparent: true
			})
		);		
	}

	function createStars(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments), 
			new THREE.MeshBasicMaterial({
				map:  THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'), 
				side: THREE.BackSide
			})
		);
	}

}());