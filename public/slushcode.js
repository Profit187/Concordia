//from script_ois_control.js

function draw_triangle(position, heading, size) {
  var top_x = find_point_from_polar(position,heading,size)[0];
  var top_y = find_point_from_polar(position,heading,size)[1];
  var lower_left_x = find_point_from_polar(position,heading+240,size)[0];
  var lower_left_y = find_point_from_polar(position,heading+240,size)[1];
  var lower_right_x = find_point_from_polar(position,heading+120,size)[0];
  var lower_right_y = find_point_from_polar(position,heading+120,size)[1];
  space_context.moveTo(top_x,space.height-top_y);
  space_context.lineTo(lower_right_x,space.height-lower_right_y);
  space_context.lineTo(lower_left_x,space.height-lower_left_y);
  space_context.lineTo(top_x,space.height-top_y);
  space_context.stroke();
}

function draw_halfarc_top (position, size, color){
space_context.beginPath();
  space_context.arc(position[0],space.height-position[1],size,Math.PI,0);
  space_context.strokeStyle=color;
  space_context.stroke();
  space_context.strokeStyle="black";
}

function draw_halfarc_bottom (position, size, color){
  space_context.beginPath();
  space_context.arc(position[0],space.height-position[1],size,Math.PI,0,true);
  space_context.strokeStyle=color;
  space_context.stroke();
  space_context.strokeStyle="black";
}

function draw_halfbox_top(position,size,color){
  space_context.strokeStyle = color;
  space_context.moveTo(position[0]-size,space.height-position[1]);
  space_context.lineTo(position[0]-size,space.height-position[1]-size);
  space_context.lineTo(position[0]+size,space.height-position[1]-size);
  space_context.lineTo(position[0]+size,space.height-position[1]);
  space_context.stroke();
  space_context.strokeStyle = "black";
}

function draw_halfbox_bottom(position,size,color){
  space_context.strokeStyle = color;
  space_context.moveTo(position[0]-size,space.height-position[1]);
  space_context.lineTo(position[0]-size,space.height-position[1]+size);
  space_context.lineTo(position[0]+size,space.height-position[1]+size);
  space_context.lineTo(position[0]+size,space.height-position[1]);
  space_context.stroke();
  space_context.strokeStyle = "black";
}

function draw_rhomboid(position,size,color){
  space_context.strokeStyle = color;
  space_context.moveTo(position[0]-size,space.height-position[1]);
  space_context.lineTo(position[0],space.height-position[1]-size);
  space_context.lineTo(position[0]+size,space.height-position[1]);
  space_context.lineTo(position[0],space.height-position[1]+size);
  space_context.lineTo(position[0]-size,space.height-position[1]);
  space_context.stroke();
  space_context.strokeStyle = "black";
}

function draw_halfrhomboid_top(position,size,color){
  space_context.strokeStyle = color;
  space_context.moveTo(position[0]-size,space.height-position[1]);
  space_context.lineTo(position[0],space.height-position[1]-size);
  space_context.lineTo(position[0]+size,space.height-position[1]);
  space_context.stroke();
  space_context.strokeStyle = "black";
}

function draw_halfrhomboid_bottom(position,size,color){
  space_context.strokeStyle = color;
  space_context.moveTo(position[0]-size,space.height-position[1]);
  space_context.lineTo(position[0],space.height-position[1]+size);
  space_context.lineTo(position[0]+size,space.height-position[1]);
  space_context.stroke();
  space_context.strokeStyle = "black";
}