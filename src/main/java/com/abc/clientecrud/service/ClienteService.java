package com.abc.clientecrud.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.abc.clientecrud.model.Cliente;
import com.abc.clientecrud.repository.ClienteRepository;
import com.abc.clientecrud.service.error.ErrorResponse;

import io.vavr.control.Either;

@Service
public class ClienteService {
    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public Either<Object, List<Cliente>> findAll() {
        return Either.right(clienteRepository.findAll());
    }

    public Either<ErrorResponse, Cliente> create(Cliente cliente) {
        return Either.right(cliente);
    }

    public Either<ErrorResponse, Cliente> detonate(String id) {
//        return clienteRepository.findAll().stream()
//            .filter(cliente -> cliente.id.equals(id))
//            .findAny()
//            .map(this::detonate)
//            .orElseGet(() -> notFound(id));
        return null;
    }

    public Either<ErrorResponse, Cliente> detonate(Cliente cliente) {
//        if(!cliente.isDetonated) {
//        	cliente.isDetonated = true;
//            return Either.right(cliente);
//        } else {
//            return alreadyDetonated(cliente.id);
//        }
        
        return null;
    }

    private Either<ErrorResponse, Cliente> notFound(String id) {
        return Either.left(ErrorResponse.notFound(String.format("Cliente não encontrado com o id: %s", id)));
    }

    private Either<ErrorResponse, Cliente> alreadyDetonated(String id) {
        return Either.left(ErrorResponse.badRequest(String.format("Cliente excluído com id: %s", id)));
    }

}
