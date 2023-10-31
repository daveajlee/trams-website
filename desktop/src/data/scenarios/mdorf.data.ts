import {Scenario} from "../../app/shared/scenario.model";
import {SuppliedVehicles} from "../../app/vehicles/suppliedvehicle.model";
import {VehicleModel} from "../../app/vehicles/vehiclemodel.model";

// Map of the scenario.
const MAP = "mdorf-map-picture.jpg";

// Name of the scenario.
const NAME = "MDorf";

// Description of the scenario.
const DESC = "Millenium Dorf City is a small city. The city council are prepared to work with you providing that you can meet their targets within their timescales."

// Targets of the scenario.
const TARGETS = ["Serve all bus stops in MDorf.", "Ensure a frequent service on all routes.", "Ensure that passenger satisfaction remains above 35% at all times."];

// The minimum satisfaction rating needed for this scenario.
const MINIMUM_SATISFACTION= 35;

// The type and number of supplied vehicles.
const SUPPLIED_VEHICLES = [new SuppliedVehicles("Bus", new VehicleModel("MyBus Single Decker", 'Single Decker Bus',44, 36, 85000.0, 'assets/Bus.jpg'), 3)];

// The supplied drivers for this scenario.
const SUPPLIED_DRIVERS = ["Max Mustermann","Robert Mustermann","Daniela Mustermann"];

// The names and distances of stops of this scenario.
const STOP_DISTANCES =["City Lake:0,7,3,14,12,12,10,7,18,23,24,10,15,9,11,21,25,22,18,21,9,17,18,11,19,13,10,7,12,14,17,9,14,13,23,16,14,12,14,11,18,13,18,17,10,11,2,4,5,7",
    "City Circle:7,0,4,11,9,15,8,9,16,24,23,4,10,13,15,16,26,25,19,18,13,18,19,8,6,8,16,13,15,15,14,13,16,15,25,20,18,16,18,15,20,15,21,21,13,8,4,6,7,9",
    "Park South:3,4,0,9,7,10,6,5,14,21,20,7,13,6,8,19,23,22,16,14,7,15,16,8,21,11,9,6,10,11,15,7,12,11,20,14,12,10,12,9,16,11,16,16,8,7,6,8,9,11",
    "Park Street:14,11,9,0,2,14,10,8,13,9,8,9,10,6,8,9,12,11,7,12,7,6,7,6,7,10,15,12,10,9,6,8,7,2,10,25,23,21,23,20,3,4,10,10,4,7,8,10,11,13",
    "Hospital:12,9,7,2,0,13,9,7,12,8,7,8,9,4,6,10,14,13,8,15,5,7,9,5,8,9,13,10,8,8,6,7,8,2,11,23,21,19,21,18,4,5,11,11,5,6,10,12,13,15",
    "Ring Road (Park):12,15,10,14,0,13,8,4,4,24,23,15,23,13,12,25,30,30,21,27,13,27,28,19,20,23,6,8,12,15,23,14,19,19,21,12,10,8,10,9,23,18,16,16,18,17,12,14,15,14",
    "Park West:10,8,6,10,9,8,0,5,4,12,11,9,17,4,3,17,22,22,13,19,9,18,19,11,12,16,14,11,5,8,11,2,7,7,11,16,14,12,14,11,15,7,9,9,7,11,14,16,17,16",
    "Ring Road (West):7,9,5,8,7,4,5,8,15,0,14,12,20,17,16,21,26,25,17,21,7,22,23,15,16,17,4,1,12,15,17,8,13,11,16,12,10,8,10,7,19,13,12,12,13,14,10,12,13,12",
    "Stadium:18,16,14,13,12,4,4,8,16,0,15,18,26,17,16,21,26,26,17,23,11,22,23,15,16,21,10,11,6,9,19,8,13,15,14,17,15,13,15,14,19,13,12,12,13,19,11,13,14,10",
    "Stadium East:23,24,21,9,8,24,12,15,16,2,0,25,30,15,14,22,3,2,8,24,15,7,6,18,5,18,24,21,9,7,12,9,5,8,2,35,33,31,33,30,6,5,5,5,5,18,11,13,14,10",
    "Stadium South:24,23,20,8,7,23,11,14,15,2,28,32,16,0,15,24,4,4,9,26,15,8,7,19,6,19,25,22,8,6,13,8,6,9,1,34,32,30,32,29,7,6,3,3,6,19,12,14,15,11",
    "Leisure Arena:10,4,7,9,8,15,9,12,18,25,28,8,9,10,16,21,0,20,15,6,7,15,16,4,15,4,13,10,16,16,8,11,12,10,15,23,21,19,21,18,17,13,15,15,13,3,13,15,16,13",
    "Ring Road (South West):15,10,13,10,9,23,17,20,26,30,32,8,11,13,9,19,0,18,6,14,9,7,8,6,14,4,19,16,17,17,3,13,14,12,17,28,26,24,26,23,12,8,13,13,8,8,15,17,18,16",
    "South Junction:9,13,6,6,4,13,4,17,17,15,16,8,11,2,14,19,18,10,0,16,1,12,13,7,10,9,10,7,6,5,8,5,7,7,11,14,12,10,12,9,8,2,7,7,2,6,16,18,19,14",
    "Park Avenue:11,15,8,8,6,12,3,16,16,14,15,10,13,2,16,17,16,11,18,0,3,13,14,8,10,10,10,7,5,4,9,3,6,6,10,15,13,11,13,10,9,3,8,8,3,7,14,16,17,16",
    "Ring Way Junction:21,16,19,9,10,25,17,21,21,22,24,16,9,14,16,10,8,4,3,13,0,3,2,7,8,12,22,19,14,13,4,16,14,12,16,25,23,21,23,20,6,11,16,16,11,10,18,20,21,17",
    "Industrial Estate:25,26,23,12,14,30,22,26,26,3,4,21,19,19,17,10,1,9,13,16,8,0,7,20,6,18,24,21,9,8,13,14,12,14,2,37,35,33,35,32,8,9,5,5,9,20,16,18,19,18",
    "Ring Way East:22,25,22,11,13,30,22,25,26,2,4,20,18,18,16,8,1,7,11,15,7,6,19,0,4,16,23,20,11,10,11,13,11,13,3,35,33,31,33,30,7,10,6,6,10,19,14,16,17,16",
    "Main Street (Ring Way):18,19,16,7,8,21,13,17,17,8,9,15,6,10,11,4,9,7,6,12,4,3,9,4,11,18,0,15,14,13,8,12,10,12,7,31,29,27,29,26,5,12,11,11,12,15,11,13,14,12",
    "Main Street:21,18,14,12,15,27,19,21,23,24,26,6,14,16,18,3,13,11,6,16,6,5,10,10,9,0,21,18,18,16,5,16,14,17,19,30,28,26,28,25,11,15,19,19,15,12,9,11,12,13",
    "Circle Street:9,13,7,7,5,13,9,7,11,15,15,7,9,1,3,13,16,15,12,16,12,13,5,9,8,11,8,9,9,0,10,7,7,4,13,18,16,14,16,13,8,5,8,8,5,3,11,13,14,15",
    "M Junction:17,18,15,6,8,27,18,22,22,7,8,15,7,12,13,3,8,7,4,6,12,1,7,5,9,17,14,14,12,0,2,12,10,7,13,26,24,22,24,21,5,8,12,12,8,8,13,15,16,17",
    "Circle Avenue:18,19,16,7,9,28,19,23,23,6,7,16,8,13,14,2,7,6,3,5,13,1,8,4,10,18,15,15,13,3,0,13,11,8,12,27,25,23,25,22,6,9,13,13,9,9,7,9,10,11",
    "Post Office:11,8,8,6,5,19,11,15,15,18,19,4,6,7,8,7,20,19,9,10,5,7,8,9,3,9,6,10,10,6,10,11,6,0,14,19,17,15,17,14,10,8,11,11,8,1,5,7,8,9",
    "Mdorf Bank:19,16,21,7,8,20,12,16,16,5,6,15,14,10,10,8,6,4,4,10,9,5,4,9,15,21,18,8,6,8,8,6,5,4,0,28,26,24,26,23,2,6,7,7,6,11,6,8,9,10",
    "City Centre:13,8,11,10,9,23,16,17,21,18,19,4,4,9,10,12,18,16,11,9,8,9,10,3,15,12,9,15,15,7,12,13,0,11,17,25,23,21,23,20,14,13,14,14,13,3,5,7,8,10",
    "Circle & Main Street:10,16,9,15,13,6,14,4,10,24,25,13,19,10,10,22,24,23,18,21,11,17,18,9,21,12,3,13,15,17,11,0,14,14,19,8,6,4,6,4,17,15,15,15,15,15,7,9,10,11",
    "Ring Way East Junction:7,13,6,12,10,8,11,1,11,21,22,10,16,7,7,19,21,20,15,18,8,14,15,6,18,9,3,11,13,15,9,12,12,17,0,10,8,6,8,4,14,12,12,12,12,13,9,11,12,13",
    "Ring Way East:12,15,10,10,9,12,5,12,6,9,8,16,17,6,5,14,9,11,14,18,9,14,15,10,8,15,13,11,5,15,3,6,9,7,17,15,0,13,15,12,15,8,5,5,8,11,8,10,11,14",
    "Circle Road:14,15,11,9,8,15,8,15,9,7,6,16,17,5,4,13,8,10,13,16,9,12,13,10,6,15,15,13,5,13,3,3,6,8,17,15,13,0,15,12,13,4,4,4,4,10,7,9,10,13",
    "Airport West:17,14,15,6,6,23,11,17,19,12,13,8,3,8,9,4,13,11,8,5,10,2,3,6,8,7,17,15,15,13,11,14,12,11,30,28,26,0,28,25,8,15,16,16,15,6,4,6,7,9",
    "Forest:9,13,7,8,7,14,2,8,8,9,8,11,13,5,3,16,14,13,12,16,7,12,13,10,8,12,11,9,3,3,11,5,7,9,15,13,11,13,10,15,0,6,7,7,6,8,12,14,15,17",
    "Expressway:14,16,12,7,8,19,7,13,13,5,6,12,14,7,6,14,12,11,10,14,7,10,11,11,6,13,14,12,6,3,14,5,5,7,34,32,30,32,29,7,0,3,3,3,3,9,14,16,17,18",
    "Ring (South East):13,15,11,2,2,19,7,11,15,8,9,10,12,7,6,12,14,13,12,17,4,7,8,6,5,11,14,12,9,6,12,7,5,9,22,20,18,20,17,3,6,8,8,0,6,8,18,20,21,23",
    "Main Street East:23,25,20,10,11,21,11,16,14,2,1,15,17,11,10,16,2,3,7,19,13,13,12,14,4,17,19,17,7,8,11,9,7,9,23,21,19,21,18,9,8,2,2,0,8,13,12,14,15,17",
    "Office Street:16,20,14,25,23,12,16,12,17,35,34,23,28,14,15,25,37,35,31,30,18,26,27,19,28,25,8,10,17,17,30,15,34,22,23,2,4,2,8,23,18,0,20,20,18,15,14,16,17,19",
    "Airport Road:14,18,12,23,21,10,14,10,15,33,32,21,26,12,13,23,35,33,29,28,16,24,25,17,26,23,6,8,15,15,28,13,32,20,21,2,2,2,6,21,16,18,0,18,16,13,16,18,19,21",
    "Airport Terminal:12,16,10,21,19,8,12,8,13,31,30,19,24,10,11,21,33,31,27,26,14,22,23,15,24,21,4,6,13,13,26,11,30,18,19,4,2,2,4,19,14,16,16,14,0,11,18,20,21,23",
    "Cargo Terminal:14,18,12,23,21,10,14,10,15,33,32,21,26,12,13,23,35,33,29,28,16,24,25,17,26,23,6,8,15,15,28,13,32,20,21,2,2,2,4,21,16,18,18,16,0,13,18,20,21,20",
    "Y Street:11,15,9,20,18,9,11,7,14,30,29,18,23,9,10,20,32,30,26,25,13,21,22,14,23,20,4,4,12,12,25,10,29,17,18,8,6,4,4,18,13,15,15,13,10,14,0,16,17,19",
    "Crescent Road:18,20,16,3,4,23,15,19,19,6,7,17,12,8,9,6,8,7,5,11,8,5,6,10,2,14,17,14,15,13,8,15,7,3,9,23,21,19,21,18,7,8,8,7,7,3,5,0,6,8",
    "Ring Road (North):13,15,11,4,5,18,7,13,13,5,6,13,8,2,3,11,9,10,12,15,5,8,9,8,6,13,15,12,8,4,15,6,3,6,8,18,16,14,16,13,7,5,5,3,6,5,7,8,0,9",
    "Crescent Avenue:18,21,16,10,11,16,9,12,12,5,3,15,13,7,8,16,5,6,11,19,8,12,13,11,7,14,15,12,5,4,16,7,3,8,2,20,18,16,18,15,8,5,6,7,8,3,5,6,7,0",
    "Park North:17,21,16,10,11,16,9,12,12,5,3,15,13,7,8,16,5,6,11,19,8,12,13,11,7,14,15,12,5,4,16,7,3,8,2,20,18,16,18,15,8,5,7,6,7,7,6,7,8,0",
    "Office Complex:10,13,8,4,5,18,7,13,13,5,6,13,8,2,3,11,9,10,12,15,5,8,9,8,6,13,15,12,8,4,15,6,3,6,8,18,16,14,16,13,7,3,7,6,4,15,14,15,17,0",
    "Airport Runway:11,8,7,7,6,17,11,14,19,18,19,3,8,6,7,10,20,19,15,12,3,8,9,1,11,3,15,13,11,10,6,8,9,8,13,15,13,11,13,10,7,6,8,7,4,6,5,6,8,0",
    "Sunnyside:2,4,6,8,10,12,14,10,11,11,12,13,15,16,14,18,16,14,11,9,11,13,7,5,6,5,7,9,8,7,4,12,14,18,12,14,16,18,18,14,3,5,3,7,15,6,4,6,15,0",
    "Airport North:4,6,8,10,12,14,16,12,13,13,14,15,17,18,16,20,18,16,13,11,13,15,9,7,8,7,9,11,10,9,6,14,16,20,14,16,18,20,20,16,5,7,5,6,14,5,4,5,14,0",
    "Y Junction:5,7,9,11,13,15,17,13,14,14,15,16,18,19,17,21,19,17,14,12,14,16,10,8,9,8,10,12,11,10,7,15,17,21,15,17,19,21,21,17,6,8,6,7,15,6,6,5,15,0",
    "City Park:7,9,11,13,15,14,16,12,10,10,11,13,16,14,16,17,18,16,12,13,15,17,11,9,10,10,11,13,14,13,9,17,18,23,17,19,21,23,20,19,8,9,7,8,17,8,15,14,15,0"];

// Export scenario.
export const SCENARIO_MDORF = new Scenario(MAP, NAME, DESC, TARGETS, MINIMUM_SATISFACTION,
    SUPPLIED_VEHICLES, SUPPLIED_DRIVERS, STOP_DISTANCES);