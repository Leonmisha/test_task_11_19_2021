import { CRYPTO_CURRENCIES } from './currency'
import { generateRandomNumber } from './common'

const getLoginFromCache = () => JSON.parse(localStorage.getItem('auth'))

export const setLoginToCache = (loginInfo) => {
  const loginInfoStringified = JSON.stringify(loginInfo)
  if (localStorage.getItem('auth') !== loginInfoStringified) {
    localStorage.setItem('auth', JSON.stringify(loginInfo))
  }
}

const generateWallets = () => CRYPTO_CURRENCIES.map(
  ({ symbol }) => ({ symbol, balance: generateRandomNumber(0, 1.5) })
)

const generateToken = () => 'sdf389dxbf1sdz51fga65dfg74asdf'

export const authorize = async ({ email, password }) => {
  const trulyUserInfo = getLoginFromCache()
  if (trulyUserInfo.email !== email || trulyUserInfo.password !== password) {
    throw new Error('Incorrect email or password')
  }
  return {
    email,
    token: generateToken(),
    wallets: generateWallets(),
    apiKey: 'e6d107f2e651150cacd15eac68f74fa7646ce27b037786e5b9727cbd0a6d4694'
  }
}
