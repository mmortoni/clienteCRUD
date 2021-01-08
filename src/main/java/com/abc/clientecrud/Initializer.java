package com.abc.clientecrud;

import java.util.HashSet;
import java.util.Optional;
import java.util.Random;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Component;

import com.abc.clientecrud.model.Cliente;
import com.abc.clientecrud.model.Email;
import com.abc.clientecrud.model.Role;
import com.abc.clientecrud.model.Telefone;
import com.abc.clientecrud.model.User;
import com.abc.clientecrud.model.constant.TipoFone;
import com.abc.clientecrud.repository.ClienteRepository;
import com.abc.clientecrud.repository.EmailRepository;
import com.abc.clientecrud.repository.TelefoneRepository;
import com.abc.clientecrud.repository.UserRepository;

@Component
class Initializer implements CommandLineRunner {

	private final ClienteRepository clienteRepository;
	private final TelefoneRepository telefoneRepository;
	private final EmailRepository emailRepository;

	private final UserRepository userRepository;

	static final Random random = new Random();
	static final int startChar = (int) '0';
	static final int endChar = (int) '9';
	private Set<Telefone> telefones;
	private Set<Email> emails;
	private Cliente cliente;

	public Initializer(ClienteRepository clienteRepository, TelefoneRepository telefoneRepository,
			EmailRepository emailRepository, UserRepository userRepository) {
		this.clienteRepository = clienteRepository;
		this.telefoneRepository = telefoneRepository;
		this.emailRepository = emailRepository;
		this.userRepository = userRepository;
	}

	// @SuppressWarnings("null")
	@Override
	public void run(String... strings) {
		// User
		Role roleAdmin = new Role();
		Role roleUser = new Role();
		roleAdmin.setDescription("Admin role");
		roleAdmin.setName("ADMIN");
		roleUser.setDescription("User role");
		roleUser.setName("USER");
		Set<Role> roles = new HashSet<Role>();
		roles.add(roleAdmin);
		roles.add(roleUser);

		// ADMIN
		User newUser = new User();
		// newUser.setId(1);
		newUser.setUsername("Admin");
		newUser.setPassword("$2a$04$2ckIiWOmCEc0ON0JQwoHU.HP.i5IctOiMo/02Ye6tXmX72bk0B8XG");
		newUser.setRoles(roles);
		userRepository.save(newUser);

		// USER
		roleUser = new Role();
		roleUser.setDescription("User role");
		roleUser.setName("USER");
		roles = new HashSet<Role>();
		roles.add(roleUser);

		newUser = new User();
		// newUser.setId(2);
		newUser.setUsername("Comum");
		newUser.setPassword("$2a$04$2ckIiWOmCEc0ON0JQwoHU.HP.i5IctOiMo/02Ye6tXmX72bk0B8XG");
		newUser.setRoles(roles);
		userRepository.save(newUser);

		clienteRepository.deleteAll();
		
		cliente = new Cliente("Guirard Saree", "12345678912", "72020022", "Praça da Sé", "lado par", "Cruzeiro",
				"Brasilia", "DF", geraTelefones(),  geraEmails("sguirard0@cbslocal.com"));
		cliente = clienteRepository.saveAndFlush(cliente);
		
		cliente = new Cliente("Mathiasen Allsun", "12345678912", "73031501", "Praça da Sé", "lado par", "Cruzeiro",
				"Brasilia", "DF", geraTelefones(),  geraEmails("amathiasen1@moonfruit.com"));
		clienteRepository.saveAndFlush(cliente);

		cliente = new Cliente("Bausor Pen", "12345678912", "73031601", "Praça da Sé", "lado par", "Cruzeiro",
				"Brasilia", "DF", geraTelefones(),  geraEmails("pbausor2@ftc.gov"));
		clienteRepository.saveAndFlush(cliente);

		cliente = new Cliente("Worsham Frank", "12345678912", "73031573", "Praça da Sé", "lado par", "Cruzeiro",
				"Brasilia", "DF", geraTelefones(),  geraEmails("fworsham3@scribd.com"));
		clienteRepository.saveAndFlush(cliente);

		cliente = new Cliente("Yea Elijah", "12345678912", "73031673", "Praça da Sé", "lado par", "Cruzeiro",
				"Brasilia", "DF", geraTelefones(),  geraEmails("eyea4@liveinternet.ru"));
		clienteRepository.saveAndFlush(cliente);

		cliente = new Cliente("Stuckes Steven", "12345678912", "72410140", "Praça da Sé", "lado par", "Cruzeiro",
				"Brasilia", "DF", geraTelefones(),  geraEmails("sstuckes5@nationalgeographic.com"));
		clienteRepository.saveAndFlush(cliente);

		cliente = new Cliente("Berthot Lukas", "12345678912", "72410143", "Praça da Sé", "lado par", "Cruzeiro",
				"Brasilia", "DF", geraTelefones(),  geraEmails("lberthot6@reverbnation.com"));
		clienteRepository.saveAndFlush(cliente);

		cliente = new Cliente("Gerritzen Vicki", "12345678912", "72410149", "Praça da Sé", "lado par", "Cruzeiro",
				"Brasilia", "DF", geraTelefones(),  geraEmails("vgerritzen7@nba.com"));
		clienteRepository.saveAndFlush(cliente);

		cliente = new Cliente("Quilter Shanie", "12345678912", "71681030", "Praça da Sé", "lado par", "Cruzeiro",
				"Brasilia", "DF", geraTelefones(),  geraEmails("squilter8@illinois.edu"));
		clienteRepository.saveAndFlush(cliente);

		cliente = new Cliente("Kimbury Goran", "12345678912", "71681035", "Praça da Sé", "lado par", "Cruzeiro",
				"Brasilia", "DF", geraTelefones(),  geraEmails("gkimbury9@springer.com"));
		clienteRepository.saveAndFlush(cliente);

		clienteRepository.findAll().forEach(System.out::println);
//		telefoneRepository.findAll().forEach(System.out::println);
//		emailRepository.findAll().forEach(System.out::println);
	}

	private Set<Email> geraEmails(final String email) {
		emails = new HashSet<Email>();
		emails.add(new Email(email));

		return emails;
	}

	private Set<Telefone> geraTelefones() {
		telefones = new HashSet<Telefone>();

		telefones.add(new Telefone(TipoFone.RESIDENCIAL, "113" + randomString(7)));
		telefones.add(new Telefone(TipoFone.COMERCIAL, "112" + randomString(7)));
		telefones.add(new Telefone(TipoFone.CELULAR, "119" + randomString(8)));

		return telefones;
	}

	static String randomString(final int length) {
		return random.ints(length, startChar, endChar + 1)
				.collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append).toString();
	}
}
