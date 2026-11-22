package com.tutornearme.dto;

import com.tutornearme.model.Tutor;
import lombok.*;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Response DTO for tutor information")
public class TutorResponseDto {

    @Schema(description = "Unique identifier", example = "1")
    private Long id;

    @Schema(description = "Tutor's full name", example = "Jane Smith")
    private String name;

    @Schema(description = "Subject taught", example = "Math")
    private String subject;

    @Schema(description = "Tutor's location", example = "San Francisco, CA")
    private String location;

    @Schema(description = "Tutor's rating", example = "4.5")
    private BigDecimal rating;

    @Schema(description = "Tutor's availability", example = "FLEXIBLE")
    private String availability;

    @Schema(description = "Creation timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Last update timestamp")
    private LocalDateTime updatedAt;

    public static TutorResponseDto fromEntity(Tutor tutor) {
        return TutorResponseDto.builder()
                .id(tutor.getId())
                .name(tutor.getName())
                .subject(tutor.getSubject())
                .location(tutor.getLocation())
                .rating(tutor.getRating())
                .availability(tutor.getAvailability().name())
                .createdAt(tutor.getCreatedAt())
                .updatedAt(tutor.getUpdatedAt())
                .build();
    }
}