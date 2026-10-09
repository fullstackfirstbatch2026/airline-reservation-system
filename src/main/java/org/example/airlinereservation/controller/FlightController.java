package org.example.airlinereservation.controller;

import org.example.airlinereservation.model.Flight;
import org.example.airlinereservation.service.FlightService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/flights")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @GetMapping
    public List<Flight> getAllFlights() {
        return flightService.getAllFlights();
    }

    @GetMapping("/above-average-bookings")
    public List<Flight> getFlightsAboveAverageBookings() {
        return flightService.getFlightsAboveAverageBookings();
    }

    @GetMapping("/{id}")
    public Flight getFlightById(@PathVariable int id) {
        return flightService.getFlightById(id);
    }

    @PostMapping
    public Flight addFlight(@RequestBody Flight flight) {
        return flightService.saveFlight(flight);
    }

    @DeleteMapping("/{id}")
    public String deleteFlight(@PathVariable int id) {
        flightService.deleteFlight(id);
        return "Flight deleted successfully";
    }
}