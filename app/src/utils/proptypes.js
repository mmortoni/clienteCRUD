import PropTypes from 'prop-types'

export const data = {
  username: PropTypes.string,
  password: PropTypes.string,
}

export const user = {
  id: PropTypes.number,
  username: PropTypes.string,
  password: PropTypes.string,
}

export const telefone = {
  id: PropTypes.number,
  tipo: PropTypes.string,
  numero: PropTypes.string,
}

export const email = {
  id: PropTypes.number,
  endereco: PropTypes.string,
}

export const cliente = {
  id: PropTypes.number,
  nome: PropTypes.string,
  cpf: PropTypes.string,
  cep: PropTypes.string,
  logradouro: PropTypes.string,
  complemento: PropTypes.string,
  bairro: PropTypes.string,
  cidade: PropTypes.string,
  uf: PropTypes.string,
  telefones: PropTypes.arrayOf(PropTypes.shape(telefone)).isRequired,
  emails: PropTypes.arrayOf(PropTypes.shape(email)).isRequired,
}

export const message = {
  body: PropTypes.string,
  time: PropTypes.date,
}
