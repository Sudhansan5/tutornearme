package com.tutornearme.controller;

import com.tutornearme.dto.TutorRequestDto;
import com.tutornearme.dto.TutorResponseDto;
import com.tutornearme.dto.TutorSearchRequestDto;
import com.tutornearme.service.TutorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/tutors")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Tutor Management", description = "APIs for registering and searching tutors")
public class TutorController {

    private final TutorService tutorService;

    @PostMapping
    @Operation(summary = "Register a new tutor",
            description = "Creates a new tutor profile with the provided details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Tutor created successfully",
                    content = @Content(schema = @Schema(implementation = TutorResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "409", description = "Tutor already exists at this location")
    })
    public ResponseEntity<TutorResponseDto> registerTutor(
            @Valid @RequestBody TutorRequestDto requestDto) {
        log.info("POST /tutors - Register tutor: {}", requestDto.getName());
        TutorResponseDto response = tutorService.registerTutor(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Search tutors by location",
            description = "Find tutors in a specific location with optional filters")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of tutors found",
                    content = @Content(schema = @Schema(implementation = TutorResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid search parameters")
    })
    public ResponseEntity<List<TutorResponseDto>> searchTutors(
            @Parameter(description = "Location to search (city/area)", required = true, example = "San Francisco")
            @RequestParam String location,
            @Parameter(description = "Optional subject filter", example = "Math")
            @RequestParam(required = false) String subject,
            @Parameter(description = "Minimum rating filter", example = "4.0")
            @RequestParam(required = false) String minRating,
            @Parameter(description = "Availability filter", example = "FLEXIBLE")
            @RequestParam(required = false) String availability) {

        log.info("GET /tutors - Search location: {}, subject: {}", location, subject);

        BigDecimal minRatingValue = (minRating != null && !minRating.isBlank())
                ? new BigDecimal(minRating) : null;

        TutorSearchRequestDto searchDto = TutorSearchRequestDto.builder()
                .location(location)
                .subject(subject)
                .minRating(minRatingValue)
                .availability(availability)
                .build();

        List<TutorResponseDto> tutors = tutorService.searchTutors(searchDto);
        return ResponseEntity.ok(tutors);
    }

    @GetMapping("/all")
    @Operation(summary = "Get all tutors",
            description = "Retrieve all registered tutors sorted by rating (highest first)")
    @ApiResponse(responseCode = "200", description = "List of all tutors")
    public ResponseEntity<List<TutorResponseDto>> getAllTutors() {
        log.info("GET /tutors/all - Retrieve all tutors");
        return ResponseEntity.ok(tutorService.getAllTutors());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get tutor by ID",
            description = "Retrieve a specific tutor by their unique identifier")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tutor found"),
            @ApiResponse(responseCode = "404", description = "Tutor not found")
    })
    public ResponseEntity<TutorResponseDto> getTutorById(
            @Parameter(description = "Tutor ID", required = true, example = "1")
            @PathVariable Long id) {
        log.info("GET /tutors/{} - Get tutor by ID", id);
        return ResponseEntity.ok(tutorService.getTutorById(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a tutor",
            description = "Remove a tutor from the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Tutor deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Tutor not found")
    })
    public ResponseEntity<Void> deleteTutor(
            @Parameter(description = "Tutor ID", required = true, example = "1")
            @PathVariable Long id) {
        log.info("DELETE /tutors/{} - Delete tutor", id);
        tutorService.deleteTutor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Check if the tutor service is running")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Tutor Service is healthy!");
    }
}