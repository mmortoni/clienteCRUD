package com.abc.clientecrud.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "registro")
public class Registro implements java.io.Serializable {

    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NonNull
    private Instant data;
    @NonNull
    private String usuario;
    @Lob
    @NonNull
    private String jpql;
}
