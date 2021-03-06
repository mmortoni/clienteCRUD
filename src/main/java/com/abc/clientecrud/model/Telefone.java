package com.abc.clientecrud.model;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.springframework.data.domain.Persistable;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.ToString;

@Data
@ToString(exclude = "cliente")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "telefone")
public class Telefone implements Persistable<Long> {

    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NonNull
    private String tipo;
    @NonNull
    private String numero;
    
    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "cliente_id", nullable = false) 
    @NonNull
    @JsonIgnore
    private Cliente cliente;
    
    public Telefone(String tipo, String numero) {
    	this.tipo = tipo;
    	this.numero = numero;
    }

	@Override
	public boolean isNew() {
		return this.id == null;
	}
}
