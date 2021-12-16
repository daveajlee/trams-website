package de.davelee.trams.operations.controller;

import de.davelee.trams.operations.model.StopTime;
import de.davelee.trams.operations.request.GenerateStopTimesRequest;
import de.davelee.trams.operations.response.StopTimeResponse;
import de.davelee.trams.operations.response.StopTimesResponse;
import de.davelee.trams.operations.service.StopTimeService;
import de.davelee.trams.operations.utils.DateUtils;
import de.davelee.trams.operations.utils.Direction;
import de.davelee.trams.operations.utils.StopTimeUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

/**
 * This class provides REST endpoints which provide operations associated with stop times in the TraMS Operations API.
 * @author Dave Lee
 */
@RestController
@Api(value="/api/stopTimes")
@RequestMapping(value="/api/stopTimes")
public class StopTimesController {

    private Logger logger = LoggerFactory.getLogger(StopTimesController.class);

    @Autowired
    private StopTimeService stopTimeService;

    /**
     * Return the next departures and/or arrivals based on the supplied user parameters.
     * @param stopName a <code>String</code> containing the name of the stop to retrieve departures/arrivals from.
     * @param company a <code>String</code> containing the name of the company to retrieve times for.
     * @param startingTime a <code>String</code> containing the time to start retrieving departures/arrivals from which may be null if rest of day should be returned.
     * @param date a <code>String</code> containing the date to retrieve stop times for in format yyyy-MM-dd.
     * @param departures a <code>boolean</code> which is true iff departure times should be returned.
     * @param arrivals a <code>boolean</code> which is true iff arrivals times should be returned.
     * @return a <code>List</code> of <code>StopTime</code> objects which may be null if none were found.
     */
    @GetMapping("/")
    @CrossOrigin
    @ResponseBody
    @ApiOperation(value = "Get stop times", notes="Return the stop times.")
    @ApiResponses(value = {@ApiResponse(code=200,message="Successfully returned stop times")})
    public ResponseEntity<StopTimesResponse> getStopTimes (final String stopName, final String company, final Optional<String> startingTime,
                                                           final String date, final boolean departures, final boolean arrivals) {
        //First of all, check that all necessary parameters were filled and that at least one of departures or arrivals is true.
        if (StringUtils.isBlank(stopName) || StringUtils.isBlank(company) || StringUtils.isBlank(date)
                || (!departures && !arrivals)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        //Store the results of any service operations in a variable.
        List<StopTime> stopTimeList = new ArrayList<>();
        //If departures and a starting time specified then get departures.
        if ( departures && startingTime.isPresent() ) {
            stopTimeList = stopTimeService.getDepartures(stopName, company, startingTime.get());
        }
        //Otherwise arrivals and starting time then get arrivals.
        else if ( arrivals && startingTime.isPresent() ) {
            stopTimeList = stopTimeService.getArrivals(stopName, company, startingTime.get());
        }
        //In the final case return all departures for the specified date.
        else if ( departures ) {
            stopTimeList = stopTimeService.getDeparturesByDate(stopName, company, date);
        }
        //If the list is empty or null then return no content.
        if ( stopTimeList.size() == 0 ) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        //Now do the proessing into correct Response objects and return.
        StopTimeResponse[] stopTimeResponses = new StopTimeResponse[stopTimeList.size()];
        for ( int i = 0; i < stopTimeResponses.length; i++ ) {
            stopTimeResponses[i] = StopTimeResponse.builder()
                    .arrivalTime(stopTimeList.get(i).getArrivalTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                    .departureTime(stopTimeList.get(i).getDepartureTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                    .destination(stopTimeList.get(i).getDestination())
                    .company(stopTimeList.get(i).getCompany())
                    .journeyNumber(stopTimeList.get(i).getJourneyNumber())
                    .operatingDays(StopTimeUtils.convertOperatingDays(stopTimeList.get(i).getOperatingDays()))
                    .routeNumber(stopTimeList.get(i).getRouteNumber())
                    .validFromDate(stopTimeList.get(i).getValidFromDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                    .validToDate(stopTimeList.get(i).getValidToDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                    .stopName(stopTimeList.get(i).getStopName())
                    .build();
        }
        return ResponseEntity.ok(StopTimesResponse.builder()
                .count((long) stopTimeResponses.length)
                .stopTimeResponses(stopTimeResponses).build());
    }

    /**
     * Generate stop time entries within a specified time and frequency and save them to the database.
     * @param generateStopTimesRequest a <code>GenerateStopTimesRequest</code> object containing the information to
     *                                 generate stop times including stops, distances and frequencies.
     */
    @PostMapping("/generate")
    @CrossOrigin
    @ApiOperation(value = "Generate stop times", notes="Generate the stop times for a route and frequency.")
    @ApiResponses(value = {@ApiResponse(code=200,message="Successfully returned stop times")})
    public ResponseEntity<Void> generateStopTimes ( final GenerateStopTimesRequest generateStopTimesRequest ) {
        logger.info("Attempting to generate stopTimes for " + generateStopTimesRequest.toString());
        //Store list of stop times generated.
        List<StopTime> stopTimeList = new ArrayList<>();
        //Generate the first trip in outward direction.
        stopTimeList.addAll(generateFirstTrip(Direction.OUTGOING, generateStopTimesRequest, 1));
        //Generate the first trip in return direction.
        stopTimeList.addAll(generateFirstTrip(Direction.RETURN, generateStopTimesRequest, Integer.parseInt(stopTimeList.get(stopTimeList.size()-1).getJourneyNumber())+1));
        //Log the list of stop times generated.
        logger.info("StopTimes generated: " + stopTimeList.toString());
        return ResponseEntity.ok().build();
    }

    /**
     * Private helper method to generate all stop times for the first trip in a particular direction.
     * @param direction a <code>Direction</code> enum which can be either OUTGOING or RETURN.
     * @param generateStopTimesRequest a <code>GenerateStopTimesRequest</code> object containing the information to
     *                                 generate stop times including stops, distances and frequencies.
     * @param startJourneyNumber a <code>int</code> with the journey number to use for the first stop time generated.
     * @return a <code>List</code> of <code>StopTime</code> objects which have been generated automatically.
     */
    private List<StopTime> generateFirstTrip ( final Direction direction, final GenerateStopTimesRequest generateStopTimesRequest,
                                               final int startJourneyNumber ) {
        //Initialise journey number.
        int journeyNumber = startJourneyNumber;
        //Create an empty list to add stop times to.
        List<StopTime> stopTimeList = new ArrayList<>();
        //Decide a random start time within the supplied frequency.
        LocalTime arrivalTime = LocalTime.parse(generateStopTimesRequest.getStartTime(), DateTimeFormatter.ofPattern("HH:mm"));
        Random rand = new Random();
        arrivalTime = arrivalTime.plusMinutes(rand.nextInt(generateStopTimesRequest.getFrequency()));
        if ( direction == Direction.OUTGOING ) {
            //Generate first trip in the outward direction.
            stopTimeList.add(StopTime.builder()
                    .arrivalTime(arrivalTime)
                    .company(generateStopTimesRequest.getCompany())
                    .departureTime(arrivalTime.plusMinutes(generateStopTimesRequest.getStopPatternRequest().getStoppingTimes()[0]))
                    .stopName(generateStopTimesRequest.getStopPatternRequest().getStopNames()[0])
                    .journeyNumber("" + journeyNumber++)
                    .destination(generateStopTimesRequest.getStopPatternRequest().getStopNames()[generateStopTimesRequest.getStopPatternRequest().getStopNames().length - 1])
                    .routeNumber(generateStopTimesRequest.getRouteNumber())
                    .operatingDays(StopTimeUtils.convertOperatingDaysToDayOfWeek(generateStopTimesRequest.getOperatingDays()))
                    .validFromDate(DateUtils.convertDateToLocalDate(generateStopTimesRequest.getValidFromDate()))
                    .validToDate(DateUtils.convertDateToLocalDate(generateStopTimesRequest.getValidToDate()))
                    .build());
            //Generate remaining stop times for the first trip.
            for (int i = 1; i < generateStopTimesRequest.getStopPatternRequest().getStopNames().length; i++) {
                arrivalTime = arrivalTime.plusMinutes(generateStopTimesRequest.getStopPatternRequest().getDistances()[i - 1]);
                stopTimeList.add(StopTime.builder()
                        .arrivalTime(arrivalTime)
                        .company(generateStopTimesRequest.getCompany())
                        .departureTime(arrivalTime.plusMinutes(generateStopTimesRequest.getStopPatternRequest().getStoppingTimes()[i]))
                        .stopName(generateStopTimesRequest.getStopPatternRequest().getStopNames()[i])
                        .journeyNumber("" + journeyNumber++)
                        .destination(generateStopTimesRequest.getStopPatternRequest().getStopNames()[generateStopTimesRequest.getStopPatternRequest().getStopNames().length - 1])
                        .routeNumber(generateStopTimesRequest.getRouteNumber())
                        .operatingDays(StopTimeUtils.convertOperatingDaysToDayOfWeek(generateStopTimesRequest.getOperatingDays()))
                        .validFromDate(DateUtils.convertDateToLocalDate(generateStopTimesRequest.getValidFromDate()))
                        .validToDate(DateUtils.convertDateToLocalDate(generateStopTimesRequest.getValidToDate()))
                        .build());
            }
        } else if ( direction == Direction.RETURN ) {
            //Generate first trip in the return direction.
            stopTimeList.add(StopTime.builder()
                    .arrivalTime(arrivalTime)
                    .company(generateStopTimesRequest.getCompany())
                    .departureTime(arrivalTime.plusMinutes(generateStopTimesRequest.getStopPatternRequest().getStoppingTimes()[generateStopTimesRequest.getStopPatternRequest().getStoppingTimes().length-1]))
                    .stopName(generateStopTimesRequest.getStopPatternRequest().getStopNames()[generateStopTimesRequest.getStopPatternRequest().getStoppingTimes().length-1])
                    .journeyNumber("" + journeyNumber++)
                    .destination(generateStopTimesRequest.getStopPatternRequest().getStopNames()[0])
                    .routeNumber(generateStopTimesRequest.getRouteNumber())
                    .operatingDays(StopTimeUtils.convertOperatingDaysToDayOfWeek(generateStopTimesRequest.getOperatingDays()))
                    .validFromDate(DateUtils.convertDateToLocalDate(generateStopTimesRequest.getValidFromDate()))
                    .validToDate(DateUtils.convertDateToLocalDate(generateStopTimesRequest.getValidToDate()))
                    .build());
            //Generate remaining stop times for the first trip.
            for (int i = generateStopTimesRequest.getStopPatternRequest().getStopNames().length-2; i >= 0; i--) {
                arrivalTime = arrivalTime.plusMinutes(generateStopTimesRequest.getStopPatternRequest().getDistances()[i]);
                stopTimeList.add(StopTime.builder()
                        .arrivalTime(arrivalTime)
                        .company(generateStopTimesRequest.getCompany())
                        .departureTime(arrivalTime.plusMinutes(generateStopTimesRequest.getStopPatternRequest().getStoppingTimes()[i]))
                        .stopName(generateStopTimesRequest.getStopPatternRequest().getStopNames()[i])
                        .journeyNumber("" + journeyNumber++)
                        .destination(generateStopTimesRequest.getStopPatternRequest().getStopNames()[0])
                        .routeNumber(generateStopTimesRequest.getRouteNumber())
                        .operatingDays(StopTimeUtils.convertOperatingDaysToDayOfWeek(generateStopTimesRequest.getOperatingDays()))
                        .validFromDate(DateUtils.convertDateToLocalDate(generateStopTimesRequest.getValidFromDate()))
                        .validToDate(DateUtils.convertDateToLocalDate(generateStopTimesRequest.getValidToDate()))
                        .build());
            }
        }
        //Return the list of stop times.
        return stopTimeList;
    }

}
