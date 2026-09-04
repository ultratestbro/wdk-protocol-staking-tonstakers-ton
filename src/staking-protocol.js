// Copyright 2026 Tether Operations Limited
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
'use strict'

// PROPOSED PROTOCOL TYPE — @tetherto/wdk-wallet has no staking protocol yet
// (its six types are swap, bridge, lending, fiat, swidge and sda). This file
// is written so it can move to wdk-wallet/src/protocols/staking-protocol.js
// verbatim; until then the base class ships inside this module the way the
// first swidge modules carried their own scaffolding before the type landed.
//
// Why staking is not lending: a lending withdraw is synchronous (call it,
// receive the tokens), while unstaking from a liquid-staking protocol is a
// TWO-PHASE exchange — a request enters a queue, finalizes out of band
// (days later), and only then can be claimed for the native token. Modelling
// that as `withdraw()` would produce a method that returns with no money
// received; modelling borrow/repay as unsupported would stub out half the
// lending surface. The honest interface names the queue.

import { NotImplementedError } from '@tetherto/wdk-wallet/protocols'

/** @typedef {import('@tetherto/wdk-wallet').IWalletAccount} IWalletAccount */
/** @typedef {import('@tetherto/wdk-wallet').IWalletAccountReadOnly} IWalletAccountReadOnly */

/**
 * @typedef {Object} StakeOptions
 * @property {number | bigint} amount - The amount of native tokens to stake (in base unit).
 */

/**
 * @typedef {Object} StakeResult
 * @property {string} hash - The hash of the stake transaction.
 * @property {bigint} fee - The gas cost.
 */

/**
 * @typedef {Object} WithdrawalRequestOptions
 * @property {number | bigint} amount - The amount of staked tokens to queue for withdrawal (in base unit).
 * @property {string} [token] - Which staked-token form to withdraw (protocol specific, e.g. "stETH" or "wstETH"). Defaults to the protocol's primary staked token.
 */

/**
 * @typedef {Object} WithdrawalRequestResult
 * @property {string} hash - The hash of the withdrawal-request transaction.
 * @property {bigint} fee - The total gas cost (including a prior approval transaction, if one was needed).
 * @property {string | null} approveHash - The hash of the approval transaction if the two-transaction fallback ran, otherwise null.
 */

/**
 * @typedef {Object} WithdrawalRequest
 * @property {bigint} id - The queue's identifier for this request.
 * @property {bigint} amount - The amount of staked tokens locked in this request (in base unit).
 * @property {number} timestamp - Unix seconds at which the request was created.
 * @property {boolean} claimable - Whether the request has finalized and can be claimed.
 */

/**
 * @typedef {Object} WithdrawalRequestsView
 * @property {WithdrawalRequest[]} requests - Open (unclaimed) requests, newest first.
 * @property {bigint} pendingAmount - Staked tokens still waiting for finalization (in base unit).
 * @property {bigint} claimableAmount - Native tokens ready to claim right now (in base unit).
 * @property {bigint[]} claimableIds - Ids of the finalized requests, in the ascending order the claim call expects.
 */

/**
 * @typedef {Object} ClaimWithdrawalsOptions
 * @property {bigint[]} [ids] - The request ids to claim. Defaults to every claimable request.
 */

/**
 * @typedef {Object} ClaimWithdrawalsResult
 * @property {string} hash - The hash of the claim transaction.
 * @property {bigint} fee - The gas cost.
 */

/**
 * @typedef {Object} StakedBalance
 * @property {bigint} balance - The primary staked token balance (in base unit).
 * @property {bigint} wrappedBalance - The non-rebasing wrapped form's balance, 0n if the protocol has none.
 * @property {bigint} rate - Primary staked tokens per wrapped token, 1e18 fixed point (0n if no wrapped form).
 * @property {bigint} total - The whole position expressed in primary staked tokens (balance + unwrapped wrappedBalance).
 */

/** @interface */
export class IStakingProtocol {
  /**
   * Stakes native tokens into the protocol; staked tokens land on the account.
   *
   * @param {StakeOptions} options - The stake's options.
   * @returns {Promise<StakeResult>} The stake's result.
   */
  async stake (options) {
    throw new NotImplementedError('stake(options)')
  }

  /**
   * Quotes the costs of a stake operation.
   *
   * @param {StakeOptions} options - The stake's options.
   * @returns {Promise<Omit<StakeResult, 'hash'>>} The stake's costs.
   */
  async quoteStake (options) {
    throw new NotImplementedError('quoteStake(options)')
  }

  /**
   * Queues staked tokens for withdrawal. The request finalizes out of band;
   * once {@link IStakingProtocol#getWithdrawalRequests} reports it claimable,
   * {@link IStakingProtocol#claimWithdrawals} exchanges it for native tokens.
   *
   * @param {WithdrawalRequestOptions} options - The request's options.
   * @returns {Promise<WithdrawalRequestResult>} The request's result.
   */
  async requestWithdrawal (options) {
    throw new NotImplementedError('requestWithdrawal(options)')
  }

  /**
   * Quotes the costs of a withdrawal request.
   *
   * @param {WithdrawalRequestOptions} options - The request's options.
   * @returns {Promise<Omit<WithdrawalRequestResult, 'hash' | 'approveHash'>>} The request's costs.
   */
  async quoteRequestWithdrawal (options) {
    throw new NotImplementedError('quoteRequestWithdrawal(options)')
  }

  /**
   * Returns the account's live withdrawal queue: open requests, what is still
   * pending and what is ready to claim.
   *
   * @returns {Promise<WithdrawalRequestsView>} The queue view.
   */
  async getWithdrawalRequests () {
    throw new NotImplementedError('getWithdrawalRequests()')
  }

  /**
   * Claims finalized withdrawal requests — native tokens land on the account.
   *
   * @param {ClaimWithdrawalsOptions} [options] - The claim's options.
   * @returns {Promise<ClaimWithdrawalsResult>} The claim's result.
   */
  async claimWithdrawals (options) {
    throw new NotImplementedError('claimWithdrawals(options)')
  }

  /**
   * Quotes the costs of a claim operation.
   *
   * @param {ClaimWithdrawalsOptions} [options] - The claim's options.
   * @returns {Promise<Omit<ClaimWithdrawalsResult, 'hash'>>} The claim's costs.
   */
  async quoteClaimWithdrawals (options) {
    throw new NotImplementedError('quoteClaimWithdrawals(options)')
  }

  /**
   * Returns the account's staked position.
   *
   * @returns {Promise<StakedBalance>} The staked balances.
   */
  async getStakedBalance () {
    throw new NotImplementedError('getStakedBalance()')
  }

  /**
   * Returns the protocol's current staking APR, in percent.
   *
   * @returns {Promise<number>} The APR (e.g. 2.7 for 2.7%).
   */
  async getApr () {
    throw new NotImplementedError('getApr()')
  }
}

export default class StakingProtocol {
  /**
   * Creates a new read-only staking protocol.
   *
   * @overload
   * @param {IWalletAccountReadOnly} account - The wallet account to use to interact with the protocol.
   */

  /**
   * Creates a new staking protocol.
   *
   * @overload
   * @param {IWalletAccount} account - The wallet account to use to interact with the protocol.
   */
  constructor (account) {
    /**
     * The wallet account to use to interact with the protocol.
     *
     * @protected
     * @type {IWalletAccountReadOnly | IWalletAccount}
     */
    this._account = account
  }

  /** @abstract @param {StakeOptions} options @returns {Promise<StakeResult>} */
  async stake (options) {
    throw new NotImplementedError('stake(options)')
  }

  /** @abstract @param {StakeOptions} options @returns {Promise<Omit<StakeResult, 'hash'>>} */
  async quoteStake (options) {
    throw new NotImplementedError('quoteStake(options)')
  }

  /** @abstract @param {WithdrawalRequestOptions} options @returns {Promise<WithdrawalRequestResult>} */
  async requestWithdrawal (options) {
    throw new NotImplementedError('requestWithdrawal(options)')
  }

  /** @abstract @param {WithdrawalRequestOptions} options @returns {Promise<Omit<WithdrawalRequestResult, 'hash' | 'approveHash'>>} */
  async quoteRequestWithdrawal (options) {
    throw new NotImplementedError('quoteRequestWithdrawal(options)')
  }

  /** @abstract @returns {Promise<WithdrawalRequestsView>} */
  async getWithdrawalRequests () {
    throw new NotImplementedError('getWithdrawalRequests()')
  }

  /** @abstract @param {ClaimWithdrawalsOptions} [options] @returns {Promise<ClaimWithdrawalsResult>} */
  async claimWithdrawals (options) {
    throw new NotImplementedError('claimWithdrawals(options)')
  }

  /** @abstract @param {ClaimWithdrawalsOptions} [options] @returns {Promise<Omit<ClaimWithdrawalsResult, 'hash'>>} */
  async quoteClaimWithdrawals (options) {
    throw new NotImplementedError('quoteClaimWithdrawals(options)')
  }

  /** @abstract @returns {Promise<StakedBalance>} */
  async getStakedBalance () {
    throw new NotImplementedError('getStakedBalance()')
  }

  /** @abstract @returns {Promise<number>} */
  async getApr () {
    throw new NotImplementedError('getApr()')
  }
}
