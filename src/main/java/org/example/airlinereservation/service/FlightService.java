package org.example.airlinereservation.service;

import org.example.airlinereservation.model.Flight;
import org.example.airlinereservation.repository.FlightRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightService {

    private final FlightRepository flightRepository;

    public FlightService(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    public Flight getFlightById(int id) {
        return flightRepository.findById(id).orElse(null);
    }

    public Flight saveFlight(Flight flight) {
        return flightRepository.save(flight);
    }

    public void deleteFlight(int id) {
        flightRepository.deleteById(id);
    }

    public List<Flight> getFlightsAboveAverageBookings() {
        return flightRepository.findFlightsAboveAverageBookings();
    }
}