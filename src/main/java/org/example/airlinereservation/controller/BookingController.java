package org.example.airlinereservation.controller;

import org.example.airlinereservation.dto.BookingRequest;
import org.example.airlinereservation.model.Booking;
import org.example.airlinereservation.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Get all bookings
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    // Get booking by ID
    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable int id) {
        return bookingService.getBookingById(id);
    }

    // Normal booking using Booking entity
    @PostMapping
    public Booking addBooking(@RequestBody Booking booking) {
        return bookingService.saveBooking(booking);
    }

    // Delete booking
    @DeleteMapping("/{id}")
    public String deleteBooking(@PathVariable int id) {
        bookingService.deleteBooking(id);
        return "Booking deleted successfully";
    }

    // JOIN query
    @GetMapping("/details")
    public List<Object[]> getBookingDetails() {
        return bookingService.getBookingDetails();
    }

    // Book flight using MySQL Stored Procedure
    @PostMapping("/reserve")
    public ResponseEntity<String> reserveFlight(
            @RequestBody BookingRequest request) {

        bookingService.bookFlight(
                request.getPassengerId(),
                request.getFlightId(),
                request.getBookingDate(),
                request.getSeatNumber(),
                request.getFare()
        );

        return ResponseEntity.ok("Flight booked successfully");
    }
}