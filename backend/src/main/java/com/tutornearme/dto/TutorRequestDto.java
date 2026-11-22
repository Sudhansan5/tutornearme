package com.tutornearme.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request DTO for creating/updating a tutor")
public class TutorRequestDto {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Schema(description = "Tutor's full name", example = "Jane Smith", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    @NotBlank(message = "Subject is required")
    @Size(min = 2, max = 50, message = "Subject must be between 2 and 50 characters")
    @Schema(description = "Subject taught by the tutor", example = "Math", requiredMode = Schema.RequiredMode.REQUIRED)
    private String subject;

    @NotBlank(message = "Location is required")
    @Size(min = 2, max = 100, message = "Location must be between 2 and 100 characters")
    @Schema(description = "Tutor's location (city/area)", example = "San Francisco, CA", requiredMode = Schema.RequiredMode.REQUIRED)
    private String location;

    @DecimalMin(value = "0.0", message = "Rating must be at least 0.0")
    @DecimalMax(value = "5.0", message = "Rating cannot exceed 5.0")
    @Schema(description = "Tutor's rating (0.0 - 5.0)", example = "4.5", defaultValue = "0.0")
    private BigDecimal rating = BigDecimal.ZERO;

    @Schema(description = "Tutor's availability", example = "FLEXIBLE", allowableValues = {"WEEKDAYS", "WEEKENDS", "FLEXIBLE", "ONLINE_ONLY"}, defaultValue = "FLEXIBLE")
    private String availability = "FLEXIBLE";
}