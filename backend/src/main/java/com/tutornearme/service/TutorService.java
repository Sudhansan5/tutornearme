package com.tutornearme.service;

import com.tutornearme.dto.TutorRequestDto;
import com.tutornearme.dto.TutorResponseDto;
import com.tutornearme.dto.TutorSearchRequestDto;
import com.tutornearme.exception.TutorAlreadyExistsException;
import com.tutornearme.exception.TutorNotFoundException;
import com.tutornearme.model.Tutor;
import com.tutornearme.repository.TutorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TutorService {

    private final TutorRepository tutorRepository;

    /**
     * Register a new tutor
     */
    public TutorResponseDto registerTutor(TutorRequestDto requestDto) {
        log.info("Registering new tutor: {} at location: {}", requestDto.getName(), requestDto.getLocation());

        // Check if tutor with same name and location already exists
        long existingCount = tutorRepository.countByNameAndLocationIgnoreCase(
                requestDto.getName(), requestDto.getLocation());
        if (existingCount > 0) {
            throw new TutorAlreadyExistsException(
                    "A tutor with name '" + requestDto.getName() + "' already exists in '" + requestDto.getLocation() + "'");
        }

        // Map request to entity
        Tutor tutor = Tutor.builder()
                .name(requestDto.getName().trim())
                .subject(requestDto.getSubject().trim())
                .location(requestDto.getLocation().trim())
                .rating(requestDto.getRating())
                .availability(Tutor.Availability.valueOf(requestDto.getAvailability().toUpperCase()))
                .build();

        Tutor savedTutor = tutorRepository.save(tutor);
        log.info("Tutor registered successfully with ID: {}", savedTutor.getId());

        return TutorResponseDto.fromEntity(savedTutor);
    }

    /**
     * Search tutors by location and optional filters
     */
    @Transactional(readOnly = true)
    public List<TutorResponseDto> searchTutors(TutorSearchRequestDto searchDto) {
        log.info("Searching tutors in location: {} with subject filter: {}",
                searchDto.getLocation(), searchDto.getSubject());

        List<Tutor> tutors;

        // Apply filters based on provided parameters
        if (searchDto.getSubject() != null && !searchDto.getSubject().isBlank()
                && !"All".equalsIgnoreCase(searchDto.getSubject())) {
            tutors = tutorRepository.findByLocationAndSubjectContainingIgnoreCase(
                    searchDto.getLocation().trim(), searchDto.getSubject().trim());
        } else {
            tutors = tutorRepository.findByLocationContainingIgnoreCase(searchDto.getLocation().trim());
        }

        // Apply additional filters in memory (for demo simplicity)
        // In production, these would be moved to database queries
        tutors = tutors.stream()
                .filter(t -> searchDto.getMinRating() == null || t.getRating().compareTo(searchDto.getMinRating()) >= 0)
                .filter(t -> searchDto.getAvailability() == null
                        || searchDto.getAvailability().isBlank()
                        || t.getAvailability().name().equalsIgnoreCase(searchDto.getAvailability()))
                .sorted((t1, t2) -> t2.getRating().compareTo(t1.getRating())) // Sort by rating desc
                .collect(Collectors.toList());

        log.info("Found {} tutors matching criteria", tutors.size());

        return tutors.stream()
                .map(TutorResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get all tutors (for admin/debug purposes)
     */
    @Transactional(readOnly = true)
    public List<TutorResponseDto> getAllTutors() {
        return tutorRepository.findAllOrderByRatingDesc().stream()
                .map(TutorResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get tutor by ID
     */
    @Transactional(readOnly = true)
    public TutorResponseDto getTutorById(Long id) {
        Tutor tutor = tutorRepository.findById(id)
                .orElseThrow(() -> new TutorNotFoundException("Tutor not found with ID: " + id));
        return TutorResponseDto.fromEntity(tutor);
    }

    /**
     * Delete tutor by ID
     */
    public void deleteTutor(Long id) {
        if (!tutorRepository.existsById(id)) {
            throw new TutorNotFoundException("Tutor not found with ID: " + id);
        }
        tutorRepository.deleteById(id);
        log.info("Tutor deleted with ID: {}", id);
    }
}