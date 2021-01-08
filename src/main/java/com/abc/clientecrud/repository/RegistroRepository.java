package com.abc.clientecrud.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.abc.clientecrud.model.Registro;

@Repository
public interface RegistroRepository extends JpaRepository<Registro, Long> {
}
