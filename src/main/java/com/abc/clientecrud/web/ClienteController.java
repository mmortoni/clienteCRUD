package com.abc.clientecrud.web;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.net.URISyntaxException;
import java.security.Principal;
import java.time.Instant;
import java.util.Collection;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.abc.clientecrud.model.Cliente;
import com.abc.clientecrud.model.Email;
import com.abc.clientecrud.model.Registro;
import com.abc.clientecrud.model.Telefone;
import com.abc.clientecrud.repository.ClienteRepository;
import com.abc.clientecrud.repository.RegistroRepository;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/v1")
@Transactional(Transactional.TxType.REQUIRED)
class ClienteController {

	private final Logger log = LoggerFactory.getLogger(ClienteController.class);

	private ClienteRepository repository;
	private RegistroRepository registroRepository;
	
	public ClienteController(ClienteRepository repository, RegistroRepository registroRepository) {
		this.repository = repository;
		this.registroRepository = registroRepository;
	}

	@GetMapping("/clientes")
	Collection<Cliente> clientes() {
        return repository.findAll();
	}

	@GetMapping("/clientes/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	ResponseEntity<?> getCliente(@PathVariable long id) {
		Optional<Cliente> cliente = repository.findById(id);

		return cliente.map(response -> ResponseEntity.ok().body(response))
				.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@PostMapping("/clientes")
	@PreAuthorize("hasRole('ADMIN')")
	ResponseEntity<Cliente> createCliente(@Valid @RequestBody Cliente cliente, Principal principal) throws URISyntaxException {
		log.info("Request to create cliente: {}", cliente);
		registrarOperacao(String.format("Request to create cliente: {%s} ", cliente), principal.getName());
		
		cliente.getTelefones().forEach(f -> f.setCliente(cliente));
		cliente.getEmails().forEach(e -> e.setCliente(cliente));

        Cliente result = repository.save(cliente);
        
        repository.findAll().forEach(System.out::println);

        return ResponseEntity.ok().body(result);
	}

	@PutMapping("/clientes")
	@PreAuthorize("hasRole('ADMIN')")
	ResponseEntity<Cliente> updateCliente(@Valid @RequestBody Cliente cliente, Principal principal) {
		log.info("Request to update cliente: {}", cliente);
		registrarOperacao(String.format("Request to update cliente: {%s} ", cliente), principal.getName());
		
		Cliente clienteFromDb = repository.findById(cliente.getId())
				.orElseThrow(() -> new ResourceNotFoundException());
		
		clienteFromDb.setNome(cliente.getNome());
		clienteFromDb.setCpf(cliente.getCpf());
		clienteFromDb.setCep(cliente.getCep());
		clienteFromDb.setLogradouro(cliente.getLogradouro());
		clienteFromDb.setComplemento(cliente.getComplemento());
		clienteFromDb.setBairro(cliente.getBairro());
		clienteFromDb.setCidade(cliente.getCidade());
		clienteFromDb.setUf(cliente.getUf());
		clienteFromDb.addTelefones(cliente.getTelefones());
		clienteFromDb.addEmails(cliente.getEmails());
		
		Cliente updatedCliente = repository.saveAndFlush(clienteFromDb);
		
		return ResponseEntity.ok().body(updatedCliente);
	}

	@DeleteMapping("/clientes/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> deleteCliente(@PathVariable long id, Principal principal) {
		log.info("Request to delete cliente: {}", id);
		registrarOperacao(String.format("Request to delete cliente: %d ", id), principal.getName());
		
		repository.deleteById(id);
		return ResponseEntity.ok().build();
	}
	
	private void registrarOperacao(String jpql, String usuario) {
		Registro registro = new Registro();
		registro.setData(Instant.now());
		registro.setUsuario(usuario);
		registro.setJpql(jpql);
		
		registroRepository.save(registro);
	}
}
