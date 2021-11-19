<template>
  <div class="wallets">
    <b-table hover :fields="fields" :items="wallets">
      <template #cell(balancesymbol)="data">
        {{ `${data.item.balance} ${data.item.symbol}`}}
      </template>
    </b-table>
  </div>
</template>

<script>

const subscribeChannels = ['2~Coinbase~BTC~USD', '2~Coinbase~ETH~USD', '2~Coinbase~USDT~USD']

export default {
  name: 'Wallets',
  data () {
    return {
      fields: [
        {
          key: 'name',
          label: 'Wallet'
        },
        {
          key: 'balancesymbol',
          label: 'Balance'
        },
        {
          key: 'rate',
          label: 'Rate, $'
        }
      ],
      handleMessage: null
    }
  },
  mounted () {
    this.handleMessage = ({ data }) => {
      const message = JSON.parse(data)
      if (message.TYPE === '2' && Object.prototype.hasOwnProperty.call(message, 'PRICE')) {
        this.$store.dispatch('setWalletRate', { symbol: message.FROMSYMBOL, rate: message.PRICE })
      }
    }
    this.$store.dispatch('subscribeChannelsStream', subscribeChannels)
      .then(() => this.$store.dispatch('subscribeMessagesStream', this.handleMessage))
  },
  computed: {
    wallets () {
      return Object.values(this.$store.getters.wallets)
    }
  },
  beforeDestroy () {
    this.$store.dispatch('unSubscribeChannelsStream', subscribeChannels)
    this.$store.dispatch('unSubscribeMessagesStream', this.handleMessage)
  }
}
</script>
<style scoped>
  .wallets {
    margin: 20px;
  }
</style>
