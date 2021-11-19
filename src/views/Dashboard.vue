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
    this.candlestickSeries = this.chart.addCandlestickSeries()
    this.$store.dispatch('setOHLCGlobal', { symbol: this.currentCurrency.symbol, newValue: {} })
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
            this.$store.dispatch('setOHLC', { symbol: message.FROMSYMBOL, record })
              .then(() => {
                if (message.FROMSYMBOL === this.currentCurrency.symbol) {
                  this.candlestickSeries.update(record)
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
      this.candlestickSeries.setData(this.dataChart)
    },
    changeCurrentCurrency (newCurrency) {
      this.$store.dispatch('unSubscribeChannelsStream', subscribeChannels.get(this.currentCurrency))
      this.currentCurrency = newCurrency
      this.$store.dispatch('setOHLCGlobal', { symbol: this.currentCurrency.symbol, newValue: {} })
        .then(() => {
          this.setDataToChart()
          this.$store.dispatch('subscribeChannelsStream', subscribeChannels.get(this.currentCurrency))
        })
    }
  },
  computed: {
    dataChart () {
      const OHLCByCurrency = this.$store.getters.OHLC[this.currentCurrency.symbol]
      return Object.values(OHLCByCurrency).sort((a, b) => a - b)
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
