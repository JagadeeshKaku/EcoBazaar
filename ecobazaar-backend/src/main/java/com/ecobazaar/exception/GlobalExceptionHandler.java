package com.ecobazaar.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import java.util.stream.Collectors;
import com.ecobazaar.payload.ApiResponse;

import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Product not found
    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ApiResponse<String>> handleProductNotFound(ProductNotFoundException ex) {
    	System.out.println("ProductNotFoundException handled");

        ApiResponse<String> response =
                new ApiResponse<>(404, ex.getMessage(), null);

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // Cart empty
    @ExceptionHandler(CartEmptyException.class)
    public ResponseEntity<ApiResponse<String>> handleCartEmpty(CartEmptyException ex) {

        ApiResponse<String> response =
                new ApiResponse<>(400, ex.getMessage(), null);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Generic exception (fallback)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneralException(Exception ex,
                                                    HttpServletRequest request) {

        // Allow Swagger endpoints to work normally
        if (request.getRequestURI().contains("/v3/api-docs")) {
            throw new RuntimeException(ex);
        }

        ApiResponse<String> response =
                new ApiResponse<>(500, "Internal Server Error", null);

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<String>> handleValidationException(
            MethodArgumentNotValidException ex) {

        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + " : " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        ApiResponse<String> response =
                new ApiResponse<>(400, errorMessage, null);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}