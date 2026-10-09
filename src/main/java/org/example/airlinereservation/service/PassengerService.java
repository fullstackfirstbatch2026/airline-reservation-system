package org.example.airlinereservation.service;

import org.example.airlinereservation.model.Passenger;
import org.example.airlinereservation.repository.PassengerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PassengerService {

    private final PassengerRepository passengerRepository;

    public PassengerService(PassengerRepository passengerRepository) {
        this.passengerRepository = passengerRepository;
    }

    public List<Passenger> getAllPassengers() {
        return passengerRepository.findAll();
    }

    public Passenger getPassengerById(int id) {
        return passengerRepository.findById(id).orElse(null);
    }

    public Passenger savePassenger(Passenger passenger) {
        return passengerRepository.save(passenger);
    }

    public void deletePassenger(int id) {
        passengerRepository.deleteById(id);
    }
}