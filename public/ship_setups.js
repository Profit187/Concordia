function system(data) {
  this.place = data.place; //1-10
  this.name = data.name; //e.g. "Port Macro Broadside", "Primary Auspex", "Port Shield", 
  this.desc = data.desc; //e.g. "Range 300 VU Strength 8 Standard"
  this.status = "No Status"; // Muzzled/Ready/Reloading/Inoperable
  this.buttons = data.buttons; //e.g. "Muzzle, Reload, Fire"
}

//status setup for ships
var ship_systems = {
  //cobra setup
  cobra: [
  new system({
    place: "left", 
    name: "Dorsal Macrocannon", 
    desc: "Mars-pattern - Range 300 VU, 270 degrees frontal arc", 
    buttons: [{label: "Empty", status: "Empty"}, {label: "Ready", status: "Ready"},{label: "Reloading", status: "<span class=\"blink\" style=\"color:orange\">Reloading</span>"}, {label: "Malfunction", status: "<span class=\"blink\" style=\"color:red\">Malfunction</span>"}]}),
  new system({
    place: "left", 
    name: "Tube I", 
    desc: "Carronaded Gryphonne-pattern Torpedo Tube", 
    buttons: [{label: "Empty", status: "Empty"}, {label: "Loaded: Standard Torpedo", status: "Loaded: Standard Torpedo"},{label: "Reloading", status: "<span class=\"blink\" style=\"color:orange\">Reloading</span>"}, {label: "Malfunction", status: "<span class=\"blink\" style=\"color:red\">Malfunction</span>"}]}),
  new system({
    place: "left", 
    name: "Tube II", 
    desc: "Carronaded Gryphonne-pattern Torpedo Tube", 
    buttons: [
      {label: "Empty", 
      status: "Empty"}, 
      {label: "Loaded: Standard Torpedo", 
      status: "Loaded: Standard Torpedo"},
      {label: "Reloading", 
      status: "<span class=\"blink\" style=\"color:orange\">Reloading</span>"}, 
      {label: "Malfunction", 
      status: "<span class=\"blink\" style=\"color:red\">Malfunction</span>"}]}),
  new system({
    place: "left", 
    name: "Tube III", 
    desc: "Carronaded Gryphonne-pattern Torpedo Tube", 
    buttons: [{label: "Empty", status: "Empty"}, {label: "Loaded: Standard Torpedo", status: "Loaded: Standard Torpedo"},{label: "Reloading", status: "<span class=\"blink\" style=\"color:orange\">Reloading</span>"}, {label: "Malfunction", status: "<span class=\"blink\" style=\"color:red\">Malfunction</span>"}]}),
  new system({
    place: "left", 
    name: "Tube IV", 
    desc: "Carronaded Gryphonne-pattern Torpedo Tube", 
    buttons: [{label: "Empty", status: "Empty"}, {label: "Loaded: Standard Torpedo", status: "Loaded: Standard Torpedo"},{label: "Reloading", status: "<span class=\"blink\" style=\"color:orange\">Reloading</span>"}, {label: "Malfunction", status: "<span class=\"blink\" style=\"color:red\">Malfunction</span>"}]}),
  new system({
    place: "right", 
    name: "Primaris Shield Generator", 
    desc: "Helios-pattern Void Shield", 
    buttons: [{label: "Inactive", status: "Inactive"}, {label: "Active", status: "Active"},{label: "Recharging", status: "<span class=\"blink\" style=\"color:orange\">Recharging</span>"}, {label: "Malfunction", status: "<span class=\"blink\" style=\"color:red\">Malfunction</span>"}]}),
  new system({place: "right", name: "Alpha Auspex Array", desc: "Mark CCI-b Augur Array", buttons: [{label: "Passive Mode", status: "Passive Mode"}, {label: "Active Mode", status: "Active Mode"}, {label: "Jamming", status: "<span class=\"blink\" style=\"color:brown\">Jamming</span>"}, {label: "Malfunction", status: "<span class=\"blink\" style=\"color:red\">Malfunction</span>"}]}),
  new system({
    place: "right", 
    name: "Turret Cluster Prime", 
    desc: "Flamberge-pattern Quad Vulcan Point Defence Battery", 
    buttons: [{label: "Inactive", status: "Inactive"},{label: "Active: Tracking Attack Craft", status: "Active: Tracking Attack Craft"}, {label: "Active: Tracking Torpedoes", status: "Active: Tracking Torpedoes"}, {label: "Reloading", status: "<span class=\"blink\" style=\"color:orange\">Reloading</span>"}, {label: "Malfunction", status: "<span class=\"blink\" style=\"color:red\">Malfunction</span>"}]}),
  new system({
    place: "right", 
    name: "Plasma Reactors Majoris", 
    desc: "Jovian class II Plasma Reactor", 
    buttons: [{label: "Plasma Pressure Nominal", status: "Plasma Pressure Nominal"}, {label: "Alert!", status: "<span class=\"blink\" style=\"color:red\">Alert!</span>"}, {label: "Plasma Pressure Critical", status: "<span class=\"blink\" style=\"color:red\">Plasma Pressure Critical</span>"}, {label: "Reactor Unstable", status: "<span class=\"blink\" style=\"color:orange\">Reactor Unstable</span>"}, {label: "Malfunction", status: "<span class=\"blink\" style=\"color:red\">Malfunction</span>"}]}),
  new system({
    place: "right", 
    name: "Primary Overflow Control", 
    desc: "Reactor overflow ventilation system", 
    buttons: [{label: "Main Valves Open", status: "Main Valves Open"}, {label: "Main Valves Closed: Emergency Valves Open", status: "<span style=\"font-size: 25px\">Main Valves Closed: Emergency Valves Open</span>"}, {label: "Emergency Valve 80%", status: "<span style=\"font-size: 25px\">Main Valves Closed: Emergency Valves 80%</span>"}, {label: "Emergency Valve 60%", status: "<span style=\"font-size: 25px\">Main Valves Closed: Emergency Valves 60%</span>"}, {label: "Emergency Valve 40%", status: "<span style=\"font-size: 25px\">Main Valves Closed: Emergency Valves 40%</span>"}, {label: "Malfunction", status: "<span class=\"blink\" style=\"color:red\">Malfunction</span>"}]}),
],
  //Escort setup
  escort: [new system({ 
      place: "left", 
      name: "Dorsal Macrocannon Battery", 
      desc: "Mars-pattern - Range 300 VU, 270 degrees frontal arc", 
      buttons: [{label: "Empty", status: "Empty"}, {label: "Ready", status: "Ready"},{label: "Reloading", status: "<span class=\"blink\" style=\"color:orange\">Reloading</span>"}, {label: "Malfunction", status: "<span class=\"blink\" style=\"color:red\">Malfunction</span>"}]}),
    
    new system({
      place: "right", 
      name: "Shield Generator Prime", 
      desc: "Venus-pattern Void Shield", 
      buttons: [{label: "Inactive", status: "Inactive"}, {label: "Active", status: "Active"},{label: "Recharging", status: "<span class=\"blink\" style=\"color:orange\">Recharging</span>"}, {label: "Malfunction", status: "<span class=\"blink\" style=\"color:red\">Malfunction</span>"}]}),
    new system({place: "right", name: "Alpha Auspex Array", desc: "Mark CCI-b Augur Array", buttons: [{label: "Passive Mode", status: "Passive Mode"}, {label: "Active Mode", status: "Active Mode"}, {label: "Jamming", status: "<span class=\"blink\" style=\"color:brown\">Jamming</span>"}, {label: "Malfunction", status: "<span class=\"blink\" style=\"color:red\">Malfunction</span>"}]}),
    new system({
      place: "right", 
      name: "Turret Cluster Prime", 
      desc: "Langmesser-pattern Quad Vulcan Point Defence Battery", 
      buttons: [{label: "Active: Tracking Attack Craft", status: "Active: Tracking Attack Craft"}, {label: "Active: Tracking Torpedoes", status: "Active: Tracking Torpedoes"}, {label: "Reloading", status: "<span class=\"blink\" style=\"color:orange\">Reloading</span>"}, {label: "Malfunction", status: "<span class=\"blink\" style=\"color:red\">Malfunction</span>"}]}),
    new system({
      place: "right", 
      name: "Plasma Reactors Majoris", 
      desc: "Titan Mk IV Plasma Reactor", 
      buttons: [{label: "Plasma Pressure Nominal", status: "Plasma Pressure Nominal"}, {label: "Alert!", status: "<span class=\"blink\" style=\"color:red\">Alert!</span>"}, {label: "Plasma Pressure Critical", status: "<span class=\"blink\" style=\"color:red\">Plasma Pressure Critical</span>"}, {label: "Reactor Unstable", status: "<span class=\"blink\" style=\"color:orange\">Reactor Unstable</span>"}, {label: "Malfunction", status: "<span class=\"blink\" style=\"color:red\">Malfunction</span>"}]}),
    //Replace with something more approriate
    new system({
      place: "right", 
      name: "Primary Overflow Control", 
      desc: "Reactor overflow ventilation system", 
      buttons: [{label: "Main Valves Open", status: "Main Valves Open"}, {label: "Main Valves Closed: Emergency Valves Open", status: "<span style=\"font-size: 25px\">Main Valves Closed: Emergency Valves Open</span>"}, {label: "Emergency Valve 80%", status: "<span style=\"font-size: 25px\">Main Valves Closed: Emergency Valves 80%</span>"}, {label: "Emergency Valve 60%", status: "<span style=\"font-size: 25px\">Main Valves Closed: Emergency Valves 60%</span>"}, {label: "Emergency Valve 40%", status: "<span style=\"font-size: 25px\">Main Valves Closed: Emergency Valves 40%</span>"}, {label: "Malfunction", status: "<span class=\"blink\" style=\"color:red\">Malfunction</span>"}]}),
  ],
  //Escort carrier setup
  escort_CV: [],
  //Cruiser setup
  cruiser: [],
  //Carrier setup
  carrier: []
}