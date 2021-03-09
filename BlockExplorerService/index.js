import { blockExplorerServiceAxios } from '@/axios';

export class BlockExplorerService {
  constructor() {
    this.axios = blockExplorerServiceAxios;
  }
  
  /** Blocks endpoints */
  
  /**
   * Returns list of blocks.
   * @param params - query parameters
     * @property {string} search - string to search in list of entity types
     * @property {string} parentHash - provides support to filter data by parentHash
     * @property {string} nonce - provides support to filter data by nonce
     * @property {string} miner - provides support to filter data by miner
     * @property {string} number - provides support to filter data by number
     * @property {string} timestamp - provides support to filter data by timestamp
   */
  async getBlocks(params) {
    return this.axios.get('/blocks', {
      params
    });
  }
  
  async getBlock(hash) {
    return this.axios.get(`/blocks/${hash}`);
  }
  
  /** Transactions endpoints */
  
  /**
   * Returns list of transactions.
   * @param params - query parameters
     * @property {string} search - string to search in list of entity types
     * @property {string} blockHash - provides support to filter data by blockHash
     * @property {string} blockNumber - provides support to filter data by blockNumber
     * @property {string} transactionIndex - provides support to filter data by transactionIndex
     * @property {string} confirmations - provides support to filter data by confirmations
     * @property {string} from - provides support to filter data by from
     * @property {string} to - provides support to filter data by to
     * @property {string} value - provides support to filter data by value
     * @property {string} nonce - provides support to filter data by nonce
     * @property {string} r - provides support to filter data by r
     * @property {string} s - provides support to filter data by s
     * @property {string} v - provides support to filter data by f
     * @property {string} creates - provides support to filter data by creates
     * @property {string} chainId - provides support to filter data by chainId
   */
  async getTransactions(params) {
    return this.axios.get('/transactions', {
      params
    });
  }
  
  async getTransaction(hash) {
    return this.axios.get(`/transactions/${hash}`);
  }
  
  async getBlocksOverview() {
    return this.axios.get('/analytics/block/overview');
  }
  
  async getBlocksDaily() {
    return this.axios.get('/analytics/block/daily');
  }
  
  async getTransactionsOverview() {
    return this.axios.get('/analytics/transaction/overview');
  }
  
  async getTransactionsDaily() {
    return this.axios.get('/analytics/transaction/daily');
  }
  
  async getTransactionsHourly() {
    return this.axios.get('/analytics/transaction/hourly');
  }
}
