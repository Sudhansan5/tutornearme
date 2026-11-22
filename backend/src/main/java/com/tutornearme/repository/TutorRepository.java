package com.tutornearme.repository;

import com.tutornearme.model.Tutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TutorRepository extends JpaRepository<Tutor, Long> {

    /**
     * Find tutors by location (case-insensitive partial match)
     */
    @Query("SELECT t FROM Tutor t WHERE LOWER(t.location) LIKE LOWER(CONCAT('%', :location, '%'))")
    List<Tutor> findByLocationContainingIgnoreCase(@Param("location") String location);

    /**
     * Find tutors by location and subject (both case-insensitive partial match)
     */
    @Query("SELECT t FROM Tutor t WHERE LOWER(t.location) LIKE LOWER(CONCAT('%', :location, '%')) "
            + "AND LOWER(t.subject) LIKE LOWER(CONCAT('%', :subject, '%'))")
    List<Tutor> findByLocationAndSubjectContainingIgnoreCase(
            @Param("location") String location,
            @Param("subject") String subject);

    /**
     * Find all tutors ordered by rating descending
     */
    @Query("SELECT t FROM Tutor t ORDER BY t.rating DESC")
    List<Tutor> findAllOrderByRatingDesc();

    /**
     * Check if a tutor with the same name and location exists
     */
    @Query("SELECT COUNT(t) FROM Tutor t WHERE LOWER(t.name) = LOWER(:name) AND LOWER(t.location) = LOWER(:location)")
    long countByNameAndLocationIgnoreCase(@Param("name") String name, @Param("location") String location);
}