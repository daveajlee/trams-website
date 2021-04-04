import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Stop} from './stop.model';

@Injectable()
/**
 * This class provides access to the list of stops from the server so that all stops or a single stop from the list can be returned
 * to the Frontend component.
 */
export class StopsService {

  stopsChanged = new Subject<Stop[]>();

  private stops: Stop[] = [];

  /**
   * Set the list of stops to new stops supplied from the server.
   * @param stops an array of stops sent from the server
   */
  setStops(stops: Stop[]): void {
    this.stops = stops;
    this.stopsChanged.next(this.stops.slice());
  }

  /**
   * Return the current list of stops which the server has provided.
   */
  getStops(): Stop[] {
    return this.stops.slice();
  }

  /**
   * Return a single stop based on the supplied position in the array.
   * @param index a number containing the position in the array to return.
   */
  getStop(index: number): Stop {
    return this.stops.slice()[index];
  }


}
