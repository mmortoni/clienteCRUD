/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */

/** Regular expressions */
export const reEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const isKthBitSet = (bitMask, flag) => Boolean(bitMask & flag)

// If number is power of two then and then only its binary representation contains only one '1'.
// A utility function to check whether n is a power of 2 or not.
export const isPowerOfTwo = (n) => n && (!(n & (n - 1)))

// Returns position of the only set bit in 'n'
export const findPosition = (num) => {
  if (!isPowerOfTwo(num)) return -1

  let i = 1
  let pos = 1

  // Iterate through bits of n till we find a set bit
  // i&n will be non-zero only when 'i' and 'n' have a set bit
  // at same position
  while (!(i & num)) {
    // Unset current bit and set the next bit in 'i'
    i <<= 1

    // increment position
    ++pos
  }

  return pos
}

const bitMaskHasFlag = (bitMask, flags) => {
  let hasFlag = false

  flags.some((element) => {
    hasFlag = isKthBitSet(bitMask, element)
    return hasFlag
  })

  return hasFlag
}

export const setMask = (num) => {
  const position = (findPosition(num) - 1)

  return (1 << position)
}

export const setBit = (num, position) => num | setMask(position)

// We use the ~/NOT operator after placing the bit
// We want 1s everywhere and 0 only where we want to modify
// let mask = ~(1 << position)

// We use AND which will modify only the bits compared to 0
// return num & mask
export const clearBit = (num, position) => num & ~(setMask(position))

// let mask = 1 << position
// If the current state of the bit is 0, XOR will return 1
// If the bit is 1, XOR will set it to 0
//  return num ^ mask
export const flipBit = (num, position) => num ^ setMask(position)

export const MODAL = {
  ADD: {
    CLIENTE_OPEN: 1 << 8,
    FONE_OPEN: 1 << 5,
    EMAIL_OPEN: 1 << 2,
  },
  EDIT: {
    CLIENTE_OPEN: 1 << 7,
    FONE_OPEN: 1 << 4,
    EMAIL_OPEN: 1 << 1,
  },
  DELETE: {
    CLIENTE_OPEN: 1 << 6,
    FONE_OPEN: 1 << 3,
    EMAIL_OPEN: 1 << 0,
  },
}

const getClienteTitulo = (bitMask) => {
  let titulo

  if (isKthBitSet(bitMask, MODAL.ADD.CLIENTE_OPEN)) {
    titulo = ENTIDADES.CRUD.INCLUIR
  } else if (isKthBitSet(bitMask, MODAL.EDIT.CLIENTE_OPEN)) {
    titulo = ENTIDADES.CRUD.ALTERAR
  } else if (isKthBitSet(bitMask, MODAL.DELETE.CLIENTE_OPEN)) {
    titulo = ENTIDADES.CRUD.EXCLUIR
  }

  return titulo + ENTIDADES.CLIENTE
}

const getClienteIsOpen = (bitMask) => bitMaskHasFlag(bitMask, [MODAL.ADD.CLIENTE_OPEN, MODAL.EDIT.CLIENTE_OPEN])
const getDeleteClienteIsOpen = (bitMask) => isKthBitSet(bitMask, MODAL.DELETE.CLIENTE_OPEN)
const getTelefoneIsOpen = (bitMask) => bitMaskHasFlag(bitMask, [MODAL.ADD.FONE_OPEN, MODAL.EDIT.FONE_OPEN])
const getEmailIsOpen = (bitMask) => bitMaskHasFlag(bitMask, [MODAL.ADD.EMAIL_OPEN, MODAL.EDIT.EMAIL_OPEN])
const getDeleteFoneIsOpen = (bitMask) => isKthBitSet(bitMask, MODAL.DELETE.FONE_OPEN)
const getDeleteEmailIsOpen = (bitMask) => isKthBitSet(bitMask, MODAL.DELETE.EMAIL_OPEN)

const validatedBtnSalvarCliente = (state) => {
  try {
    const {
      id, nome, cpf, cep, logradouro, bairro, cidade, uf, telefones, emails,
    } = state.cliente

    return (id.toString().length > 0
      && nome.length >= 3 && nome.length <= 100
      && cpf.length > 0
      && cep.length > 0
      && logradouro.length > 0
      && bairro.length > 0
      && cidade.length > 0
      && uf.length > 0
      && telefones.length > 0
      && emails.length > 0)
  } catch (e) {
    return false
  }
}

const validatedBtnSalvarTelefone = (state) => {
  try {
    const { id, tipo, numero } = state.telefone

    return (id.toString().length > 0
      && ['RESIDENCIAL', 'COMERCIAL', 'CELULAR'].includes(tipo)
      && numero.length > 0
    )
  } catch (error) {
    return false
  }
}

const validatedBtnSalvarEmail = (state) => {
  try {
    const { id, endereco } = state.email

    return (id.toString().length > 0
      && reEmail.test(String(endereco).toLowerCase())
    )
  } catch (error) {
    return false
  }
}

const validatedBtnDeleteCliente = (state) => {
  try {
    const { id, nome, cpf } = state.cliente

    return (id.toString().length > 0 && nome.length > 0 && cpf.length > 0)
  } catch (error) {
    return false
  }
}
const validatedBtnDeleteTelefone = (state) => {
  try {
    const { id, tipo, numero } = state.telefone

    return (id.toString().length > 0 && tipo.length > 0 && numero.length > 0)
  } catch (error) {
    return false
  }
}

const validatedBtnDeleteEmail = (state) => {
  try {
    const { id, endereco } = state.email

    return (id.toString().length > 0
      && reEmail.test(String(endereco).toLowerCase()))
  } catch (error) {
    return false
  }
}

export const ENTIDADES = {
  CLIENTE: ' Cliente',
  TELEFONE: ' Telefone',
  EMAIL: ' E-mail',
  CRUD: {
    INCLUIR: 'Incluir',
    ALTERAR: 'Alterar',
    EXCLUIR: 'Excluir',
  },
  getEntidades: (bitMask, state) => (
    {
      Cliente: {
        titulo: getClienteTitulo(bitMask),
        isOpen: getClienteIsOpen(bitMask),
        deleteIsOpen: getDeleteClienteIsOpen(bitMask),
        isBtnSalvarEnabled: validatedBtnSalvarCliente(state),
        isBtnDeleteEnabled: getDeleteClienteIsOpen(bitMask) ? validatedBtnDeleteCliente(state) : false,

      },
      Telefone: {
        titulo: getTelefoneTitulo(bitMask),
        isOpen: getTelefoneIsOpen(bitMask),
        deleteIsOpen: getDeleteFoneIsOpen(bitMask),
        isBtnSalvarEnabled: validatedBtnSalvarTelefone(state),
        isBtnDeleteEnabled: validatedBtnDeleteTelefone(state),
      },
      Email: {
        titulo: getEmailTitulo(bitMask),
        isOpen: getEmailIsOpen(bitMask),
        deleteIsOpen: getDeleteEmailIsOpen(bitMask),
        isBtnSalvarEnabled: validatedBtnSalvarEmail(state),
        isBtnDeleteEnabled: validatedBtnDeleteEmail(state),
      },
    }
  ),
}

const getTelefoneTitulo = (bitMask) => {
  let titulo

  if (isKthBitSet(bitMask, MODAL.ADD.FONE_OPEN)) {
    titulo = ENTIDADES.CRUD.INCLUIR
  } else if (isKthBitSet(bitMask, MODAL.EDIT.FONE_OPEN)) {
    titulo = ENTIDADES.CRUD.ALTERAR
  } else if (isKthBitSet(bitMask, MODAL.DELETE.FONE_OPEN)) {
    titulo = ENTIDADES.CRUD.EXCLUIR
  }

  return titulo + ENTIDADES.TELEFONE
}

const getEmailTitulo = (bitMask) => {
  let titulo

  if (isKthBitSet(bitMask, MODAL.ADD.EMAIL_OPEN)) {
    titulo = ENTIDADES.CRUD.INCLUIR
  } else if (isKthBitSet(bitMask, MODAL.EDIT.EMAIL_OPEN)) {
    titulo = ENTIDADES.CRUD.ALTERAR
  } else if (isKthBitSet(bitMask, MODAL.DELETE.EMAIL_OPEN)) {
    titulo = ENTIDADES.CRUD.EXCLUIR
  }

  return titulo + ENTIDADES.EMAIL
}
