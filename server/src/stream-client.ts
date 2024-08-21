import { StreamClient } from "@stream-io/node-sdk";

const apiKey = '75wmnau69aht'
const apiSecret = 'vc98hpk945afmjzrczmcsrybey6wt3bj8gjra2vbpg33zs8sdm4jkur9erq5ajw9'

export const client = new StreamClient(apiKey, apiSecret);