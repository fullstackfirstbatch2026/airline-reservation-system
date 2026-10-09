const BASE_URL = "";

let allFlights = [];
let selectedFlight = null;


/* ================= SECTION NAVIGATION ================= */

function showSection(sectionName) {

    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    const selectedSection = document.getElementById(sectionName);

    if (selectedSection) {
        selectedSection.classList.add("active");
    }


    const titles = {
        dashboard: "Dashboard",
        flights: "Flights",
        passengers: "Passengers",
        bookings: "Bookings",
        payments: "Payments",
        reports: "Reports",
        analytics: "Analytics"
    };

    document.getElementById("pageTitle").textContent =
        titles[sectionName] || "Dashboard";


    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(item => {
        item.classList.remove("active");
    });


    navItems.forEach(item => {

        const onclickValue = item.getAttribute("onclick");

        if (onclickValue &&
            onclickValue.includes("'" + sectionName + "'")) {

            item.classList.add("active");
        }

    });


    if (sectionName === "reports") {
        loadJoinReport();
        loadSubqueryReport();
    }
}


/* ================= DASHBOARD ================= */

async function loadDashboard() {

    await Promise.all([
        loadFlights(),
        loadPassengers(),
        loadBookings(),
        loadPayments()
    ]);

}


/* ================= FLIGHTS ================= */

async function loadFlights() {

    try {

        const response = await fetch(BASE_URL + "/flights");

        if (!response.ok) {
            throw new Error("Unable to load flights");
        }

        allFlights = await response.json();

        document.getElementById("flightCount").textContent =
            allFlights.length;

        document.getElementById("analyticsFlights").textContent =
            allFlights.length;


        renderFlights("flightCards", allFlights);

        renderFlights(
            "dashboardFlights",
            allFlights.slice(0, 3)
        );

    } catch (error) {

        console.error(error);

        document.getElementById("flightCards").innerHTML =
            `<div class="no-result">
                Unable to load flights.
            </div>`;

    }

}


/* ================= RENDER FLIGHTS ================= */

function renderFlights(containerId, flights) {

    const container = document.getElementById(containerId);

    container.innerHTML = "";


    if (!flights || flights.length === 0) {

        container.innerHTML = `
            <div class="no-result">
                No flights available.
            </div>
        `;

        return;
    }


    flights.forEach(flight => {

        const card = document.createElement("div");

        card.className = "flight-card";


        const seatsAvailable =
            flight.availableSeats > 0;


        card.innerHTML = `

            <div class="flight-top">

                <span class="flight-number">
                    ${flight.flightNumber}
                </span>

                <span class="flight-status">
                    ${seatsAvailable ? "Available" : "Full"}
                </span>

            </div>


            <div class="route">

                <div class="city">

                    <strong>
                        ${flight.source}
                    </strong>

                    <span>
                        Departure
                    </span>

                </div>


                <div class="route-line">

                    <i class="fa-solid fa-plane"></i>

                </div>


                <div class="city">

                    <strong>
                        ${flight.destination}
                    </strong>

                    <span>
                        Arrival
                    </span>

                </div>

            </div>


            <div class="flight-info">

                <div>
                    <span>Date</span>
                    <strong>${flight.flightDate}</strong>
                </div>

                <div>
                    <span>Seats</span>
                    <strong>
                        ${flight.availableSeats}/${flight.totalSeats}
                    </strong>
                </div>

                <div>
                    <span>Fare</span>
                    <strong>
                        ₹${Number(flight.fare).toLocaleString("en-IN")}
                    </strong>
                </div>

            </div>


            <button
                class="book-btn"
                onclick="openBookingModal(${flight.id})"
                ${!seatsAvailable ? "disabled" : ""}>

                <i class="fa-solid fa-ticket"></i>

                ${seatsAvailable ? "Book Flight" : "Flight Full"}

            </button>
        `;


        container.appendChild(card);

    });

}


/* ================= BOOKING MODAL ================= */

function openBookingModal(flightId) {

    selectedFlight =
        allFlights.find(flight => flight.id === flightId);


    if (!selectedFlight) {

        showToast("Flight not found");

        return;
    }


    document.getElementById("bookingModal")
        .classList.add("show");


    document.getElementById("selectedFlightInfo").innerHTML = `

        <strong>${selectedFlight.flightNumber}</strong>

        &nbsp; ${selectedFlight.source}

        <i class="fa-solid fa-arrow-right"></i>

        ${selectedFlight.destination}

        &nbsp; | &nbsp;

        ${selectedFlight.flightDate}

    `;


    calculateBookingFare();

}


function closeBookingModal() {

    document.getElementById("bookingModal")
        .classList.remove("show");

}


/* ================= FARE FUNCTION ================= */

/*
    The fare is NOT a separate menu anymore.

    It is calculated automatically when
    the user opens the booking window.

    MySQL function:
    calculate_fare(baseFare, taxPercent)
*/

async function calculateBookingFare() {

    if (!selectedFlight) {
        return;
    }


    const baseFare = Number(selectedFlight.fare);

    const taxPercent = 5;


    try {

        const response = await fetch(
            BASE_URL +
            `/payments/calculate-fare?baseFare=${baseFare}&taxPercent=${taxPercent}`
        );


        if (!response.ok) {
            throw new Error("Fare calculation failed");
        }


        const finalFare = Number(
            await response.text()
        );


        const taxAmount =
            finalFare - baseFare;


        document.getElementById("baseFare")
            .textContent =
            "₹" + baseFare.toLocaleString("en-IN");


        document.getElementById("taxAmount")
            .textContent =
            "₹" + taxAmount.toLocaleString("en-IN");


        document.getElementById("finalFare")
            .textContent =
            "₹" + finalFare.toLocaleString("en-IN");


        selectedFlight.finalFare = finalFare;

    } catch (error) {

        console.error(error);


        /*
            Fallback calculation only for displaying
            the fare if the backend function endpoint
            is temporarily unavailable.
        */

        const taxAmount =
            baseFare * taxPercent / 100;


        const finalFare =
            baseFare + taxAmount;


        document.getElementById("baseFare")
            .textContent =
            "₹" + baseFare.toLocaleString("en-IN");


        document.getElementById("taxAmount")
            .textContent =
            "₹" + taxAmount.toLocaleString("en-IN");


        document.getElementById("finalFare")
            .textContent =
            "₹" + finalFare.toLocaleString("en-IN");


        selectedFlight.finalFare = finalFare;

    }

}


/* ================= CONFIRM BOOKING ================= */

async function confirmBooking() {

    if (!selectedFlight) {
        return;
    }


    const name =
        document.getElementById("passengerName").value.trim();


    const email =
        document.getElementById("passengerEmail").value.trim();


    const phone =
        document.getElementById("passengerPhone").value.trim();


    const seatNumber =
        document.getElementById("seatNumber").value.trim();


    if (!name || !email || !phone || !seatNumber) {

        showToast("Please fill all passenger details");

        return;
    }


    try {

        /*
            STEP 1:
            Create passenger
        */

        const passengerResponse =
            await fetch(BASE_URL + "/passengers", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: name,
                    email: email,
                    phone: phone

                })

            });


        if (!passengerResponse.ok) {
            throw new Error("Passenger creation failed");
        }


        const passenger =
            await passengerResponse.json();


        /*
            STEP 2:
            Call stored procedure
        */

        const bookingResponse =
            await fetch(BASE_URL + "/bookings/reserve", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    passengerId: passenger.id,

                    flightId: selectedFlight.id,

                    bookingDate:
                        new Date()
                            .toISOString()
                            .split("T")[0],

                    seatNumber: seatNumber,

                    fare: selectedFlight.finalFare

                })

            });


        if (!bookingResponse.ok) {

            const message =
                await bookingResponse.text();

            throw new Error(
                message || "Booking failed"
            );
        }


        /*
            STEP 3:
            Stored procedure inserts booking.

            STEP 4:
            Trigger automatically decreases
            available seats.
        */


        closeBookingModal();


        document.getElementById("successModal")
            .classList.add("show");


        document.getElementById("successMessage")
            .textContent =
            `Flight ${selectedFlight.flightNumber}
             has been booked successfully for ${name}.`;


        /*
            Reload data so the changed seat
            count is immediately visible.
        */

        await loadFlights();

        await loadBookings();

        await loadPassengers();


    } catch (error) {

        console.error(error);

        showToast(
            error.message || "Booking failed"
        );

    }

}


/* ================= SUCCESS ================= */

function closeSuccessModal() {

    document.getElementById("successModal")
        .classList.remove("show");

}


/* ================= PASSENGERS ================= */

async function loadPassengers() {

    try {

        const response =
            await fetch(BASE_URL + "/passengers");


        if (!response.ok) {
            throw new Error("Unable to load passengers");
        }


        const passengers =
            await response.json();


        document.getElementById("passengerCount")
            .textContent =
            passengers.length;


        document.getElementById("analyticsPassengers")
            .textContent =
            passengers.length;


        const table =
            document.getElementById("passengerTable");


        table.innerHTML = "";


        passengers.forEach(passenger => {

            table.innerHTML += `

                <tr>

                    <td>
                        ${passenger.id}
                    </td>

                    <td>
                        <strong>
                            ${passenger.name}
                        </strong>
                    </td>

                    <td>
                        ${passenger.email}
                    </td>

                    <td>
                        ${passenger.phone}
                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}


/* ================= BOOKINGS ================= */

async function loadBookings() {

    try {

        const response =
            await fetch(BASE_URL + "/bookings");


        if (!response.ok) {
            throw new Error("Unable to load bookings");
        }


        const bookings =
            await response.json();


        document.getElementById("bookingCount")
            .textContent =
            bookings.length;


        document.getElementById("analyticsBookings")
            .textContent =
            bookings.length;


        const table =
            document.getElementById("bookingTable");


        table.innerHTML = "";


        bookings.forEach(booking => {

            table.innerHTML += `

                <tr>

                    <td>
                        ${booking.id}
                    </td>

                    <td>
                        <strong>
                            ${booking.passenger?.name || "-"}
                        </strong>
                    </td>

                    <td>
                        ${booking.flight?.flightNumber || "-"}
                    </td>

                    <td>
                        ${booking.flight?.source || "-"}
                        →
                        ${booking.flight?.destination || "-"}
                    </td>

                    <td>
                        ${booking.bookingDate || "-"}
                    </td>

                    <td>
                        ${booking.seatNumber || "-"}
                    </td>

                    <td>
                        ₹${Number(booking.fare || 0)
                .toLocaleString("en-IN")}
                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}


/* ================= PAYMENTS ================= */

async function loadPayments() {

    try {

        const response =
            await fetch(BASE_URL + "/payments");


        if (!response.ok) {
            throw new Error("Unable to load payments");
        }


        const payments =
            await response.json();


        document.getElementById("paymentCount")
            .textContent =
            payments.length;


        document.getElementById("analyticsPayments")
            .textContent =
            payments.length;


        const table =
            document.getElementById("paymentTable");


        table.innerHTML = "";


        payments.forEach(payment => {

            table.innerHTML += `

                <tr>

                    <td>
                        ${payment.id}
                    </td>

                    <td>
                        ${payment.booking?.id || "-"}
                    </td>

                    <td>
                        ₹${Number(payment.amount || 0)
                .toLocaleString("en-IN")}
                    </td>

                    <td>
                        ${payment.paymentDate || "-"}
                    </td>

                    <td>

                        <span class="status-paid">

                            ${payment.paymentStatus || "PAID"}

                        </span>

                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}


/* ================= JOIN REPORT ================= */

async function loadJoinReport() {

    try {

        const response =
            await fetch(BASE_URL + "/bookings/details");


        if (!response.ok) {
            throw new Error("JOIN report failed");
        }


        const data =
            await response.json();


        const table =
            document.getElementById("joinTable");


        table.innerHTML = "";


        if (!data.length) {

            table.innerHTML = `

                <tr>
                    <td colspan="6">
                        No booking data available.
                    </td>
                </tr>

            `;

            return;
        }


        data.forEach(row => {

            table.innerHTML += `

                <tr>

                    <td>
                        ${row[0]}
                    </td>

                    <td>
                        <strong>
                            ${row[4]}
                        </strong>
                    </td>

                    <td>
                        ${row[5]}
                    </td>

                    <td>
                        ${row[6]}
                    </td>

                    <td>
                        ${row[7]} →
                        ${row[8]}
                    </td>

                    <td>
                        ${row[9]}
                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}


/* ================= SUBQUERY REPORT ================= */

async function loadSubqueryReport() {

    const result =
        document.getElementById("subqueryResult");


    try {

        const response =
            await fetch(
                BASE_URL +
                "/flights/above-average-bookings"
            );


        if (!response.ok) {
            throw new Error("Subquery failed");
        }


        const flights =
            await response.json();


        result.innerHTML = "";


        if (!flights.length) {

            /*
                With only one flight, its booking count
                equals the average, so there cannot be
                a flight ABOVE the average.
            */

            result.innerHTML = `

                <div class="no-result">

                    <strong>
                        No flight is above the average yet.
                    </strong>

                    <br><br>

                    The subquery is working, but you currently
                    have only one flight or all flights have
                    the same booking count.

                    <br><br>

                    Add another flight and make different
                    numbers of bookings to see the result.

                </div>

            `;

            return;
        }


        flights.forEach(flight => {

            result.innerHTML += `

                <div class="subquery-flight">

                    <div>

                        <strong>
                            ${flight.flightNumber}
                        </strong>

                        <span>
                            ${flight.source}
                            →
                            ${flight.destination}
                        </span>

                    </div>

                    <span class="requirement-tag purple-tag">

                        Above Average

                    </span>

                </div>

            `;

        });

    } catch (error) {

        console.error(error);

        result.innerHTML = `

            <div class="no-result">

                Unable to load subquery result.

            </div>

        `;

    }

}


/* ================= SEARCH ================= */

function globalSearch() {

    const searchValue =
        document.getElementById("globalSearch")
            .value
            .toLowerCase()
            .trim();


    if (!searchValue) {

        renderFlights("flightCards", allFlights);

        return;
    }


    const filtered =
        allFlights.filter(flight =>

            String(flight.flightNumber)
                .toLowerCase()
                .includes(searchValue)

            ||

            String(flight.source)
                .toLowerCase()
                .includes(searchValue)

            ||

            String(flight.destination)
                .toLowerCase()
                .includes(searchValue)

        );


    renderFlights(
        "flightCards",
        filtered
    );


    showSection("flights");

}


/* ================= TOAST ================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");


    document.getElementById("toastMessage")
        .textContent =
        message;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* ================= INITIAL LOAD ================= */

window.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

});