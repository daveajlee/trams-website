import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StopsService} from '../stops/stops.service';
import {Stop} from '../stops/stop.model';
import {Route} from '../routes/route.model';
import {RoutesService} from '../routes/routes.service';

@Injectable({providedIn: 'root'})
/**
 * This class provides access via http calls to the server to collect data about stops and routes as necessary.
 */
export class DataService {

  /**
   * Construct a new DataService object which calls the http calls and displays the data provided.
   * @param http an http client which can make http calls
   * @param stopsService a service which can store stops
   * @param routesService a service which can store routes
   */
  constructor(private http: HttpClient, private stopsService: StopsService, private routesService: RoutesService) {
    this.http.get<Stop[]>('http://localhost:8080/trams-operations/stops').subscribe(stops => {
      this.stopsService.setStops(stops);
    });
    this.http.get<Route[]>('http://localhost:8080/trams-operations/routes').subscribe(routes => {
      this.routesService.setRoutes(routes);
    });
  }

}
