

//some of that JQ magic
$(document).ready(function(){
  $('#right_frame').draggable();
  //$('#canvas_wrapper').resizable();
});

//global variables
var pow_nr = 0;
var global_clock = 0;
var space = document.getElementById("space");
var space_context=space.getContext("2d");

var space_overlay=document.getElementById("space_overlay");
var space_overlay_context=space_overlay.getContext("2d");

var ruler_origo = [];
//sets current_seed depending on the filepath
var current_seed = window.location.pathname.split('/');
current_seed = current_seed.pop();
console.log(current_seed);

//sets database ({name:, classification:, type:, base_size:, range_rings: [{range:,label:,color:,visible:}],default_speed:, max_speed_delta:, max_heading_delta:}) - move to separate file?
var space_objects_database = [];

space_objects_database[0] = new ois_database({
  name: "TBD",
  classification: "Chart Marker",
  type: "Fixed Point",
  base_size: 16,
  range_rings: [],
  default_speed: 0,
  max_speed_delta: 0,
  max_heading_delta: 0
});

space_objects_database[1] = new ois_database({
  name: "TBD",
  classification: "Generic",
  type: "Sensor Buoy",
  base_size: 16,
  range_rings: [{range: 200,label:"Long",color:"blue"}, {range: 100,label:"Short",color:"red"}],
  default_speed: 0,
  max_speed_delta: 0,
  max_heading_delta: 0
});

space_objects_database[2] = new ois_database({
  name: "TBD", 
  classification: "Generic",
  type: "Torpedo", 
  base_size: 16, 
  range_rings: [{range: 30,label:"large spread",color:"red"}],
  default_speed: 60, 
  max_speed_delta: 0, 
  max_heading_delta:5
});

space_objects_database[3] = new ois_database({
  name: "TBD", 
  classification: "Generic",
  type: "Escort",
  base_size: 16, 
  range_rings: [{range: 300,label:"300 units",color:"red"}],
  default_speed: 25, 
  max_speed_delta: 2, 
  max_heading_delta: 5
});

space_objects_database[4] = new ois_database({
	name: "TBD", 
	classification: "Generic",
  type: "Interceptor", 
	base_size: 16, 
	range_rings: [],
	default_speed: 60, 
	max_speed_delta: 60, 
	max_heading_delta:180
});
space_objects_database[5] = new ois_database({
	name: "TBD", 
	classification: "Generic",
  type: "Attack Flight", 
	base_size: 16, 
	range_rings: [],
	default_speed: 40, 
	max_speed_delta: 40, 
	max_heading_delta:90
});

space_objects_database[6] = new ois_database({
  name: "TBD", 
  classification: "Generic",
  type: "Transport",
  base_size: 16, 
  range_rings: [],
  default_speed: 15, 
  max_speed_delta: 1, 
  max_heading_delta: 2.5 
});

space_objects_database[7] = new ois_database({
  name: "TBD", 
  classification: "Generic",
  type: "Convoy Escort", 
  base_size: 16, 
  range_rings: [{range: 300, label:"300 units", color:"red"}],
  default_speed: 30, 
  max_speed_delta: 2, 
  max_heading_delta: 5 
});

space_objects_database[8] = new ois_database({
  name: "TBD", 
  classification: "Generic",
  type: "Light Cruiser", 
  base_size: 16, 
  range_rings: [],
  default_speed: 25, 
  max_speed_delta: 2, 
  max_heading_delta: 5 
});

//sets initial state ({name:, classification:, type:, base_size:, range_rings: [{range:,label:,color:,visible:}], position: [x,y], current_speed:, target_speed:, max_speed_delta:, current_heading:, target_heading:, max_heading_delta:})
var space_objects = [];
space_objects[0] = new ois({
  name: "Concordia", 
  classification: "Cobra",
  type: "Destroyer",
  base_size: 16, 
  range_rings: [{range: 100, label: "Lookout", color: "blue"}, {range: 300, label: "Macrocannon", color: "red"}], 
  position: [400,100], 
  current_speed: 20, 
  target_speed: 20, 
  max_speed_delta: 2, 
  current_heading:0, 
  target_heading:0, 
  max_heading_delta: 5
});

//loads and displays initial state
load_state(current_seed);
update_log();
update_log_state_all_ois();
draw_state_all_ois();
show_database();

//"object in space" expects object as argument, syntax {name:, classification:, type:, base_size:, range_rings: [{range:,label:,color:}],default_speed:, max_speed_delta:, max_heading_delta:}
function ois_database(data) {   
  this.name = data.name;
  this.classification = data.classification;
  this.type = data.type;
  this.base_size = data.base_size;
  //this.symbol
  //this.symbol_color
  this.range_rings = data.range_rings;
  this.default_speed = data.default_speed; //in units per minute
  this.max_speed_delta = data.max_speed_delta; //speed units per minute
  this.max_heading_delta = data.max_heading_delta; //degrees per 10 units of distance 
}

//"object in space" expects object as argument, syntax {name:, classification:, type:, base_size:, range_rings: [{range:,label:,color:}], position: [x,y], current_speed:, target_speed:, max_speed_delta:, current_heading:, target_heading:, max_heading_delta:}
function ois(data) {   
  this.name = data.name;
  this.classification = data.classification;
  this.type = data.type;
  this.base_size = data.base_size;
  this.range_rings = data.range_rings;
  
  this.max_speed_delta = data.max_speed_delta; //speed units per minute
  this.max_heading_delta = data.max_heading_delta; //degrees per 10 units of distance
  this.thrusters_delta = data.max_heading_delta; //in extra degrees per minute, for now = normal turning speed
  
  this.position = data.position;
  this.current_speed = data.current_speed; //in units per minute
  this.target_speed = data.target_speed;
  this.current_heading = data.current_heading; //in degrees
  this.target_heading = data.target_heading;
  
  this.firing_arcs_visible = false; //firing arcs toggle
  this.thrusters_firing = false; //thruster toggle
  this.boosters_firing = false; //boosters toggle
  
  this.flexible_range_ring_range = 0;
  this.movement_history = [];
  this.movement_history_visible = false;
  this.range_rings_visible = false;
  this.buttons_visible = true;

  this.tracked = false;
  this.class_known = false;
  this.type_known = false;
  this.identity_known = false;
  this.bearing_known = false;
  this.range_known = false;
  this.speed_known = false;
  this.heading_known = false;
  
  //turns an ois and makes sure the heading is correct
  this.turn = function(degrees){
    var bearing = this.current_heading + degrees;
    this.current_heading = adjust_bearing(bearing);
  };
  
  //changes the heading of an ois by delta up to target
  this.heading_delta = function(delta, target){
    var difference; 
    var target_temp = adjust_bearing(target - this.current_heading);
    if (target_temp > 180) difference = -360 + target_temp;
    else difference = target_temp;
    if (Math.abs(difference) < delta) this.heading = target; //handles overshooting
    else if (difference > 0) this.turn(delta); //clockwise turn
    else if (difference < 0) this.turn(-delta); //counterclockwise turn
  };
  
  //changes the speed of an ois by delta up to target 
  this.speed_delta = function(delta, target){
    
    if (Math.abs(this.current_speed - target) < delta) {this.current_speed = target;} //handles overshooting
    else if (this.current_speed < target) {this.current_speed += delta;} //increases speed 
    else if (this.current_speed > target) {this.current_speed -= delta;} //decreases speed
  };
  
  //advances the clock of an ois by ticks
  this.advance_clock = function (ticks) {
    for (var i=0;i<ticks;i++){
      this.position[0] = this.current_speed/60*Math.sin(Math.PI/180*this.current_heading) + this.position[0];  //moves the ois according to speed and heading
      this.position[1] = this.current_speed/60*Math.cos(Math.PI/180*this.current_heading) + this.position[1];
      
      if (global_clock%120 === 0){ //once per 2min, log the position
        var temp_pos = [];
        temp_pos[0] = this.position[0];
        temp_pos[1] = this.position[1];
        temp_pos[2] = global_clock;
        this.movement_history.push(temp_pos);
      }
      if (this.current_speed != this.target_speed){
        if (this.boosters_firing) this.speed_delta(this.max_speed_delta/60*2, parseInt(this.target_speed,10)); //Booster power = 2*max delta, for now
        else this.speed_delta(this.max_speed_delta/60, parseInt(this.target_speed,10));  
      }
      if (this.current_heading != this.target_heading) {
        var delta = this.max_heading_delta*this.current_speed/600;
        if(this.thrusters_firing) delta += this.thrusters_delta/60;
        this.heading_delta(delta, this.target_heading);
      }
    }
  };
  
  //prints ois variables and bearing/distance from pow
  this.givestate = function (pow_ois){   
    var state = (`<em>${this.name}</em> ${this.classification} ${this.type} <strong>Speed:</strong> ${this.current_speed.toFixed(2)}/${this.target_speed} LPM. <strong>Heading:</strong> ${zeroPad((Math.round(this.current_heading*100)/100).toFixed(2),3)}/${zeroPad((Math.round(this.target_heading*100)/100).toFixed(2),3)} deg<br>`);
    
    if (compute_distance(pow_ois.position, this.position) === 0) state +="At pow<br>";
    else state += (`At bearing ${zeroPad((Math.round(compute_bearing(pow_ois.position, this.position)*100)/100).toFixed(2),3)} degrees and distance ${zeroPad((Math.round(compute_distance(pow_ois.position, this.position)*100)/100).toFixed(2),3)} units from pow<br>`);
  return state;
    
  };
  this.set_target_speed = function(target_speed){
    this.target_speed = target_speed;
  };
  this.draw_state = function(){
    draw_position(this.position, this.base_size);
    space_context.font="10px Arial";
    space_context.fillText(this.name,this.position[0]+5,space.height-this.position[1]+5);
    space_context.fillText(this.classification + " " + this.type,this.position[0]+5,space.height-this.position[1]+15);
    draw_heading_and_speed(this.position, this.current_heading, this.current_speed);
    if(this.target_heading != this.current_heading || this.target_speed != this.current_speed){
      draw_target_heading_and_speed(this.position, this.target_heading, this.target_speed);
    }
    if (this.firing_arcs_visible){
      draw_firing_arcs(this.position, this.current_heading, 300);
    }
    if (this.flexible_range_ring_range > 0){
      draw_range_ring(this.position, this.flexible_range_ring_range);
    }
    if (this.range_rings_visible){
      draw_all_range_rings(this.position, this.range_rings);
    }
    if (this.movement_history_visible){
      draw_movement_history(this.movement_history);
    }
  };
} //end of ois class

function adjust_bearing(bearing){ 
  // Use either modulo or while to assure correctness when bearing > 720
  if (bearing < 0) return  360 + bearing;
  else if (bearing > 359) return bearing - 360;
  return bearing;
}

//computes distance between two points
function compute_distance(point_a, point_b) { 
  return Math.sqrt(Math.pow(point_a[0]-point_b[0],2) + Math.pow(point_a[1]-point_b[1],2));
}

//computes distance between two ois
function compute_ois_distance(ois_a, ois_b) { 
  return compute_distance(ois_a.position, ois_b.position);
}

//computes (true) bearing between two points
function compute_bearing(point_a, point_b) { 
  var temp = 90-(180/Math.PI)*Math.atan2(point_b[1]-point_a[1], point_b[0]-point_a[0]);
  if (temp < 0) return temp += 360;
  else return temp;
}
            
//computes (true) bearing between two ois
function compute_ois_bearing(ois_a, ois_b) { 
  return compute_bearing(ois_a.position, ois_b.position);
}

//advances the global clock by ticks
function advance_global_clock(ticks) {
  for (var a=0;a<ticks;a++){
    global_clock++;
    //displays clock
    draw_clock();
    advance_clock_all_ois(1);
    update_log_state_all_ois();
    draw_state_all_ois();
    }
  save_state(current_seed);
}

function draw_clock(){
  document.getElementById('clock').innerHTML = `Time: ${zeroPad(Math.floor(global_clock/3600),2)}:${zeroPad(Math.floor(global_clock%3600/60),2)}:${zeroPad(Math.floor(global_clock%60),2)}`;
}

//advances the clock of all ois by ticks might be update instead
function advance_clock_all_ois(ticks){
for (var b=0;b<space_objects.length;b++){ 
      space_objects[b].advance_clock(ticks);
   }
}

//prints the state of all ois
function update_log_state_all_ois(){
  //$('.state').remove(); //clears all states
  for (var b=0;b<space_objects.length;b++){ 
    //$('#log').append("<div class='state' id='object_" + b +"'></div>");
    $(`#object_${b}`).empty();
    $(`#object_${b}`).append(`#${b} `);
    $(`#object_${b}`).append(space_objects[b].givestate(space_objects[pow_nr]));
    if (space_objects[b].thrusters_firing) $(`#object_${b}`).append('<span class="blink" style="color: red">  THRUSTERS!  </span>');
    if (space_objects[b].boosters_firing) $(`#object_${b}`).append('<span class="blink" style="color: red">  BOOSTERS!  </span>');
    //$('#log').append("<div class='control_buttons' id='control_buttons_for_object_" + b +"'></div>");  
    //print_object_control_buttons(b);
    
  }
}

function update_log(){
$('#log').empty();
  for (var b=0;b<space_objects.length;b++){ 
    $('#log').append(`<div class='state_wrapper' id='sw_object_${b}'></div>`);
    $(`#sw_object_${b}`).append(`<div class='state' id='object_${b}' onclick='toggle_button_visibility(${b})'></div>`);
    $(`#sw_object_${b}`).append(`<div class='control_buttons' id='control_buttons_for_object_${b}'></div>`);
        
    if (space_objects[b].buttons_visible){
      print_object_control_buttons(b);
    }
        
  }
}

function select_map(){
  document.getElementById("space").style.backgroundImage = `url(${document.getElementById("map_selector").value})`;
}

function print_object_control_buttons(id){
  $(`#control_buttons_for_object_${id}`).append(`<button onclick="set_target_speed_from_databox(${id})">New Spd</button>`);
  $(`#control_buttons_for_object_${id}`).append(`<button onclick="set_target_heading_from_databox(${id})">New Heading</button>`);
  $(`#control_buttons_for_object_${id}`).append(`<button onclick="set_pow(${id})">POW</button>`);
  $(`#control_buttons_for_object_${id}`).append(`<button onclick="toggle_firing_arcs_visible(${id})">Arcs</button>`);
  $(`#control_buttons_for_object_${id}`).append(`<button onclick="toggle_movement_history_visible(${id})">History</button>`);
  $(`#control_buttons_for_object_${id}`).append(`<button onclick="toggle_thrusters_firing(${id})">Thrusters</button>`);
  
  $(`#control_buttons_for_object_${id}`).append(`<button onclick="toggle_boosters_firing(${id})">Boosters</button>`);
  
  $(`#control_buttons_for_object_${id}`).append(`<button onclick="delete_space_object(${id})">Remove</button><br>`); //here be linebreak!
  $(`#control_buttons_for_object_${id}`).append(`<button onclick="set_flexible_range_ring_range_from_databox(${id})">Set Ring</button>`);
  $(`#control_buttons_for_object_${id}`).append(`<button onclick="sap_speed(${id})">Sap Spd</button>`);
  $(`#control_buttons_for_object_${id}`).append(`<button onclick="toggle_range_rings(${id})">Ranges</button>`);
  $(`#control_buttons_for_object_${id}`).append(`<button onclick="halt_turn_and_acc(${id})">Halt</button>`);
  
  $(`#control_buttons_for_object_${id}`).append(`<button onclick="change_target_speed(${id},-5)">TS-5</button>`);
  $(`#control_buttons_for_object_${id}`).append(`<button onclick="change_target_speed(${id},5)">TS+5</button>`);
  $(`#control_buttons_for_object_${id}`).append(`<button onclick="change_target_heading(${id},-5)">TH-5</button>`);
  $(`#control_buttons_for_object_${id}`).append(`<button onclick="change_target_heading(${id},5)">TH+5</button>`);
  $(`#control_buttons_for_object_${id}`).append(`<button onclick="fire_torpedo(${id})">Torp</button>`);
  $(`#control_buttons_for_object_${id}`).append(`<button onclick="send_to_form(${id})">Edit</button>`);

  if (id > 0) {
    print_tracking_buttons(id);
  }
  
}

//prints the tracking buttons
function print_tracking_buttons(id) {
  $(`#control_buttons_for_object_${id}`).append(`<br><input type="checkbox" id="trackbutton_${id}" onclick="update_tracking_for_object(${id})">Track`); //here be linebreak!
  if (space_objects[id].tracked) {
    document.getElementById(`trackbutton_${id}`).checked = true;
  }
  $(`#control_buttons_for_object_${id}`).append(`<input type="checkbox" id="namebutton_${id}" onclick="update_tracking_for_object(${id})">Name`);
  if (space_objects[id].identity_known) {
    document.getElementById(`namebutton_${id}`).checked = true;
  }
  $(`#control_buttons_for_object_${id}`).append(`<input type="checkbox" id="classbutton_${id}" onclick="update_tracking_for_object(${id})">Class`);
  if (space_objects[id].class_known) {
    document.getElementById(`classbutton_${id}`).checked = true;
  }
  $(`#control_buttons_for_object_${id}`).append(`<input type="checkbox" id="typebutton_${id}" onclick="update_tracking_for_object(${id})">Type`);
  if (space_objects[id].type_known) {
    document.getElementById(`typebutton_${id}`).checked = true;
  }
  $(`#control_buttons_for_object_${id}`).append(`<input type="checkbox" id="bearingbutton_${id}" onclick="update_tracking_for_object(${id})">Bearing`);
  if (space_objects[id].bearing_known) {
    document.getElementById(`bearingbutton_${id}`).checked = true;
  }
  $(`#control_buttons_for_object_${id}`).append(`<input type="checkbox" id="rangebutton_${id}" onclick="update_tracking_for_object(${id})">Range`);
  if (space_objects[id].range_known) {
    document.getElementById(`rangebutton_${id}`).checked = true;
  }
  $(`#control_buttons_for_object_${id}`).append(`<input type="checkbox" id="speedbutton_${id}" onclick="update_tracking_for_object(${id})">Speed`);
  if (space_objects[id].speed_known) {
    document.getElementById(`speedbutton_${id}`).checked = true;
  }
  $(`#control_buttons_for_object_${id}`).append(`<input type="checkbox" id="headingbutton_${id}" onclick="update_tracking_for_object(${id})">Heading`);
  if (space_objects[id].heading_known) {
    document.getElementById(`headingbutton_${id}`).checked = true;
  }
  $(`#control_buttons_for_object_${id}`).append(` <select id="threatbutton_${id}" onchange="update_tracking_for_object(${id})"><option value="uncertain">uncertain</option><option value="neutral">Neutral</option><option value="friendly">Friendly</option><option value="hostile">Hostile</option><option value="alert">Alert</option><option value="inert">Inert</option></select>`);
  document.getElementById(`threatbutton_${id}`).value = space_objects[id].threat;
}

function update_tracking_for_object(id){
  space_objects[id].tracked = document.getElementById(`trackbutton_${id}`).checked;
  space_objects[id].class_known = document.getElementById(`classbutton_${id}`).checked;
  space_objects[id].type_known = document.getElementById(`typebutton_${id}`).checked;
  space_objects[id].identity_known = document.getElementById(`namebutton_${id}`).checked;
  space_objects[id].bearing_known = document.getElementById(`bearingbutton_${id}`).checked;
  space_objects[id].range_known = document.getElementById(`rangebutton_${id}`).checked;
  space_objects[id].speed_known = document.getElementById(`speedbutton_${id}`).checked;
  space_objects[id].heading_known = document.getElementById(`headingbutton_${id}`).checked;
  space_objects[id].threat = document.getElementById(`threatbutton_${id}`).value;
  
}

function fire_torpedo(id){
	space_objects.push(new ois({
		name: "Torpedo", 
  		classification: "Generic",
      type: "Torpedo", 
  		base_size: 16, 
  		range_rings: [{range: 30,label:"large spread",color:"red"}],
		position: [space_objects[id].position[0],space_objects[id].position[1]],
  		current_speed: 60,
		target_speed: 60,
  		max_speed_delta: 0, 
  		max_heading_delta:0,
		current_heading: document.getElementById("databox").value,
		target_heading: document.getElementById("databox").value,
		max_heading_delta: 5
	}));
	update_log();
	update_log_state_all_ois();
}

function toggle_button_visibility(id) {
  if (space_objects[id].buttons_visible) space_objects[id].buttons_visible = false;
  else space_objects[id].buttons_visible = true;
  update_log();
  update_log_state_all_ois();
}

//turn into method?
function change_target_speed(id, amount){
  space_objects[id].target_speed += parseInt(amount);
}
//turn into method?
function change_target_heading(id, amount){
  space_objects[id].target_heading = adjust_bearing(space_objects[id].target_heading + parseInt(amount));
}

//turn into method?
function halt_turn_and_acc(id){
  space_objects[id].target_heading = space_objects[id].current_heading;
  space_objects[id].target_speed = space_objects[id].current_speed;
}

//turn into method?
function toggle_range_rings(id){
  if (space_objects[id].range_rings_visible) space_objects[id].range_rings_visible = false;
  else space_objects[id].range_rings_visible = true;
}

//turn into method?
function sap_speed(id){
  space_objects[id].current_speed -= 5;
}

//turn into method?
function set_flexible_range_ring_range_from_databox(id){
  space_objects[id].flexible_range_ring_range = document.getElementById("databox").value;
}

//turn into method?
function toggle_boosters_firing(id){
  if (space_objects[id].boosters_firing) space_objects[id].boosters_firing = false;
  else space_objects[id].boosters_firing = true;
}

//turn into method?
function toggle_movement_history_visible(id){
  if (space_objects[id].movement_history_visible) space_objects[id].movement_history_visible = false;
  else space_objects[id].movement_history_visible = true;
}

//turn into method?
function toggle_thrusters_firing(id){
  if (space_objects[id].thrusters_firing) space_objects[id].thrusters_firing = false;
  else space_objects[id].thrusters_firing = true;
}

//turn into method?
function toggle_firing_arcs_visible(id){
  if (space_objects[id].firing_arcs_visible) space_objects[id].firing_arcs_visible = false;
  else space_objects[id].firing_arcs_visible = true;
  update_log_state_all_ois();
}

//turn into method?
function set_target_speed_from_databox(id){
  space_objects[id].target_speed = document.getElementById("databox").value;
  update_log_state_all_ois();
}

//turn into method?
function set_target_heading_from_databox(id){
  space_objects[id].target_heading = document.getElementById("databox").value;
}

//reads ois to form
function read_to_form(form){
  form.name.value = space_objects[form.id.value].name;
  form.classification.value = space_objects[form.id.value].classification;
  form.type.value = space_objects[form.id.value].type;
  form.base_size.value = space_objects[form.id.value].base_size;
  
  form.position_x.value = Math.round(space_objects[form.id.value].position[0]);
  form.position_y.value = Math.round(space_objects[form.id.value].position[1]);
  form.current_speed.value = space_objects[form.id.value].current_speed;
  form.target_speed.value = space_objects[form.id.value].target_speed;
  form.max_speed_delta.value = space_objects[form.id.value].max_speed_delta;
  form.current_heading.value = Math.round(space_objects[form.id.value].current_heading*100)/100;
  form.target_heading.value = space_objects[form.id.value].target_heading;
  form.max_heading_delta.value = space_objects[form.id.value].max_heading_delta;
}

//writes ois from form
function write_to_space_objects(form){
  space_objects[form.id.value].name = form.name.value;
  space_objects[form.id.value].classification = form.classification.value;
  space_objects[form.id.value].type = form.type.value;
  space_objects[form.id.value].base_size = parseInt(form.base_size.value,10);
  space_objects[form.id.value].position[0] = parseInt(form.position_x.value,10); 
  space_objects[form.id.value].position[1] = parseInt(form.position_y.value,10);
  space_objects[form.id.value].current_speed = parseInt(form.current_speed.value,10);
  space_objects[form.id.value].target_speed = parseInt(form.target_speed.value,10);
  space_objects[form.id.value].max_speed_delta = parseInt(form.max_speed_delta.value,10);
  space_objects[form.id.value].current_heading = parseInt(form.current_heading.value,10);
  space_objects[form.id.value].target_heading = parseInt(form.target_heading.value,10);
  space_objects[form.id.value].max_heading_delta = parseFloat(form.max_heading_delta.value,10);
  update_log_state_all_ois();
}

//deletes ois
function delete_space_object(id){
  space_objects.splice(id,1);
  update_log();
  update_log_state_all_ois();
  
}

//creates ois from form
function create_space_object_from_form(form){
  var new_object = {};
  new_object.name = form.name.value;
  new_object.classification = form.classification.value;
  new_object.type = form.type.value;
  new_object.base_size = parseInt(form.base_size.value,10);
  new_object.range_rings = JSON.parse(form.range_rings.value); 
  
  new_object.position = [];
  new_object.position[0] = parseInt(form.position_x.value,10);
  new_object.position[1] = parseInt(form.position_y.value,10);
  new_object.current_speed = parseInt(form.current_speed.value,10);
  new_object.target_speed = parseInt(form.target_speed.value,10);
  new_object.max_speed_delta = parseInt(form.max_speed_delta.value,10);
  new_object.current_heading = parseInt(form.current_heading.value,10);
  new_object.target_heading = parseInt(form.target_heading.value,10);
  new_object.max_heading_delta = parseFloat(form.max_heading_delta.value,10);
  space_objects.push(new ois(new_object));
  update_log();
  update_log_state_all_ois();
  draw_state_all_ois();
}

//sets new point of wiev
function set_pow(pow){
  pow_nr = parseInt(pow,10);
  update_log_state_all_ois();
}

//set new speed
function set_new_target_speed(form){
  space_objects[form.id.value].target_speed = parseInt(form.target_speed.value,10);
  update_log_state_all_ois();
}

//set new target heading
function set_new_target_heading(form){
  space_objects[form.id.value].target_heading = parseInt(form.target_heading.value,10);
  update_log_state_all_ois();
}

function read_to_form_from_database(form, id){
  form.name.value = space_objects_database[id].name;
  form.classification.value = space_objects_database[id].classification;
  form.type.value = space_objects_database[id].type;
  form.range_rings.value = JSON.stringify(space_objects_database[id].range_rings);
  
  form.base_size.value = space_objects_database[id].base_size;
  form.current_speed.value = space_objects_database[id].default_speed;
  form.target_speed.value = space_objects_database[id].default_speed;
  form.max_speed_delta.value = space_objects_database[id].max_speed_delta;
  form.max_heading_delta.value = space_objects_database[id].max_heading_delta;
}

function send_to_form(id){
  document.getElementById("form_id").value = id
  read_to_form(document.getElementById("form_id").form);
}

//prints database
function show_database(){
  $('#database').append("<h3>Object Database</h3>");
  for (var i=0;i<space_objects_database.length;i++){
    var entry = `<div class='database_object' onclick='read_to_form_from_database(document.getElementById(\"inputform\"), ${i})'>#${i} <em>${space_objects_database[i].name}</em> ${space_objects_database[i].classification} ${space_objects_database[i].type} Def Speed: ${space_objects_database[i].default_speed} Max acc/decc: ${space_objects_database[i].max_speed_delta} Turn: ${space_objects_database[i].max_heading_delta}</div>`;
    $('#database').append(entry);
  }
}

//zeropad-function (ignores decimals)
function zeroPad(num, places) {
  var zero = places - Math.floor(num).toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

//my event listeners
$("#start_clock").click(function(){
  clock=setInterval(function(){
    advance_global_clock(1);
  },1000);
});
$("#stop_clock").click(function(){
  clearInterval(clock);
});

document.getElementById("advance_clock_30").addEventListener("click",function() {advance_global_clock(30);} ,false);
document.getElementById("advance_clock_600").addEventListener("click",function() {advance_global_clock(600);} ,false);
document.getElementById("form_id").addEventListener("input",function() {read_to_form(this.form);} ,false);
document.getElementById("create_from_form").addEventListener("click",function() {create_space_object_from_form(this.form);} ,false);
document.getElementById("write_from_form").addEventListener("click",function() {write_to_space_objects(this.form);} ,false);
document.getElementById("delete_object").addEventListener("click",function() {delete_space_object(this.form.id.value);} ,false);
document.getElementById("clear_state").addEventListener("click",function() {clear_state(1);} ,false);
document.getElementById("space_overlay").addEventListener("mousemove",function(e) {print_cursor_position(e);} ,false);
document.getElementById("space_overlay").addEventListener("mousemove",function(e) {display_ruler(e);} ,false);
document.getElementById("space_overlay").addEventListener("click",function(e) {fetch_cursor_position(e);} ,false);
document.getElementById("space_overlay").addEventListener("click",function(e) {set_ruler_origo(e);} ,false);
document.getElementById("space_overlay").addEventListener("click",function(e) {select_from_click(e);} ,false);

function select_from_click(e){
  var coordinates = [e.layerX,space_overlay.height-e.layerY];
  console.log(coordinates);
  if (!e.shiftKey && !e.altKey && closest_ois_within_distance(coordinates, 12) != "none"){ //click distance here!
    document.getElementById("form_id").value = closest_ois_within_distance(coordinates, 12); //and here!
    read_to_form(document.getElementById("form_id").form);
  }
}

//checks which ois id is closest to coordinates and within distance
function closest_ois_within_distance(coordinates,distance){
  var distances_to_coordinates = [];
  var closest = 0;
  for (var id=0;id<space_objects.length;id++){
    distances_to_coordinates[id] = compute_distance(coordinates, space_objects[id].position);
  }
  for (var i=0;i<distances_to_coordinates.length;i++){
    if (distances_to_coordinates[closest] > distances_to_coordinates[i]){
      closest = i;
    }
  }
  if (distances_to_coordinates[closest] <= distance) return closest;
  else return "none";
}

function set_ruler_origo(e){
  
  if (e.shiftKey) { 
    ruler_origo = [e.layerX,space_overlay.height-e.layerY];
    space_overlay_context.clearRect(0,0,space_overlay.height,space_overlay.width);
  }
  else ruler_origo = [];
}

//displays the ruler
function display_ruler(e){
  if (ruler_origo.length > 0){
    //space_overlay_context.clearRect(0,0,space_overlay.height,space_overlay.width);
    draw_ruler(ruler_origo,[e.layerX,space_overlay.height-e.layerY]);
  }
}

//prints the position of the mouse cursor - 
function print_cursor_position(e){
  
  $('#mouse_coordinates').empty();
  $('#mouse_coordinates').append(`Coordinates: ${zeroPad((e.layerX),4)},${zeroPad((space.height-e.layerY),4)}   `);
}

//fetches the position of the mouse cursor to the form
function fetch_cursor_position(e){
  if (e.altKey) { 
    document.getElementById("inputform").position_x.value = (e.layerX);
    document.getElementById("inputform").position_y.value = (space.height-e.layerY);
  }
}

//draws a position marker
function draw_position(position, base_size){
  space_context.strokeStyle="black";
  space_context.beginPath();
  space_context.arc(position[0],space.height-position[1],1,0,2*Math.PI);
  space_context.stroke();
  space_context.beginPath();
  space_context.arc(position[0],space.height-position[1],base_size,0,2*Math.PI);         //default base_size goes here!
  space_context.stroke();
}

//draws movement history
function draw_movement_history(movement_history){
  for (var i=0;i<movement_history.length;i++){
    space_context.strokeStyle="black";
    space_context.beginPath();
    space_context.arc(movement_history[i][0],space.height-movement_history[i][1],1,0,2*Math.PI);
    space_context.stroke();
    space_context.fillText(zeroPad(Math.floor(movement_history[i][2]/3600),2) + ":" + zeroPad(Math.floor(movement_history[i][2]%3600/60),2), movement_history[i][0]+5,space.height-movement_history[i][1]+5);

  }
}

//draws the movement "arrow"
function draw_heading_and_speed(position, heading, speed){
 space_context.strokeStyle="black";
 space_context.moveTo(position[0],space.height-position[1]);
 var x=speed*Math.sin(Math.PI/180*heading) + position[0];
 var y=space.height-(speed*Math.cos(Math.PI/180*heading) + position[1]);
 space_context.lineTo(x,y);
 space_context.stroke();
}

//draws target movement "arrow"
function draw_target_heading_and_speed(position, heading, speed){
 space_context.moveTo(position[0],space.height-position[1]);
 var x=speed*Math.sin(Math.PI/180*heading) + position[0];
 var y=space.height-(speed*Math.cos(Math.PI/180*heading) + position[1]);
 space_context.lineTo(x,y);
 space_context.strokeStyle="green";
 space_context.stroke();
 space_context.strokeStyle="black";
}

//draws the state of all ois
function draw_state_all_ois(){
  space_context.clearRect(0,0,space.height,space.width);
  draw_space_grid();
  for (var i=0;i<space_objects.length;i++){
    space_objects[i].draw_state();
  }
}

//draws ruler onto the overlay
function draw_ruler(origo,target){
  space_overlay_context.clearRect(0,0,space_overlay.height,space_overlay.width);
  
  var distance = compute_distance(origo,target);
  var bearing = compute_bearing(origo,target);
  space_overlay_context.beginPath();
  space_overlay_context.arc(origo[0],space.height-origo[1],distance,0,2*Math.PI);
  space_overlay_context.moveTo(origo[0],space_overlay.height-origo[1]);
  space_overlay_context.lineTo(target[0],space_overlay.height-target[1]);
  space_overlay_context.font="16px Arial";
  space_overlay_context.fillStyle="red";
  space_overlay_context.fillText(distance.toFixed(0) +"vu " + bearing.toFixed(1) + " deg", target[0]+5,space_overlay.height-target[1]-5);
  space_overlay_context.fillStyle="black";
  space_overlay_context.stroke();
}

//draws firing arcs
function draw_firing_arcs(position, heading, range){
  var lower_left_x = find_point_from_polar(position,heading+225,range)[0];
  var lower_left_y = find_point_from_polar(position,heading+225,range)[1];
  var upper_right_x = find_point_from_polar(position,heading+45,range)[0];
  var upper_right_y = find_point_from_polar(position,heading+45,range)[1];
  var upper_left_x = find_point_from_polar(position,heading+315,range)[0];
  var upper_left_y = find_point_from_polar(position,heading+315,range)[1];
  var lower_right_x = find_point_from_polar(position,heading+135,range)[0];
  var lower_right_y = find_point_from_polar(position,heading+135,range)[1];
  var fore_x = find_point_from_polar(position,heading,range-100)[0];
  var fore_y = find_point_from_polar(position,heading,range-100)[1];
  var starboard_x = find_point_from_polar(position,heading+90,range-100)[0];
  var starboard_y = find_point_from_polar(position,heading+90,range-100)[1];
  var aft_x = find_point_from_polar(position,heading+180,range-100)[0];
  var aft_y = find_point_from_polar(position,heading+180,range-100)[1];
  var port_x = find_point_from_polar(position,heading+270,range-100)[0];
  var port_y = find_point_from_polar(position,heading+270,range-100)[1];
  space_context.moveTo(lower_left_x,space.height-lower_left_y);
  space_context.lineTo(upper_right_x,space.height-upper_right_y);
  space_context.moveTo(upper_left_x,space.height-upper_left_y);
  space_context.lineTo(lower_right_x,space.height-lower_right_y);
  space_context.font="10px Arial";
  space_context.fillText("Fore", fore_x,space.height-fore_y);
  space_context.fillText("Aft", aft_x,space.height-aft_y);
  space_context.fillText("Port", port_x,space.height-port_y);
  space_context.fillText("Starboard", starboard_x,space.height-starboard_y);
  space_context.stroke();
  space_context.beginPath();
  space_context.arc(position[0],space.height-position[1],range,0,2*Math.PI);
  space_context.stroke();
}

function find_point_from_polar(origo,bearing,distance){
  var point = [];
  point[0] = (distance*Math.sin(Math.PI/180*bearing)) + origo[0];
  point[1] = (distance*Math.cos(Math.PI/180*bearing)) + origo[1];
  return point;
}

//draws a range ring of color with a label
function draw_range_ring_with_label(position, range, label, color){
  space_context.beginPath();
  space_context.arc(position[0],space.height-position[1],range,0,2*Math.PI);
  space_context.strokeStyle=color;
  space_context.stroke();
  space_context.strokeStyle="black";
  space_context.font="10px Arial";
  space_context.fillText(label, position[0],space.height-position[1]-range+3);
}

//draws all range rings
function draw_all_range_rings(position, range_rings){
  for (var i=0;i<range_rings.length;i++){
    draw_range_ring_with_label(position, range_rings[i].range,range_rings[i].label,range_rings[i].color);
  }
}

//draws a "neutral" range ring
function draw_range_ring(position, range){
  space_context.beginPath();
  space_context.arc(position[0],space.height-position[1],range,0,2*Math.PI);
  space_context.stroke();
}

//gives the canvas a grid
function draw_space_grid(){
  //Horisontal lines
  for (var x = 0.5; x < space.width; x += 100) {
    space_context.moveTo(x, 0);
    space_context.lineTo(x, space.height);
  }
  //vertical lines
  for (var y = 0.5; y < space.height; y += 100) {
    space_context.moveTo(0, y);
    space_context.lineTo(space.width, y);
  }
  space_context.strokeStyle="#eee";
  space_context.stroke();
  space_context.strokeStyle="black";
}

//sends the state of the engine to the server
function save_state(seed){
  //console.log(space_objects[0]);
  $.post(`/state/${seed}`,{pow_nr: pow_nr, global_clock: global_clock, space_objects: JSON.stringify(space_objects)}, () => {
    //console.log("state saved");
  } );;  
  
}

//asks the server for the state of the engine
function load_state(seed){
  $.get(`/state/${seed}`, function(data){
     
    if (data.pownr) {pow_nr = data.pow_nr}; 
    if (data.global_clock) {global_clock = data.global_clock};
    if (data.space_objects) {
      data.space_objects = JSON.parse(data.space_objects);
      //why is this necessary?
      for (var i=0;i<data.space_objects.length;i++){
      space_objects[i] = new ois(data.space_objects[i]);
      }
    }
    draw_clock();
    update_log();
    update_log_state_all_ois();
    draw_state_all_ois();
    
  });
   
}

function clear_state(){
  console.log("State cleared!")
  space_objects = [];
  space_objects[0] = new ois({
    name: "Concordia", 
    classification: "Cobra",
    type: "Destroyer",
    base_size: 16, 
    range_rings: [{range: 100, label: "Lookout", color: "blue"}, {range: 300, label: "Macrocannon", color: "red"}], 
    position: [400,100], 
    current_speed: 20, 
    target_speed: 20, 
    max_speed_delta: 2, 
    current_heading:0, 
    target_heading:0, 
    max_heading_delta: 5
  });
  global_clock = 0;
  draw_clock();
  update_log();
  update_log_state_all_ois();
  draw_state_all_ois();
}

//displays a cute little box to make sure the canvas is working properly
space_context.fillRect(100,100,10,10);

/*

Bug log:

-drawning errors
-nan exceptions when using +/- buttons

To do:

  Big:
    -"from database" constructor?
    -code layout/organisation
    -self-updating method?
    -general interaction design work?
  
    
  Smaller:
    -heading from ruler
    -range rings from database (form element?)   
        
    -on input change for ships?
    -formatting of "inputform"
    -timer(s)?
    
    
  

-color and symbol toggle?

-add properties and set up inheritance from database class:
  -symbol
  -symbol_color
  -booster capacity

-put "blast marker" into dbase +other stellar phenomena?

-longer speed/heading line? (+x? x2 x10?)

-space object(?) (contains clock + array + which object is in focus)
	clock_count
	array of objects_in_space
	pow nr
    events?
    non ois draws?
    background image?
    
Optionals/possibilities:
  -strip one decimal from bearings?
    
  -introduce active/passive property + button?
    
  -gravity/drift?


*/
