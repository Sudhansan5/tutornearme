package com.tutornearme.dto;

import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Request DTO for searching tutors")
public class TutorSearchRequestDto {

    @Schema(description = "Location to search for tutors", example = "Delhi", requiredMode = Schema.RequiredMode.REQUIRED)
    private String location;

    @Schema(description = "Optional subject filter", example = "Math")
    private String subject;

    @Schema(description = "Minimum rating filter", example = "4.0")
    private BigDecimal minRating;

    @Schema(description = "Availability filter", example = "FLEXIBLE", allowableValues = {"WEEKDAYS", "WEEKENDS", "FLEXIBLE", "ONLINE_ONLY"})
    private String availability;

    @Schema(description = "Page number (0-based)", example = "0", defaultValue = "0")
    private Integer page = 0;

    @Schema(description = "Page size", example = "10", defaultValue = "10")
    private Integer size = 10;
}