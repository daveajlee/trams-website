import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {GameService} from "./shared/game.service";
import {Game} from "./game/game.model";
import {Scenario} from "./shared/scenario.model";
import {SuppliedVehicles} from "./vehicles/suppliedvehicle.model";
import {VehicleModel} from "./vehicles/vehiclemodel.model";
import {Vehicle} from "./vehicles/vehicle.model";
import {Route} from "./routes/route.model";
import {Allocation} from "./allocations/allocation.model";
import {ServiceModel} from "./stops/stop-detail/service.model";
import {ScheduleModel} from "./stops/stop-detail/schedule.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DatePipe]
})
export class AppComponent {

  file: File | null = null;
  title = 'trams-frontend';
  companyName: string;
  playerName: string;
  difficultyLevel: string;
  startingDate: string;
  showOutlet: boolean;
  currentDate = new Date();

  gameService: GameService;

  constructor(public router: Router, private datePipe: DatePipe, private gameService2: GameService) {
    this.difficultyLevel = 'Easy';
    this.startingDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    this.gameService = gameService2;
  }

  onFileInput(files: FileList | null): void {
    if (files) {
      this.file = files.item(0);
    }
  }
  onActivate(event: any): void {
    this.showOutlet = true;
  }

  onDeactivate(event: any): void {
    this.showOutlet = false;
  }

  /**
   * On submission of the start game form, we create a game.
   */
  onStartSubmit(): void {
    this.router.navigate(['scenariolist'], { queryParams: { company: this.companyName,
        playerName: this.playerName, startingDate: this.startingDate, difficultyLevel: this.difficultyLevel } });
  }

  /**
   * On submission of the load game form, we load the game.
   */
  async onLoadSubmit(): Promise<void> {
    // Currently we only support tcs files.
    if ( this.file.name.endsWith(".tcs") ) {
      console.log('We process this in the tcs file');
      await this.onLoadTcsFile(this.file);
      await this.router.navigate(['management']);
    } else {
      alert('This file type is not supported. Please choose another file.');
    }

  }

  /**
   * Load a tcs file.
   * @param file the file to load.
   */
  async onLoadTcsFile(file: File): Promise<void> {
    var fileContent = await this.readFileContent(file);
    var xmlDoc:XMLDocument;
    if (window.DOMParser) {
      // First of all we read the xml document,
      let parser = new DOMParser();
      xmlDoc = parser.parseFromString(fileContent, "text/xml");
      // Now we read the root game element.
      const gameElement = xmlDoc.documentElement;
      // Now we read the child nodes with the operators.
      const operatorElements = gameElement.childNodes;
      for (var i = 0; i < operatorElements.length; i++) {
        // We can ignore all text nodes. Otherwise it will be an operator.
        if (operatorElements.item(i).nodeName != '#text') {
          // Retrieve the name.
          const operatorName: string = operatorElements.item(i).childNodes.item(0).parentElement.attributes.getNamedItem("name").value
          // Save an array for supplied vehicles.
          var suppliedVehicles = [];
          // Save an array for routes.
          var routes = [];
          var stopDistances = [];
          // Go through the child nodes of operator elements.
          for ( var j = 0; j < operatorElements.item(i).childNodes.length; j++ ) {
            if ( operatorElements.item(i).childNodes.item(j).nodeName === 'route' ) {
              // Process the route elements.
              const route = operatorElements.item(i).childNodes.item(j).childNodes;
              var routeObj = new Route();
              routeObj.company = operatorName;
              routeObj.routeNumber = route[0].parentElement.attributes.getNamedItem("number").value;
              // Process the stops.
              const stops = [];
              const routeInfo = route[0].parentElement.children;
              // Go through either outstops, instops and detailsched.
              for ( var m = 0; m < routeInfo.length; m++ ) {
                // The out stops we have to add.
                if ( routeInfo[m].parentElement.children[m].nodeName === 'outstops' ) {
                  var outstops = routeInfo[m].parentElement.children[m].children;
                  for ( var n = 0; n < outstops.length; n++ ) {
                    stopDistances.push(outstops[n].parentElement.children[n].attributes.getNamedItem("name").value
                        + ":" + outstops[n].parentElement.children[n].attributes.getNamedItem("daytime").value
                        + ":" + outstops[n].parentElement.children[n].attributes.getNamedItem("evetime").value);
                  }
                  // Add start and end stop.
                  routeObj.startStop = stopDistances[0].split(":")[0];
                  routeObj.endStop = stopDistances[stopDistances.length-1].split(":")[0];
                }
                // The in stops we only add if they have not yet been added.
                else if ( routeInfo[m].parentElement.children[m].nodeName === 'instops' ) {
                  var instops = routeInfo[m].parentElement.children[m].children;
                  for ( var n = 0; n < instops.length; n++ ) {
                    var instopName = instops[n].parentElement.children[n].attributes.getNamedItem("name").value;
                    var addStop = true;
                    for ( var p = 0; p < stopDistances.length; p++ ){
                      if ( stopDistances[p].startsWith(instopName) ) {
                        addStop = false;
                      }
                    }
                    if ( addStop ) {
                      stopDistances.push(instops[n].parentElement.children[n].attributes.getNamedItem("name").value
                          + ":" + instops[n].parentElement.children[n].attributes.getNamedItem("daytime").value
                          + ":" + instops[n].parentElement.children[n].attributes.getNamedItem("evetime").value);
                    }
                  }
                }
                // Now we start to process the schedules.
                else if ( routeInfo[m].parentElement.children[m].nodeName === 'detailsched' ) {
                  var scheds = routeInfo[m].parentElement.children[m].children;
                  // Store the schedules here.
                  const schedules = [];
                  for ( var a = 0; a < scheds.length; a++ ) {
                    // Read this schedule and service line,
                    var schedId = scheds[a].parentElement.children[a].attributes.getNamedItem("id").value;
                    var serviceId = scheds[a].parentElement.children[a].attributes.getNamedItem("serviceId").value;
                    var startTime = scheds[a].parentElement.children[a].attributes.getNamedItem("startTime").value;
                    var startStop = scheds[a].parentElement.children[a].attributes.getNamedItem("startStop").value;
                    var endDest = scheds[a].parentElement.children[a].attributes.getNamedItem("endDest").value;
                    var times = scheds[a].parentElement.children[a].attributes.getNamedItem("times").value;
                    // Either retrieve the schedule or create a new schedule.
                    var mySchedule = null;
                    for ( var z = 0; z < schedules.length; z++ ) {
                      if ( schedules[z].scheduleId === schedId ) {
                        mySchedule = schedules[z];
                      }
                    }
                    if ( !mySchedule ) {
                      mySchedule = new ScheduleModel(routeObj.routeNumber, schedId);
                      schedules.push(mySchedule);
                    }
                    // Now we create a service for this schedule.
                    const serviceModel = new ServiceModel(serviceId);
                    // Add the start time and stop.
                    serviceModel.addStop(startTime, startTime, startStop);
                    // Determine start position in array.
                    var startPos = 0;
                    for ( var b = 0; b < stopDistances.length; b++ ) {
                       if ( stopDistances[b].startsWith(startStop)) {
                         startPos = b;
                       }
                    }
                    // Now check direction.
                    var outDirection = false;
                    for ( var c = startPos; c < stopDistances.length; c++ ) {
                      if ( stopDistances[c].startsWith(endDest) ) {
                        outDirection = true;
                      }
                    }
                    // Now add the remaining stops and times.
                    if ( outDirection ) {
                      // Set the current time that we are processing.
                      var thisTime = new Date();
                      thisTime.setHours(parseInt(startTime.split(":")[0]));
                      thisTime.setMinutes(parseInt(startTime.split(":")[1]));
                      thisTime.setSeconds(0);
                      for ( var d = (startPos+1); d < stopDistances.length; d++ ) {
                        // Now add the distance to the next stop to the current time.
                        var distanceInMins = parseInt(stopDistances[d].split(":")[(times === 'daytime') ? 1 : 2]) - parseInt(stopDistances[d-1].split(":")[(times === 'daytime') ? 1 : 2]);
                        var nextTime = new Date();
                        // If we go over the hour, then handle appropriately.
                        if ((thisTime.getMinutes() + distanceInMins) > 59) {
                          nextTime.setHours(thisTime.getHours() + 1);
                          nextTime.setMinutes((thisTime.getMinutes() + distanceInMins) % 60);
                        } else {
                          nextTime.setHours(thisTime.getHours());
                          nextTime.setMinutes(thisTime.getMinutes() + distanceInMins);
                        }
                        // Create the stop time.
                        serviceModel.addStop(this.formatTimeAsString(nextTime), this.formatTimeAsString(nextTime), stopDistances[d].split(":")[0]);
                        // Now we set this time to next time and we are done for this loop.
                        thisTime = nextTime;
                      }
                      mySchedule.addService(serviceModel);
                    } else {
                      // Set the current time that we are processing.
                      var thisTime = new Date();
                      thisTime.setHours(parseInt(startTime.split(":")[0]));
                      thisTime.setMinutes(parseInt(startTime.split(":")[1]));
                      thisTime.setSeconds(0);
                      for ( var d = (startPos-1); d >= 0; d-- ) {
                        // Now add the distance to the next stop to the current time.
                        var distanceInMins = parseInt(stopDistances[d+1].split(":")[(times === 'daytime') ? 1 : 2]) - parseInt(stopDistances[d].split(":")[(times === 'daytime') ? 1 : 2]);
                        var nextTime = new Date();
                        // If we go over the hour, then handle appropriately.
                        if ((thisTime.getMinutes() + distanceInMins) > 59) {
                          nextTime.setHours(thisTime.getHours() + 1);
                          nextTime.setMinutes((thisTime.getMinutes() + distanceInMins) % 60);
                        } else {
                          nextTime.setHours(thisTime.getHours());
                          nextTime.setMinutes(thisTime.getMinutes() + distanceInMins);
                        }
                        // Create the stop time.
                        serviceModel.addStop(this.formatTimeAsString(nextTime), this.formatTimeAsString(nextTime), stopDistances[d].split(":")[0]);
                        // Now we set this time to next time and we are done for this loop.
                        thisTime = nextTime;
                      }
                      mySchedule.addService(serviceModel);
                    }
                  }
                  routeObj.schedules = schedules;
                }
              }
              // Process each route element and save it to route db.
              console.log(routeObj);
              routes.push(routeObj);
            } else if ( operatorElements.item(i).childNodes.item(j).nodeName === 'vehicles' ) {
              // Process the vehicles elements.
              const vehicles = operatorElements.item(i).childNodes.item(j).childNodes;
              for ( var k = 0; k < vehicles.length; k++ ) {
                if ( vehicles[k].parentElement.children[k] ) {
                  var model = vehicles[k].parentElement.children[k].attributes.getNamedItem("type").value;
                  var age = parseInt(vehicles[k].parentElement.children[k].attributes.getNamedItem("age").value);
                  var allocation = vehicles[k].parentElement.children[k].attributes.getNamedItem("schedId").value;
                  suppliedVehicles.push(new SuppliedVehicles("Bus",
                      new VehicleModel(model, allocation, (model === 'Single') ? 40 : 75, (model === 'Single') ? 30 : 20, (model === 'Single') ? 200000 / age : 400000 / age, "" ), 1))
                }
              }
            }
          }
          // Create the scenario.
          const customScenario: Scenario = new Scenario("", "Custom",
              "This is a custom scenario generated by the TCS importer.",
              ["Serve all bus stops.", "Ensure a frequent service on all routes.", "Ensure that passenger satisfaction remains above 70% at all times."],
              70,
              suppliedVehicles,
              [],
              stopDistances
          );
          // Create the game.
          // Defaults: empty player name, starting time is now, scenario will be created soon and difficulty level is easy.
          this.gameService.setGame(new Game(operatorName, "", this.datePipe.transform(new Date(), 'yyyy-MM-dd'), customScenario, "Easy"))
          // Add the supplied vehicles.
          var mySuppliedVehicles = customScenario.suppliedVehicles;
          for ( var i = 0; i < mySuppliedVehicles.length; i++ ) {
            for ( var j = 0; j < mySuppliedVehicles[i].quantity; j++ ) {
              const additionalProps = new Map<string, string>();
              additionalProps.set('Model', mySuppliedVehicles[i].model.modelName);
              additionalProps.set('Age', ((mySuppliedVehicles[i].model.modelName === "Single") ? (200000 / mySuppliedVehicles[i].model.value) * 12 : (400000 / mySuppliedVehicles[i].model.value) * 12) + " months" );
              additionalProps.set('Standing Capacity', '' + mySuppliedVehicles[i].model.standingCapacity);
              additionalProps.set('Seating Capacity', '' + mySuppliedVehicles[i].model.seatingCapacity);
              additionalProps.set('Value', '' + mySuppliedVehicles[i].model.value);
              this.gameService.getGame().addVehicle(new Vehicle('' + (i+j+1), (mySuppliedVehicles[i].model.modelName === "Single") ? "Single Decker Bus" : "Double Decker Bus", '',
                  mySuppliedVehicles[i].model.modelType, '', 0, additionalProps));
            }
          }
          // Add the routes.
          for ( var t = 0; t < routes.length; t++ ) {
            this.gameService.getGame().addRoute(routes[t]);
            // Add the allocations.
            for ( var i = 0; i < mySuppliedVehicles.length; i++ ) {
              for (var j = 0; j < mySuppliedVehicles[i].quantity; j++) {
                this.gameService.getGame().addAllocation(new Allocation(routes[t].routeNumber, '' + (i+j+1), mySuppliedVehicles[i].model.modelType ));
              }
            }
          }
        }
      }
    }
  }

  /**
   * Helper method to format time.
   */
  formatTimeAsString(time: Date): string {
    var hour: string;
    // Format hour with a 0 as prefix if before 10.
    if ( time.getHours() < 10 ) {
      hour = "0" + time.getHours();
    } else {
      hour = "" + time.getHours();
    }
    var minute: string;
    // Format minutes with a 0 as prefix if before 10.
    if ( time.getMinutes() < 10 ) {
      minute = "0" + time.getMinutes();
    } else {
      minute = "" + time.getMinutes();
    }
    return hour + ":" + minute;
  }

  /**
   * Read the contents of the file.
   */
  readFileContent(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!file) {
        resolve('');
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const text = reader.result.toString();
        resolve(text);

      };

      reader.readAsText(file);
    });
  }

}
