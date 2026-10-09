package org.example.airlinereservation.repository;

import org.example.airlinereservation.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    @Query(value = """
            SELECT b.id,
                   b.booking_date,
                   b.seat_number,
                   b.fare,
                   p.name,
                   p.email,
                   f.flight_number,
                   f.source,
                   f.destination,
                   f.flight_date
            FROM bookings b
            JOIN passengers p ON b.passenger_id = p.id
            JOIN flights f ON b.flight_id = f.id
            """, nativeQuery = true)
    List<Object[]> getBookingDetails();
}