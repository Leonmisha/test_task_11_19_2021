export const startStream = (apiKey) => new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${apiKey}`)

export const subscribe = (streamer, subs) => {
  const subRequest = {
    action: 'SubAdd',
    subs
  }
  streamer.send(JSON.stringify(subRequest))
}

export const unSubscribe = (streamer, subs) => {
  const subRequest = {
    action: 'SubRemove',
    subs
  }
  streamer.send(JSON.stringify(subRequest))
}

// export const closeStream = (streamer) => streamer.close()
