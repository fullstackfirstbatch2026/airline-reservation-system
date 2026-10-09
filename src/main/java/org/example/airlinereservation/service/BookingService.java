package org.example.airlinereservation.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;
import jakarta.transaction.Transactional;

import org.example.airlinereservation.model.Booking;
import org.example.airlinereservation.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(int id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public Booking saveBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public void deleteBooking(int id) {
        bookingRepository.deleteById(id);
    }

    public List<Object[]> getBookingDetails() {
        return bookingRepository.getBookingDetails();
    }

    @Transactional
    public void bookFlight(int passengerId,
                           int flightId,
                           String bookingDate,
                           String seatNumber,
                           double fare) {

        StoredProcedureQuery query =
                entityManager.createStoredProcedureQuery("book_flight");

        query.registerStoredProcedureParameter(
                "p_passenger_id",
                Integer.class,
                ParameterMode.IN
        );

        query.registerStoredProcedureParameter(
                "p_flight_id",
                Integer.class,
                ParameterMode.IN
        );

        query.registerStoredProcedureParameter(
                "p_booking_date",
                String.class,
                ParameterMode.IN
        );

        query.registerStoredProcedureParameter(
                "p_seat_number",
                String.class,
                ParameterMode.IN
        );

        query.registerStoredProcedureParameter(
                "p_fare",
                Double.class,
                ParameterMode.IN
        );

        query.setParameter("p_passenger_id", passengerId);
        query.setParameter("p_flight_id", flightId);
        query.setParameter("p_booking_date", bookingDate);
        query.setParameter("p_seat_number", seatNumber);
        query.setParameter("p_fare", fare);

        query.execute();
    }
}