import Vue from 'vue'
import Vuex from 'vuex'

import { startStream, subscribe, unSubscribe } from '@/api'
import { authorize } from '@/helpers/auth'
import { CRYPTO_CURRENCIES } from '@/helpers/currency'

const wallets = CRYPTO_CURRENCIES.reduce((prev, current) => ({
  ...prev,
  [current.symbol]: { ...current, balance: 0, rate: 0 }
}), {})

const OHLC_CANDLES = CRYPTO_CURRENCIES.reduce((prev, current) => ({
  ...prev,
  [current.symbol]: {}
}), {})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAuth: false,
    user: null,
    wallets,
    apiKey: '',
    streamer: null,
    OHLC_CANDLES
  },
  mutations: {
    setAuth (state, auth = true) {
      state.isAuth = auth
    },
    setUser (state, user) {
      state.user = user
    },
    setWalletBalance (state, { symbol, balance }) {
      state.wallets[symbol].balance = balance
    },
    setWalletRate (state, { symbol, rate }) {
      state.wallets[symbol].rate = rate
    },
    setStreamer (state, streamer) {
      state.streamer = streamer
    },
    setOHLC (state, { symbol, record }) {
      state.OHLC_CANDLES[symbol][record.time] = record
    },
    setOHLCGlobal (state, { symbol, newValue }) {
      state.OHLC_CANDLES[symbol] = newValue
    },
    setApiKey (state, apiKey) {
      state.apiKey = apiKey
    }
  },
  actions: {
    async login ({ commit, getters }, user) {
      const userInfo = await authorize(user)
      commit('setUser', { email: userInfo.email, token: userInfo.token })
      const wallets = userInfo.wallets
      wallets.forEach((wallet) => commit('setWalletBalance', wallet))
      commit('setApiKey', userInfo.apiKey)
      commit('setAuth')
      commit('setStreamer', startStream(getters.apiKey))
      return true
    },
    setWalletRate ({ commit }, symbolWithRate) {
      commit('setWalletRate', symbolWithRate)
    },
    subscribeChannelsStream ({ commit, getters }, subs) {
      let streamer = getters.streamer
      if (!(streamer instanceof WebSocket) || [2, 3].includes(streamer.readyState)) {
        streamer = startStream(getters.apiKey)
        commit('setStreamer', streamer)
      }
      if (streamer.readyState === 0) {
        streamer.addEventListener('open', () => subscribe(streamer, subs))
      } else {
        subscribe(streamer, subs)
      }
    },
    unSubscribeChannelsStream ({ commit, getters }, subs) {
      const streamer = getters.streamer
      if (!(streamer instanceof WebSocket) || [2, 3].includes(streamer.readyState)) {
        return true
      }
      if (streamer.readyState === 0) {
        streamer.addEventListener('open', () => unSubscribe(streamer, subs))
      } else {
        unSubscribe(streamer, subs)
      }
    },
    subscribeMessagesStream ({ getters }, cb) {
      getters.streamer.addEventListener('message', cb)
    },
    unSubscribeMessagesStream ({ getters }, cb) {
      getters.streamer.removeEventListener('message', cb)
    },
    setOHLC ({ commit }, symbolWithRecord) {
      commit('setOHLC', symbolWithRecord)
    },
    setOHLCGlobal ({ commit }, symbolWithNewValue) {
      commit('setOHLCGlobal', symbolWithNewValue)
    }
  },
  getters: {
    isAuth: state => state.isAuth,
    wallets: state => state.wallets,
    apiKey: state => state.apiKey,
    streamer: state => state.streamer,
    OHLC: state => state.OHLC_CANDLES
  }
})
