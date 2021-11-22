<template>
  <div class="dashboard">
    <b-form-select text-align-center :value="currentCurrency" @input="changeCurrentCurrency" :options="currencyOptions" size="sm" class="mt-3"/>
    <div class="chart" ref="chart"/>
  </div>
</template>

<script>
import { createChart } from 'lightweight-charts'

import { BTC, CRYPTO_CURRENCIES } from '@/helpers/currency'

const subscribeChannels = CRYPTO_CURRENCIES.reduce(
  (prev, current) => {
    prev.set(current, [`24~CCCAGG~${current.symbol}~USD~D`])
    return prev
  },
  new Map()
)

export default {
  name: 'Dashboard',
  data () {
    return {
      currentCurrency: BTC,
      currencyOptions: CRYPTO_CURRENCIES.map(
        (currency) => ({
          value: currency,
          text: currency.name
        })
      ),

      handleMessage: null,

      chart: null,
      candleStickSeries: null
    }
  },
  mounted () {
    this.chart = createChart(this.$refs.chart, { width: 400, height: 300, margin: '0 auto' })
    this.candleStickSeries = this.chart.addCandlestickSeries()
    this.$store.dispatch('setOHLC', { symbol: this.currentCurrency.symbol, newValue: {} })
      .then(() => {
        this.setDataToChart()
        this.handleMessage = ({ data }) => {
          const message = JSON.parse(data)
          if (message.TYPE === '24') {
            const record = {
              time: message.TS,
              open: message.OPEN,
              high: message.HIGH,
              low: message.LOW,
              close: message.CLOSE
            }
            let promise
            // We could check message.ACTION but better to check the store
            if (record.time in this.$store.getters.OHLC[this.currentCurrency.symbol]) {
              promise = this.$store.dispatch('updateOHLCRecord', { symbol: message.FROMSYMBOL, time: record.time, updatedValues: record })
            } else {
              promise = this.$store.dispatch('setOHLCRecord', { symbol: message.FROMSYMBOL, record })
            }
            promise.then((rec) => {
              if (message.FROMSYMBOL === this.currentCurrency.symbol) {
                this.candleStickSeries.update(rec)
              }
            })
          }
        }
        this.$store.dispatch('subscribeChannelsStream', subscribeChannels.get(this.currentCurrency))
          .then(() => this.$store.dispatch('subscribeMessagesStream', this.handleMessage))
      })
  },
  methods: {
    setDataToChart () {
      const OHLCByCurrency = Object.values(this.$store.getters.OHLC[this.currentCurrency.symbol]).sort((a, b) => a.time - b.time)
      this.candleStickSeries.setData(OHLCByCurrency)
    },
    changeCurrentCurrency (newCurrency) {
      this.$store.dispatch('unSubscribeChannelsStream', subscribeChannels.get(this.currentCurrency))
      this.currentCurrency = newCurrency
      this.$store.dispatch('setOHLC', { symbol: this.currentCurrency.symbol, newValue: {} })
        .then(() => {
          this.setDataToChart()
          this.$store.dispatch('subscribeChannelsStream', subscribeChannels.get(this.currentCurrency))
        })
    }
  },
  beforeDestroy () {
    this.$store.dispatch('unSubscribeChannelsStream', subscribeChannels.get(this.currentCurrency))
    this.$store.dispatch('unSubscribeMessagesStream', this.handleMessage)
  }
}
</script>

<style scoped>
  .dashboard {
    margin: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .chart {
    display: flex;
    justify-content: center;
  }
</style>
