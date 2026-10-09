package org.example.airlinereservation.repository;

import org.example.airlinereservation.model.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Integer> {

    @Query(value = """
            SELECT f.*
            FROM flights f
            JOIN bookings b ON f.id = b.flight_id
            GROUP BY f.id
            HAVING COUNT(b.id) > (
                SELECT AVG(booking_count)
                FROM (
                    SELECT COUNT(*) AS booking_count
                    FROM bookings
                    GROUP BY flight_id
                ) x
            )
            """, nativeQuery = true)
    List<Flight> findFlightsAboveAverageBookings();
}