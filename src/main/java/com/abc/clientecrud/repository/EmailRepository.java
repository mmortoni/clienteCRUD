package com.abc.clientecrud.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.abc.clientecrud.model.Email;

@Repository
public interface EmailRepository extends JpaRepository<Email, Long> {
}
