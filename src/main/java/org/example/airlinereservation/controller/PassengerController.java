package org.example.airlinereservation.controller;

import org.example.airlinereservation.model.Passenger;
import org.example.airlinereservation.service.PassengerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/passengers")
public class PassengerController {

    private final PassengerService passengerService;

    public PassengerController(PassengerService passengerService) {
        this.passengerService = passengerService;
    }

    @GetMapping
    public List<Passenger> getAllPassengers() {
        return passengerService.getAllPassengers();
    }

    @GetMapping("/{id}")
    public Passenger getPassengerById(@PathVariable int id) {
        return passengerService.getPassengerById(id);
    }

    @PostMapping
    public Passenger addPassenger(@RequestBody Passenger passenger) {
        return passengerService.savePassenger(passenger);
    }

    @DeleteMapping("/{id}")
    public String deletePassenger(@PathVariable int id) {
        passengerService.deletePassenger(id);
        return "Passenger deleted successfully";
    }
}