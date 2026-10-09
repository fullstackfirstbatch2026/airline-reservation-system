package org.example.airlinereservation.controller;

import org.example.airlinereservation.model.Payment;
import org.example.airlinereservation.service.PaymentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable int id) {
        return paymentService.getPaymentById(id);
    }

    @PostMapping
    public Payment addPayment(@RequestBody Payment payment) {
        return paymentService.savePayment(payment);
    }

    @DeleteMapping("/{id}")
    public String deletePayment(@PathVariable int id) {
        paymentService.deletePayment(id);
        return "Payment deleted successfully";
    }
}