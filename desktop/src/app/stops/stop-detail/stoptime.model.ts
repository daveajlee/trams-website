/**
 * This class defines a model for Stop Times in TraMS which consist of a departure and arrival time
 * for a particular stop.
 */
export class StopTimeModel {

    private departureTime: string;
    private arrivalTime: string;
    private stop: string;

    /**
     * Construct a new StopTimeModel object based on the supplied information
     * @param departureTime the time that the vehicle will depart
     * @param arrivalTime the time that the vehicle will arrive
     * @param stop the name of the stop.
     */
    constructor(departureTime: string, arrivalTime: string, stop: string ) {
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.stop = stop;
    }

    /**
     * Retrieve the departure time for this stop.
     * @return the departure time in format HH:mm as a string.
     */
    getDepartureTime(): string {
        return this.departureTime;
    }

    /**
     * Retrieve the arrival time for this stop.
     * @return the arrival time in format HH:mm as a string.
     */
    getArrivalTime(): string {
        return this.arrivalTime;
    }

    /**
     * Retrieve the name of this stop.
     * @return the name of this stop as a String.
     */
    getStop(): string {
        return this.stop;
    }

}