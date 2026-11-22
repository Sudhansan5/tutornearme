package com.tutornearme.dto;

import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Error response structure")
public class ErrorResponse {

    @Schema(description = "Timestamp of the error", example = "2024-01-15T10:30:00")
    private LocalDateTime timestamp;

    @Schema(description = "HTTP status code", example = "404")
    private int status;

    @Schema(description = "Error type", example = "Not Found")
    private String error;

    @Schema(description = "Error message", example = "Tutor not found with ID: 1")
    private String message;

    @Schema(description = "Request path", example = "/api/tutors/1")
    private String path;

    @Schema(description = "Additional error details")
    private Map<String, String> details;
}