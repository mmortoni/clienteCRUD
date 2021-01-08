package com.abc.clientecrud.model;

import javax.persistence.*;

import org.springframework.data.domain.Persistable;

import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.ToString;

@Data
@EqualsAndHashCode(exclude = {"telefones", "emails"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "cliente")
public class Cliente implements Persistable<Long> {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NonNull
	private String nome;
	@NonNull
	private String cpf;
	@NonNull
	private String cep;
	@NonNull
	private String logradouro;

	private String complemento;

	@NonNull
	private String bairro;
	@NonNull
	private String cidade;
	@NonNull
	private String uf;

	@NonNull
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "cliente", orphanRemoval = true)
	private Set<Telefone> telefones;

	@NonNull
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "cliente", orphanRemoval = true)
	private Set<Email> emails;

	public Cliente(String nome, String cpf, String cep, String logradouro, String complemento, String bairro,
			String cidade, String uf, Set<Telefone> telefones, Set<Email> emails) {
		super();
		this.nome = nome;
		this.cpf = cpf;
		this.cep = cep;
		this.logradouro = logradouro;
		this.complemento = complemento;
		this.bairro = bairro;
		this.cidade = cidade;
		this.uf = uf;
		this.telefones = telefones;
		this.emails = emails;
		this.telefones.forEach(f -> f.setCliente(this));
		this.emails.forEach(e -> e.setCliente(this));
	}

	public void addTelefones(Set<Telefone> telefones) {
		this.telefones.clear();
		this.telefones.addAll(telefones);
		this.telefones.forEach(f -> f.setCliente(this));
	}

	public void addEmails(Set<Email> emails) {
		this.emails.clear();
		this.emails.addAll(emails);
		this.emails.forEach(e -> e.setCliente(this));
	}

	@Override
	public boolean isNew() {
		return id == null;
	}
}
