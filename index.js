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

/** @typedef {import('./src/staking-protocol.js').StakeOptions} StakeOptions */
/** @typedef {import('./src/staking-protocol.js').StakeResult} StakeResult */
/** @typedef {import('./src/staking-protocol.js').WithdrawalRequestOptions} WithdrawalRequestOptions */
/** @typedef {import('./src/staking-protocol.js').WithdrawalRequestResult} WithdrawalRequestResult */
/** @typedef {import('./src/staking-protocol.js').WithdrawalRequest} WithdrawalRequest */
/** @typedef {import('./src/staking-protocol.js').WithdrawalRequestsView} WithdrawalRequestsView */
/** @typedef {import('./src/staking-protocol.js').ClaimWithdrawalsOptions} ClaimWithdrawalsOptions */
/** @typedef {import('./src/staking-protocol.js').ClaimWithdrawalsResult} ClaimWithdrawalsResult */
/** @typedef {import('./src/staking-protocol.js').StakedBalance} StakedBalance */

export { default as StakingProtocol, IStakingProtocol } from './src/staking-protocol.js'
export { default as TONSTAKERS_ADDRESS_MAP } from './src/tonstakers-address-map.js'
export {
  OP_STAKE, OP_UNSTAKE, STAKE_FEE_RESERVE, UNSTAKE_FEE_RESERVE, MIN_STAKE,
  buildStakeBody, buildUnstakeBody
} from './src/tonstakers-protocol-ton.js'

export { default } from './src/tonstakers-protocol-ton.js'
