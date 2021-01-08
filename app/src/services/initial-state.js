/* eslint-disable no-bitwise */

function* UUIDGenerator () {
  while (true) {
    // eslint-disable-next-line
    yield 'new-xxxxxxxxxxxx'.replace(/[x]/g, function (c) {
      // Timestamp
      let d = new Date().getTime()
      // Time in microseconds since page-load or 0 if unsupported
      // eslint-disable-next-line no-undef
      let d2 = (performance && performance.now && (performance.now() * 1000)) || 0
      // random number between 0 and 16
      let r = Math.random() * 16

      if (d > 0) { // Use timestamp until depleted
        r = (d + r) % 16 | 0
        d = Math.floor(d / 16)
      } else { // Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0
        d2 = Math.floor(d2 / 16)
      }

      return (c === 'x' ? r : ((r & 0x3) | 0x8)).toString(16)
    })
  }
}

const UUID = UUIDGenerator()

const cliente = {
  CLIENTE: {
    id: null,
    nome: '',
    cpf: '',
    cep: '',
    logradouro: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    telefones: [],
    emails: [],
  },
}

const telefone = {
  TELEFONE: {
    id: null,
    tipo: '',
    numero: '',
  },
}

const email = {
  EMAIL: {
    id: null,
    endereco: '',
  },
}

// constructor
const create = () => {
  // Create interfaces
  const Cliente = () => ({ ...cliente.CLIENTE, id: UUID.next().value })

  const Telefone = () => ({ ...telefone.TELEFONE, id: UUID.next().value })

  const Email = () => ({ ...email.EMAIL, id: UUID.next().value })

  return {
    // a list of the API functions from STEP 2
    Cliente,
    Telefone,
    Email,
  }
}

// let's return back our createInitialState method as the default.
export default {
  create,
}
