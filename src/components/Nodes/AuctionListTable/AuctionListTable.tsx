import { useState } from 'react';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { PageState, FormatNumber } from 'components';
import { getStringPlural } from 'helpers';
import { useGetSort } from 'hooks';
import { faCogs } from 'icons/regular';
import { stakeSelector } from 'redux/selectors';
import { AuctionValidatorType, SortOrderEnum, WithClassnameType } from 'types';

import { AuctionListRow } from './AuctionListRow';
import { getExpandRowDetails, hasThresholdRow } from './helpers';
import { ExpandRowConfigType } from './types';

export interface AuctionListTableUIType extends WithClassnameType {
  auctionListValidators?: AuctionValidatorType[];
  showPosition?: boolean;
}

const auctionListValidators: AuctionValidatorType[] = [
  {
    identity: 'multiversx',
    locked: '3034999999999999983222335',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/multiversx/logo.png',
    name: 'MultiversX Community Delegation 🎖',
    auctionValidators: 505,
    qualifiedAuctionValidators: 505,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '1262500000000000000000000',
    qualifiedStake: '1262500000000000000000000',
    auctionTopUp: '1772499999999999983222335',
    auctionPosition: 1
  },
  {
    identity: 'binance_staking',
    locked: '950224742204515718233590',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqc0llllsayxegu: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/binance_staking/logo.png',
    name: 'Binance Staking',
    auctionValidators: 30,
    qualifiedAuctionValidators: 30,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '75000000000000000000000',
    qualifiedStake: '75000000000000000000000',
    auctionTopUp: '875224742204515718233590',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqc0llllsayxegu',
    auctionPosition: 2
  },
  {
    identity: 'meria',
    locked: '769729737994234247687296',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq8hlllls7a6h85: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/meria/logo.png',
    description: 'French Crypto Investment Provider\nwww.meria.com',
    name: 'Meria',
    auctionValidators: 224,
    qualifiedAuctionValidators: 224,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '560000000000000000000000',
    qualifiedStake: '560000000000000000000000',
    auctionTopUp: '209729737994234247687296',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq8hlllls7a6h85',
    auctionPosition: 3
  },
  {
    identity: 'istariv',
    locked: '708724736240807819990254',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqrhlllls062tu4: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/istariv/logo.png',
    description:
      'Next generation Blockchain projects https://t.me/iVerse_Vision_Official',
    name: 'iVerse Vision',
    auctionValidators: 137,
    qualifiedAuctionValidators: 137,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '342500000000000000000000',
    qualifiedStake: '342500000000000000000000',
    auctionTopUp: '366224736240807819990254',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqrhlllls062tu4',
    auctionPosition: 4
  },
  {
    identity: 'stakingagency',
    locked: '653501453318132589918783',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhllllsajxzat: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/stakingagency/logo.png',
    description: 'The smart way to manage your stakes',
    name: 'Staking Agency',
    auctionValidators: 183,
    qualifiedAuctionValidators: 183,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '457500000000000000000000',
    qualifiedStake: '457500000000000000000000',
    auctionTopUp: '196001453318132589918783',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhllllsajxzat',
    auctionPosition: 5
  },
  {
    identity: 'truststaking',
    locked: '500303975886413889652000',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzhllllsp9wvyl: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/truststaking/logo.png',
    description: 'We are running nodes for PoS on @multiversx ',
    name: 'Trust Staking',
    auctionValidators: 97,
    qualifiedAuctionValidators: 97,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '242500000000000000000000',
    qualifiedStake: '242500000000000000000000',
    auctionTopUp: '257803975886413889652000',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzhllllsp9wvyl',
    auctionPosition: 6
  },
  {
    identity: 'thepalmtreenw',
    locked: '395985378514655037283484',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy8lllls62y8s5: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/thepalmtreenw/logo.png',
    description:
      'MultiversX Stake Operator, we work with the more secure datacenters to help you get always the max. rewards of your eGLD staked.',
    name: 'The Palm Tree Network',
    auctionValidators: 76,
    qualifiedAuctionValidators: 76,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '190000000000000000000000',
    qualifiedStake: '190000000000000000000000',
    auctionTopUp: '205985378514655037283484',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy8lllls62y8s5',
    auctionPosition: 7
  },
  {
    identity: 'partnerstaking',
    locked: '354302019636423834938312',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9hllllsz2je7q: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/partnerstaking/logo.png',
    description:
      'Easiest way to manage your stake using the Partner Staking mobile app: https://partnerstaking.com/mobile',
    name: 'PartnerStaking',
    auctionValidators: 106,
    qualifiedAuctionValidators: 106,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '265000000000000000000000',
    qualifiedStake: '265000000000000000000000',
    auctionTopUp: '89302019636423834938312',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9hllllsz2je7q',
    auctionPosition: 8
  },
  {
    identity: 'validblocks',
    locked: '285314989351624953560200',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq90llllslwfcr3: 0.95,
      direct: 0.05
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/validblocks/logo.png',
    description:
      'Valid Blocks helps you increase your cryptocurrency assets by participating in staking. "Non-Custodial" means you are always in control of your funds!',
    name: 'Valid Blocks',
    auctionValidators: 46,
    qualifiedAuctionValidators: 46,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '115000000000000000000000',
    qualifiedStake: '115000000000000000000000',
    auctionTopUp: '170314989351624953560200',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq90llllslwfcr3',
    auctionPosition: 9
  },
  {
    identity: 'arcstake',
    locked: '276634708271847373855050',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz8llllsh6u4jp: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/arcstake/logo.png',
    description:
      'ARC Stake provides staking services for the most advanced blockchain in the world: MultiversX',
    name: 'ARC Stake',
    auctionValidators: 50,
    qualifiedAuctionValidators: 50,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '125000000000000000000000',
    qualifiedStake: '125000000000000000000000',
    auctionTopUp: '151634708271847373855050',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz8llllsh6u4jp',
    auctionPosition: 10
  },
  {
    identity: 'figment-networks',
    locked: '276267668564313347564874',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlhllllsr0pd0j: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/figment-networks/logo.png',
    description:
      'Figment is the worlds leading provider of blockchain infrastructure.',
    name: 'Figment',
    auctionValidators: 22,
    qualifiedAuctionValidators: 22,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '55000000000000000000000',
    qualifiedStake: '55000000000000000000000',
    auctionTopUp: '221267668564313347564874',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlhllllsr0pd0j',
    auctionPosition: 11
  },
  {
    identity: 'cslabsio',
    locked: '254438874317033687260600',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqphllllsndz99p: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/cslabsio/logo.png',
    description: 'Secure staking, simplified.\nFor everyone.',
    name: 'Chain State Labs',
    auctionValidators: 50,
    qualifiedAuctionValidators: 50,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '125000000000000000000000',
    qualifiedStake: '125000000000000000000000',
    auctionTopUp: '129438874317033687260600',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqphllllsndz99p',
    auctionPosition: 12
  },
  {
    identity: 'mgstaking',
    locked: '238063944359111427667434',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9lllllsf3mp40: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/mgstaking/logo.png',
    description: 'Secure staking for a blockchain world!',
    name: 'MGStaking',
    auctionValidators: 46,
    qualifiedAuctionValidators: 46,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '115000000000000000000000',
    qualifiedStake: '115000000000000000000000',
    auctionTopUp: '123063944359111427667434',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9lllllsf3mp40',
    auctionPosition: 13
  },
  {
    identity: 'primal-block-one',
    locked: '234998946434387964953536',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqx8llllsxavffq: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/primal-block-one/logo.png',
    description:
      'We focus on technology-induced black swans and investing in and supporting the companies and founders that are creating them.\r\nMatrix',
    name: 'Primal Block One',
    auctionValidators: 67,
    qualifiedAuctionValidators: 67,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '167500000000000000000000',
    qualifiedStake: '167500000000000000000000',
    auctionTopUp: '67498946434387964953536',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqx8llllsxavffq',
    auctionPosition: 14
  },
  {
    identity: 'procryptostaking',
    locked: '232230079209836920129700',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqxlllllsmehg53: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/procryptostaking/logo.png',
    description:
      '🌍 Global distributed infrastructure 💨 High automatization & availability 📈 Redelegation activated 🔐 Sophisticated security concept 🤑 Nice APR 🇺🇸🇩🇪🇷🇴 ',
    name: 'ProCrypto Distributed Staking',
    auctionValidators: 50,
    qualifiedAuctionValidators: 50,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '125000000000000000000000',
    qualifiedStake: '125000000000000000000000',
    auctionTopUp: '107230079209836920129700',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqxlllllsmehg53',
    auctionPosition: 15
  },
  {
    identity: 'everstake',
    locked: '219457657919864359711782',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq28llllsu54ydr: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/everstake/logo.png',
    description:
      'Everstake is a responsible validator trusted by 625k+ users across 70+ blockchain networks.',
    name: 'Everstake',
    auctionValidators: 66,
    qualifiedAuctionValidators: 66,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '165000000000000000000000',
    qualifiedStake: '165000000000000000000000',
    auctionTopUp: '54457657919864359711782',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq28llllsu54ydr',
    auctionPosition: 16
  },
  {
    identity: 'heliosstaking',
    locked: '209012760263858403304880',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqx0llllsdx93z0: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/heliosstaking/logo.png',
    description: 'Professional Staking as a Service Provider',
    name: 'Helios Staking ⚡ ',
    auctionValidators: 38,
    qualifiedAuctionValidators: 38,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '95000000000000000000000',
    qualifiedStake: '95000000000000000000000',
    auctionTopUp: '114012760263858403304880',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqx0llllsdx93z0',
    auctionPosition: 17
  },
  {
    identity: 'xoxno',
    locked: '203004518427160502236344',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg8llllsqra25h: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/xoxno/logo.png',
    description: 'The largest NFT Marketplace Aggregator on @multiversx',
    name: 'XOXNO',
    auctionValidators: 36,
    qualifiedAuctionValidators: 36,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '90000000000000000000000',
    qualifiedStake: '90000000000000000000000',
    auctionTopUp: '113004518427160502236344',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg8llllsqra25h',
    auctionPosition: 18
  },
  {
    identity: 'unitedgroupcapital',
    locked: '198522197746215962684060',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllllls27850s: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/unitedgroupcapital/logo.png',
    description:
      'UnitedGroupCapital provides Staking Services, Secured Network and the smart way to invest your EGLD !',
    name: 'UnitedGroupCapital',
    auctionValidators: 53,
    qualifiedAuctionValidators: 53,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '132500000000000000000000',
    qualifiedStake: '132500000000000000000000',
    auctionTopUp: '66022197746215962684060',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqzllllls27850s',
    auctionPosition: 19
  },
  {
    identity: 'alchemiststakexyz',
    locked: '175714913287052925088216',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqfhllllscrt56r: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/alchemiststakexyz/logo.png',
    description:
      'Alchemist Stake provides an enterprise-level PoS infrastructure that that aims to create a bridge between investors and the best blockchain-based projects.',
    name: 'Alchemist Stake',
    auctionValidators: 38,
    qualifiedAuctionValidators: 38,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '95000000000000000000000',
    qualifiedStake: '95000000000000000000000',
    auctionTopUp: '80714913287052925088216',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqfhllllscrt56r',
    auctionPosition: 20
  },
  {
    identity: 'luganodes',
    locked: '172480731615874495450020',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqp9llllls5wmsa9: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/luganodes/logo.png',
    description: 'Hassle-free secure staking',
    name: 'Luganodes',
    auctionValidators: 4,
    qualifiedAuctionValidators: 4,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '10000000000000000000000',
    qualifiedStake: '10000000000000000000000',
    auctionTopUp: '162480731615874495450020',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqp9llllls5wmsa9',
    auctionPosition: 21
  },
  {
    identity: 'ledgerbyfigment',
    locked: '157263537104359249670596',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqppllllls9ftvxy: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/ledgerbyfigment/logo.png',
    description:
      'Figment is the worlds leading provider of blockchain infrastructure.',
    name: 'Ledger by Figment',
    auctionValidators: 7,
    qualifiedAuctionValidators: 7,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '17500000000000000000000',
    qualifiedStake: '17500000000000000000000',
    auctionTopUp: '139763537104359249670596',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqppllllls9ftvxy',
    auctionPosition: 22
  },
  {
    identity: 'equinoxecapital',
    locked: '155558373126216385707025',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqh0lllls49nadp: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/equinoxecapital/logo.png',
    description:
      'Staking company situated in Romania operating on MultiversX blockchain with premium hardware and know-how.',
    name: 'Equinoxe Capital',
    auctionValidators: 25,
    qualifiedAuctionValidators: 25,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '62500000000000000000000',
    qualifiedStake: '62500000000000000000000',
    auctionTopUp: '93058373126216385707025',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqh0lllls49nadp',
    auctionPosition: 23
  },
  {
    identity: 'oxsyai',
    locked: '141292982365504572300520',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqp8lllls9jsunl: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/oxsyai/logo.png',
    description:
      '🦊 🦿 ⚽️ 🥅 🌎 🏆 Basically a dog wif brainz & 𝕏 appeal. Also AI, robotics & web3.',
    name: 'Foxsy AI (+4% APR 🦊 bonus)',
    auctionValidators: 20,
    qualifiedAuctionValidators: 20,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '50000000000000000000000',
    qualifiedStake: '50000000000000000000000',
    auctionTopUp: '91292982365504572300520',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqp8lllls9jsunl',
    auctionPosition: 24
  },
  {
    identity: 'star_staking',
    locked: '132329230023518974416348',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqprhllllsj9265l: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/star_staking/logo.png',
    name: 'Star Staking',
    auctionValidators: 27,
    qualifiedAuctionValidators: 27,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '67500000000000000000000',
    qualifiedStake: '67500000000000000000000',
    auctionTopUp: '64829230023518974416348',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqprhllllsj9265l',
    auctionPosition: 25
  },
  {
    identity: 'web3water',
    locked: '127671120393779611294030',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqql8lllls4sn5ev: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/web3water/logo.png',
    description: 'Liquidity for web3',
    name: '$WATER Works',
    auctionValidators: 22,
    qualifiedAuctionValidators: 22,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '55000000000000000000000',
    qualifiedStake: '55000000000000000000000',
    auctionTopUp: '72671120393779611294030',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqql8lllls4sn5ev',
    auctionPosition: 26
  },
  {
    identity: 'titanstake',
    locked: '126927447364469181148900',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr8llllse9cj2t: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/titanstake/logo.png',
    description:
      'Stake, support and join the titans on a revolutionary journey enabling MultiversX, the network of tomorrow.',
    name: 'TitanStake',
    auctionValidators: 20,
    qualifiedAuctionValidators: 20,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '50000000000000000000000',
    qualifiedStake: '50000000000000000000000',
    auctionTopUp: '76927447364469181148900',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr8llllse9cj2t',
    auctionPosition: 27
  },
  {
    identity: 'middlestaking',
    locked: '115427292685330258676749',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqyhllllsv4k7x2: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/middlestaking/logo.png',
    description: 'Middle Staking',
    name: 'Middle Staking',
    auctionValidators: 31,
    qualifiedAuctionValidators: 31,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '77500000000000000000000',
    qualifiedStake: '77500000000000000000000',
    auctionTopUp: '37927292685330258676749',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqyhllllsv4k7x2',
    auctionPosition: 28
  },
  {
    identity: 'staking-vaas',
    locked: '108852049181934801901417',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqu8lllls8clacj: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/staking-vaas/logo.png',
    description: 'Deutsche Telekom Staking',
    name: 'Deutsche Telekom Staking',
    auctionValidators: 7,
    qualifiedAuctionValidators: 7,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '17500000000000000000000',
    qualifiedStake: '17500000000000000000000',
    auctionTopUp: '91352049181934801901417',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqu8lllls8clacj',
    auctionPosition: 29
  },
  {
    identity: 'cyberpunkstake',
    locked: '108185709276963326308986',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpzlllllshp8986: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/cyberpunkstake/logo.png',
    description: 'Visionary staking provider on #MultiversX ⚡️',
    name: 'Cyberpunk Stake',
    auctionValidators: 14,
    qualifiedAuctionValidators: 14,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '35000000000000000000000',
    qualifiedStake: '35000000000000000000000',
    auctionTopUp: '73185709276963326308986',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpzlllllshp8986',
    auctionPosition: 30
  },
  {
    identity: 'carpathianstake',
    locked: '103626649447199857461573',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy0lllls33dlmm: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/carpathianstake/logo.png',
    name: 'Carpathian Stake',
    auctionValidators: 29,
    qualifiedAuctionValidators: 29,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '72500000000000000000000',
    qualifiedStake: '72500000000000000000000',
    auctionTopUp: '31126649447199857461573',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqy0lllls33dlmm',
    auctionPosition: 31
  },
  {
    identity: 'aurentum',
    locked: '99178504041354009169144',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqmhllllsjg335n: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/aurentum/logo.png',
    description: 'Staking made in Germany! https://t.me/aurentum_de',
    name: 'Aurentum GmbH',
    auctionValidators: 26,
    qualifiedAuctionValidators: 26,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '65000000000000000000000',
    qualifiedStake: '65000000000000000000000',
    auctionTopUp: '34178504041354009169144',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqmhllllsjg335n',
    auctionPosition: 32
  },
  {
    identity: 'incalng',
    locked: '99161058697351872569320',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqd8llllslmf3hu: 0.66,
      direct: 0.34
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/incalng/logo.png',
    description: 'Incal',
    name: 'Incal (phase-4 ready ☑️)',
    auctionValidators: 24,
    qualifiedAuctionValidators: 24,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '60000000000000000000000',
    qualifiedStake: '60000000000000000000000',
    auctionTopUp: '39161058697351872569320',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqd8llllslmf3hu',
    auctionPosition: 33
  },
  {
    identity: 'sikka_tech',
    locked: '97355987094370162811640',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqf8llllswuedva: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/sikka_tech/logo.png',
    description: 'Infrastructure for the Decentralized Future',
    name: 'Sikka',
    auctionValidators: 20,
    qualifiedAuctionValidators: 20,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '50000000000000000000000',
    qualifiedStake: '50000000000000000000000',
    auctionTopUp: '47355987094370162811640',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqf8llllswuedva',
    auctionPosition: 34
  },
  {
    identity: 'vaporrepublic',
    locked: '94385740191687205453429',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqehllllswleld8: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/vaporrepublic/logo.png',
    description:
      'Premium staking provider built for the community by the community.',
    name: 'Vapor Republic ',
    auctionValidators: 17,
    qualifiedAuctionValidators: 17,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '42500000000000000000000',
    qualifiedStake: '42500000000000000000000',
    auctionTopUp: '51885740191687205453429',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqehllllswleld8',
    auctionPosition: 35
  },
  {
    identity: 'p2p_org_',
    locked: '92516198475797166050910',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqm8llllsyhrgzd: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/p2p_org_/logo.png',
    description:
      'P2P Validator is a world-leading non-custodial staking provider securing $5+ billion in staked assets by 24,000+ delegators across 20+ top-notch networks. P2P has been participating in Cosmos, Solana, Polkadot and other novel blockchains from day one.',
    name: 'P2P Validator',
    auctionValidators: 18,
    qualifiedAuctionValidators: 18,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '45000000000000000000000',
    qualifiedStake: '45000000000000000000000',
    auctionTopUp: '47516198475797166050910',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqm8llllsyhrgzd',
    auctionPosition: 36
  },
  {
    identity: 'alchemycapital',
    locked: '91381374538643924153190',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlllllskf06ky: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/alchemycapital/logo.png',
    description: '🤩 Visit our website to get to know us!',
    name: 'Alchemy Capital',
    auctionValidators: 18,
    qualifiedAuctionValidators: 18,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '45000000000000000000000',
    qualifiedStake: '45000000000000000000000',
    auctionTopUp: '46381374538643924153190',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlllllskf06ky',
    auctionPosition: 37
  },
  {
    identity: 'rvstaking',
    locked: '89318596565860163481476',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqhllllsqdxn4p: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/rvstaking/logo.png',
    description: 'Formal Verification for Blockchain',
    name: 'Runtime Verification',
    auctionValidators: 14,
    qualifiedAuctionValidators: 14,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '35000000000000000000000',
    qualifiedStake: '35000000000000000000000',
    auctionTopUp: '54318596565860163481476',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqhllllsqdxn4p',
    auctionPosition: 38
  },
  {
    identity: 'christstake',
    locked: '86508314419031507982912',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq98lllls54qqg7: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/christstake/logo.png',
    description:
      'Jesus Christ is Lord and Savior for all Eternity. "...whoever believes in Him shall not perish but have everlasting life"',
    name: 'Christstake',
    auctionValidators: 24,
    qualifiedAuctionValidators: 24,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '60000000000000000000000',
    qualifiedStake: '60000000000000000000000',
    auctionTopUp: '26508314419031507982912',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq98lllls54qqg7',
    auctionPosition: 39
  },
  {
    identity: 'foundation-nodes',
    locked: '84467907261764398199620',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/foundation-nodes/logo.png',
    name: '059b622339337db7172e99e9e26dc241dbc46c32242da147bfce3e074b2969cabf3fb72f3dece0eb45d58a2efbbdc00ec43ea66a53d1c88defd4b1953dc73da6bd7f71bcdf7f1a91b18ac31c30a89fe8080747cce3e98d7f3a21cd2e8e831983',
    auctionValidators: 20,
    qualifiedAuctionValidators: 20,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '50000000000000000000000',
    qualifiedStake: '50000000000000000000000',
    auctionTopUp: '34467907261764398199620',
    auctionPosition: 40
  },
  {
    identity: 'atreides-capital',
    locked: '83972043860489712025840',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/atreides-capital/logo.png',
    name: '1baed8e295ef0ddb519db506239b40aa653caa390d874717b60ee3a686e814d56b39dd5df7649337d137bf83ce6fb316e751bde80b772cce14c868b8ef8f20bf2fa4c1c94693491ee23fe49a7115bbd5040da1c518c960cdf3875c2c5eb21c09',
    auctionValidators: 20,
    qualifiedAuctionValidators: 20,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '50000000000000000000000',
    qualifiedStake: '50000000000000000000000',
    auctionTopUp: '33972043860489712025840',
    auctionPosition: 41
  },
  {
    identity: 'owlhero',
    locked: '82712498601494457698544',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpr0lllls0p3mfw: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/owlhero/logo.png',
    name: 'OwlHero',
    auctionValidators: 16,
    qualifiedAuctionValidators: 16,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '40000000000000000000000',
    qualifiedStake: '40000000000000000000000',
    auctionTopUp: '42712498601494457698544',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpr0lllls0p3mfw',
    auctionPosition: 42
  },
  {
    identity: 'primal-block-two',
    locked: '82499999999999999999998',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/primal-block-two/logo.png',
    description:
      'We focus on technology-induced black swans and investing in and supporting the companies and founders that are creating them.\r\nMatrix',
    name: 'Primal Block Two',
    auctionValidators: 25,
    qualifiedAuctionValidators: 25,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '62500000000000000000000',
    qualifiedStake: '62500000000000000000000',
    auctionTopUp: '19999999999999999999998',
    auctionPosition: 43
  },
  {
    identity: 'truststakingus',
    locked: '82371308051301692358480',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq08llllsrvplwg: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/truststakingus/logo.png',
    description: 'Member of the parent company Trust Staking S.R.L',
    name: 'Trust Staking US',
    auctionValidators: 15,
    qualifiedAuctionValidators: 15,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '37500000000000000000000',
    qualifiedStake: '37500000000000000000000',
    auctionTopUp: '44871308051301692358480',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq08llllsrvplwg',
    auctionPosition: 44
  },
  {
    identity: 'forbole',
    locked: '77230098890674321453725',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq40llllsfjmn54: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/forbole/logo.png',
    description: 'Empower Web3 Future with Reliable Infrastructure',
    name: 'Forbole',
    auctionValidators: 15,
    qualifiedAuctionValidators: 15,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '37500000000000000000000',
    qualifiedStake: '37500000000000000000000',
    auctionTopUp: '39730098890674321453725',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq40llllsfjmn54',
    auctionPosition: 45
  },
  {
    identity: 'stakedao-devops',
    locked: '70687006618447275002250',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq20llllsh0uuxv: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/stakedao-devops/logo.png',
    description:
      'Stake Capital is a group run by Blockchain and DeFi pioneers standing at the intersection of traditional industries and blockchain technology.',
    name: 'Stake Capital Group (validators)',
    auctionValidators: 15,
    qualifiedAuctionValidators: 15,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '37500000000000000000000',
    qualifiedStake: '37500000000000000000000',
    auctionTopUp: '33187006618447275002250',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq20llllsh0uuxv',
    auctionPosition: 46
  },
  {
    identity: 'rosettastake',
    locked: '70378649747285913543348',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqrlllllsyprnh6: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/rosettastake/logo.png',
    description: 'The Unknown Journey is ongoing',
    name: 'RosettaStake',
    auctionValidators: 18,
    qualifiedAuctionValidators: 18,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '45000000000000000000000',
    qualifiedStake: '45000000000000000000000',
    auctionTopUp: '25378649747285913543348',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqrlllllsyprnh6',
    auctionPosition: 47
  },
  {
    identity: 'skysoft',
    locked: '66005544242313301062791',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/skysoft/logo.png',
    name: 'Sky Soft Staking',
    auctionValidators: 17,
    qualifiedAuctionValidators: 17,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '42500000000000000000000',
    qualifiedStake: '42500000000000000000000',
    auctionTopUp: '23505544242313301062791',
    auctionPosition: 48
  },
  {
    identity: 'exceptionlabs',
    locked: '65127648327166382224512',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpphllllswjz5dt: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/exceptionlabs/logo.png',
    name: 'ExceptionLabs',
    auctionValidators: 14,
    qualifiedAuctionValidators: 14,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '35000000000000000000000',
    qualifiedStake: '35000000000000000000000',
    auctionTopUp: '30127648327166382224512',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpphllllswjz5dt',
    auctionPosition: 49
  },
  {
    identity: 'moonlorianstake',
    locked: '64879917399543602867658',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqj0lllls2a8xw2: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/moonlorianstake/logo.png',
    description:
      'MultiversX partner: 360º Full project lifecycle + Staking Pool',
    name: 'Moonlorian Stake',
    auctionValidators: 14,
    qualifiedAuctionValidators: 14,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '35000000000000000000000',
    qualifiedStake: '35000000000000000000000',
    auctionTopUp: '29879917399543602867658',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqj0lllls2a8xw2',
    auctionPosition: 50
  },
  {
    identity: 'stakedinc',
    locked: '63213482416478454847090',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkhllllsx7vmg6: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/stakedinc/logo.png',
    description:
      'Staked operates highly available and highly secure, institutional grade staking infrastructure for leading proof-of-stake (PoS) protocols.',
    name: 'Staked',
    auctionValidators: 10,
    qualifiedAuctionValidators: 10,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '25000000000000000000000',
    qualifiedStake: '25000000000000000000000',
    auctionTopUp: '38213482416478454847090',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkhllllsx7vmg6',
    auctionPosition: 51
  },
  {
    identity: 'amor-perfecto',
    locked: '62308580236833259330872',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq2lllllspsw9sj: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/amor-perfecto/logo.png',
    description:
      'The staking provider on MultiversX network handled by Amor Perfecto Romania',
    name: 'Amor Perfecto Romania',
    auctionValidators: 6,
    qualifiedAuctionValidators: 6,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '15000000000000000000000',
    qualifiedStake: '15000000000000000000000',
    auctionTopUp: '47308580236833259330872',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq2lllllspsw9sj',
    auctionPosition: 52
  },
  {
    identity: 'disruptivedigital',
    locked: '59075680429685222115560',
    distribution: {
      direct: 0.17,
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqyllllls8wlxd9: 0.83
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/disruptivedigital/logo.png',
    description:
      'The ultimate goal of innovation should be the creation of a better future. Telegram: @disruptivedigital_eu',
    name: '⚡️Disruptive Digital⚡️',
    auctionValidators: 14,
    qualifiedAuctionValidators: 14,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '35000000000000000000000',
    qualifiedStake: '35000000000000000000000',
    auctionTopUp: '24075680429685222115560',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqyllllls8wlxd9',
    auctionPosition: 53
  },
  {
    identity: 'smartchainconnection',
    locked: '58018165664056729125948',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqc8llllskl0prn: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/smartchainconnection/logo.png',
    description: 'Were builders on MultiversX Blockchain.',
    name: 'SmartChainConnection',
    auctionValidators: 12,
    qualifiedAuctionValidators: 12,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '30000000000000000000000',
    qualifiedStake: '30000000000000000000000',
    auctionTopUp: '28018165664056729125948',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqc8llllskl0prn',
    auctionPosition: 54
  },
  {
    identity: 'stake_x',
    locked: '58000000000000000000000',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/stake_x/logo.png',
    name: 'Stake X',
    auctionValidators: 16,
    qualifiedAuctionValidators: 16,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '40000000000000000000000',
    qualifiedStake: '40000000000000000000000',
    auctionTopUp: '18000000000000000000000',
    auctionPosition: 55
  },
  {
    identity: 'mempoolcapital',
    locked: '54744362420925822797632',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqklllllsd99rr4: 0.82,
      direct: 0.18
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/mempoolcapital/logo.png',
    description:
      'MemPool Capital is backing leading teams & protocols in the Web3 Industry',
    name: 'MemPool Capital',
    auctionValidators: 12,
    qualifiedAuctionValidators: 12,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '30000000000000000000000',
    qualifiedStake: '30000000000000000000000',
    auctionTopUp: '24744362420925822797632',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqklllllsd99rr4',
    auctionPosition: 56
  },
  {
    identity: 'easy2stake',
    locked: '54005369136003464354352',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqghllllsku0nzf: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/easy2stake/logo.png',
    description:
      'Easy.Stake.Trust. as easy and as simple as you would click next. Complete transparency and trust with a secure and stable validator.',
    name: 'Easy 2 Stake',
    auctionValidators: 16,
    qualifiedAuctionValidators: 16,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '40000000000000000000000',
    qualifiedStake: '40000000000000000000000',
    auctionTopUp: '14005369136003464354352',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqghllllsku0nzf',
    auctionPosition: 57
  },
  {
    identity: 'bharvest',
    locked: '53877144706267020036472',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq58llllsvkkv8s: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/bharvest/logo.png',
    description: 'Provides secure validation services for dPoS networks',
    name: 'B-Harvest',
    auctionValidators: 14,
    qualifiedAuctionValidators: 14,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '35000000000000000000000',
    qualifiedStake: '35000000000000000000000',
    auctionTopUp: '18877144706267020036472',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq58llllsvkkv8s',
    auctionPosition: 58
  },
  {
    identity: 'stakegen',
    locked: '53127224451714856331297',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqk0llllsm6h64t: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/stakegen/logo.png',
    name: 'stakeGEN',
    auctionValidators: 17,
    qualifiedAuctionValidators: 17,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '42500000000000000000000',
    qualifiedStake: '42500000000000000000000',
    auctionTopUp: '10627224451714856331297',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqk0llllsm6h64t',
    auctionPosition: 59
  },
  {
    identity: 'westake',
    locked: '53055940705773085203746',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq68lllls2g8068: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/westake/logo.png',
    name: 'WeStake',
    auctionValidators: 14,
    qualifiedAuctionValidators: 14,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '35000000000000000000000',
    qualifiedStake: '35000000000000000000000',
    auctionTopUp: '18055940705773085203746',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq68lllls2g8068',
    auctionPosition: 60
  },
  {
    identity: 'stake24',
    locked: '51587549677438902377600',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqprlllllse7rzls: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/stake24/logo.png',
    name: 'Stake24',
    auctionValidators: 10,
    qualifiedAuctionValidators: 10,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '25000000000000000000000',
    qualifiedStake: '25000000000000000000000',
    auctionTopUp: '26587549677438902377600',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqprlllllse7rzls',
    auctionPosition: 61
  },
  {
    identity: 'phidelta',
    locked: '50046100287581119902880',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpzhllllsu6wav4: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/phidelta/logo.png',
    description: 'Become who you were born to be - Elrond',
    name: 'PhiDelta Staking',
    auctionValidators: 16,
    qualifiedAuctionValidators: 16,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '40000000000000000000000',
    qualifiedStake: '40000000000000000000000',
    auctionTopUp: '10046100287581119902880',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpzhllllsu6wav4',
    auctionPosition: 62
  },
  {
    identity: 'wehaveservers',
    locked: '49560261818661260021216',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqnhllllsexcqt3: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/wehaveservers/logo.png',
    description: 'https://www.WeHaveServers.com',
    name: 'WeHaveServers.com',
    auctionValidators: 8,
    qualifiedAuctionValidators: 8,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '20000000000000000000000',
    qualifiedStake: '20000000000000000000000',
    auctionTopUp: '29560261818661260021216',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqnhllllsexcqt3',
    auctionPosition: 63
  },
  {
    identity: 'parasco1',
    locked: '48765921991824356093650',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq50lllls8dl5vl: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/parasco1/logo.png',
    description:
      'You can find us on twitter.com/ParascoStaking, parasco.ro and https://t.me/ParascoStaking !',
    name: 'Parasco Staking',
    auctionValidators: 10,
    qualifiedAuctionValidators: 10,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '25000000000000000000000',
    qualifiedStake: '25000000000000000000000',
    auctionTopUp: '23765921991824356093650',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq50lllls8dl5vl',
    auctionPosition: 64
  },
  {
    identity: 'inceptionnetwork',
    locked: '47892161680896538589922',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq00llllsghg898: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/inceptionnetwork/logo.png',
    name: 'Inception Network',
    auctionValidators: 9,
    qualifiedAuctionValidators: 9,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '22500000000000000000000',
    qualifiedStake: '22500000000000000000000',
    auctionTopUp: '25392161680896538589922',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq00llllsghg898',
    auctionPosition: 65
  },
  {
    identity: 'd1fferentcapital',
    locked: '46933053072848171377497',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqm0lllls0v2sfz: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/d1fferentcapital/logo.png',
    description: 'Bridging the analog & digital worlds.',
    name: 'D1fferent Capital',
    auctionValidators: 9,
    qualifiedAuctionValidators: 9,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '22500000000000000000000',
    qualifiedStake: '22500000000000000000000',
    auctionTopUp: '24433053072848171377497',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqm0lllls0v2sfz',
    auctionPosition: 66
  },
  {
    identity: 'rafstakeagency',
    locked: '45665437855169372688108',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq5hlllls6fy43w: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/rafstakeagency/logo.png',
    description:
      'As a MultiversX staking provider, we want to share our passion for blockchains and MultiversX especially.',
    name: 'Raf Staking',
    auctionValidators: 12,
    qualifiedAuctionValidators: 12,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '30000000000000000000000',
    qualifiedStake: '30000000000000000000000',
    auctionTopUp: '15665437855169372688108',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq5hlllls6fy43w',
    auctionPosition: 67
  },
  {
    identity: 'astrarizon',
    locked: '44282479477072586777168',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpq8llllskj52rl: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/astrarizon/logo.png',
    description: 'Staking provider bridging horizon boundaries.',
    name: 'Astrarizon',
    auctionValidators: 8,
    qualifiedAuctionValidators: 8,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '20000000000000000000000',
    qualifiedStake: '20000000000000000000000',
    auctionTopUp: '24282479477072586777168',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpq8llllskj52rl',
    auctionPosition: 68
  },
  {
    identity: 'rarity-market',
    locked: '44275414098472168437711',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq70llllss57t2f: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/rarity-market/logo.png',
    description: 'We bring real artists and collectors into the NFT space.',
    name: 'Rarity.market NFT marketplace',
    auctionValidators: 9,
    qualifiedAuctionValidators: 9,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '22500000000000000000000',
    qualifiedStake: '22500000000000000000000',
    auctionTopUp: '21775414098472168437711',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq70llllss57t2f',
    auctionPosition: 69
  },
  {
    identity: 'woodstocknodes',
    locked: '43880859161827956514685',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe8llllscqtxme: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/woodstocknodes/logo.png',
    description:
      'Woodstock Fund is a Multi-Asset Investment Fund and invests in early and growth-stage Distributed Ledger Technology (DLT) startups and companies.',
    name: 'Woodstock Fund',
    auctionValidators: 5,
    qualifiedAuctionValidators: 5,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '12500000000000000000000',
    qualifiedStake: '12500000000000000000000',
    auctionTopUp: '31380859161827956514685',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe8llllscqtxme',
    auctionPosition: 70
  },
  {
    identity: 'open-stake',
    locked: '43243408213205629270248',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq0llllls7g67ne: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/open-stake/logo.png',
    description:
      'OpenStake.io allows you to stake the most promising crypto assets out there. Delegate with us!',
    name: 'Open Stake',
    auctionValidators: 11,
    qualifiedAuctionValidators: 11,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '27500000000000000000000',
    qualifiedStake: '27500000000000000000000',
    auctionTopUp: '15743408213205629270248',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq0llllls7g67ne',
    auctionPosition: 71
  },
  {
    identity: 'kilnfi',
    locked: '42341991605285356761630',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpy8lllls84ykc7: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/kilnfi/logo.png',
    description: 'Enterprise-grade staking made easy',
    name: 'Kiln',
    auctionValidators: 3,
    qualifiedAuctionValidators: 3,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '7500000000000000000000',
    qualifiedStake: '7500000000000000000000',
    auctionTopUp: '34841991605285356761630',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpy8lllls84ykc7',
    auctionPosition: 72
  },
  {
    identity: 'orangestaking',
    locked: '37687863745071396928130',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqxhllllssz7sl7: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/orangestaking/logo.png',
    description:
      'Orange Staking is a staking provider on the MultiversX blockchain',
    name: 'Orange Staking',
    auctionValidators: 10,
    qualifiedAuctionValidators: 10,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '25000000000000000000000',
    qualifiedStake: '25000000000000000000000',
    auctionTopUp: '12687863745071396928130',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqxhllllssz7sl7',
    auctionPosition: 73
  },
  {
    identity: 'stakecamp',
    locked: '37148446403493664374870',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv8lllls3ydk0k: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/stakecamp/logo.png',
    name: 'stakecamp',
    auctionValidators: 15,
    qualifiedAuctionValidators: 15,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '37148446403493664374870',
    qualifiedStake: '37148446403493664374870',
    auctionTopUp: '0',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv8lllls3ydk0k',
    auctionPosition: 74
  },
  {
    identity: 'ieleman',
    locked: '36973933735144116420640',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqplllllscktaww: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/ieleman/logo.png',
    description: 'Small MultiversX delegation pool for friends and family.',
    name: 'Ieleman',
    auctionValidators: 10,
    qualifiedAuctionValidators: 10,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '25000000000000000000000',
    qualifiedStake: '25000000000000000000000',
    auctionTopUp: '11973933735144116420640',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqplllllscktaww',
    auctionPosition: 75
  },
  {
    identity: 'hyperblockspro',
    locked: '36539092564972682117792',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3lllllsw2eke2: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/hyperblockspro/logo.png',
    description: 'Professional Proof-of-Stake Services',
    name: 'Hyperblocks Pro',
    auctionValidators: 8,
    qualifiedAuctionValidators: 8,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '20000000000000000000000',
    qualifiedStake: '20000000000000000000000',
    auctionTopUp: '16539092564972682117792',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3lllllsw2eke2',
    auctionPosition: 76
  },
  {
    identity: 'tortugastaking',
    locked: '36369725241973365265065',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdhllllsfymgpz: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/tortugastaking/logo.png',
    description:
      'We operate highly secure nodes for PoS protocols to ensure maximum efficiency and security.',
    name: 'Tortuga Staking ',
    auctionValidators: 7,
    qualifiedAuctionValidators: 7,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '17500000000000000000000',
    qualifiedStake: '17500000000000000000000',
    auctionTopUp: '18869725241973365265065',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdhllllsfymgpz',
    auctionPosition: 77
  },
  {
    identity: 'valuestaking',
    locked: '34115422256593475612008',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqu0llllsvrk9na: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/valuestaking/logo.png',
    description: 'The professional way to stake!',
    name: 'Valuestaking',
    auctionValidators: 8,
    qualifiedAuctionValidators: 8,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '20000000000000000000000',
    qualifiedStake: '20000000000000000000000',
    auctionTopUp: '14115422256593475612008',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqu0llllsvrk9na',
    auctionPosition: 78
  },
  {
    identity: 'ninjastaking',
    locked: '33010941883276197453336',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq48llllszfjtl6: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/ninjastaking/logo.png',
    description: 'EGLD staking with X Ninjas. Part of MultiversDAO.',
    name: 'Ninja Staking ',
    auctionValidators: 8,
    qualifiedAuctionValidators: 8,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '20000000000000000000000',
    qualifiedStake: '20000000000000000000000',
    auctionTopUp: '13010941883276197453336',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq48llllszfjtl6',
    auctionPosition: 79
  },
  {
    identity: 'anon-multiversx',
    locked: '31999999999999999999992',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/anon-multiversx/logo.png',
    name: '07c071b7c4b6d2e2198ccd8683534884b029ed4552fdb97dff6e3d08d9ca93278ca5cf48df933cd7b0f753b130877d0f6d3331f677164ae99966a198088583518495ac55e3725e06d0511cf9dc0c3919e1b45538a38113a082711e57f3a58986',
    auctionValidators: 12,
    qualifiedAuctionValidators: 12,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '30000000000000000000000',
    qualifiedStake: '30000000000000000000000',
    auctionTopUp: '1999999999999999999992',
    auctionPosition: 80
  },
  {
    identity: 'kryptodots',
    locked: '31240845373904637895474',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqw0llllsxgvqad: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/kryptodots/logo.png',
    description:
      'The smart way to keep your crypto recovery seed and private keys safe! Telegram: @kryptodots',
    name: 'KryptoDots️',
    auctionValidators: 2,
    qualifiedAuctionValidators: 2,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '5000000000000000000000',
    qualifiedStake: '5000000000000000000000',
    auctionTopUp: '26240845373904637895474',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqw0llllsxgvqad',
    auctionPosition: 81
  },
  {
    identity: 'galaxyone',
    locked: '29858946486540536197278',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqj8llllspxw799: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/galaxyone/logo.png',
    name: 'Buidly Staking',
    auctionValidators: 9,
    qualifiedAuctionValidators: 9,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '22500000000000000000000',
    qualifiedStake: '22500000000000000000000',
    auctionTopUp: '7358946486540536197278',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqj8llllspxw799',
    auctionPosition: 82
  },
  {
    identity: 'rohanstake',
    locked: '29742938575633133599314',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqjhllllsheu8nm: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/rohanstake/logo.png',
    name: 'Rohanstake',
    auctionValidators: 6,
    qualifiedAuctionValidators: 6,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '15000000000000000000000',
    qualifiedStake: '15000000000000000000000',
    auctionTopUp: '14742938575633133599314',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqjhllllsheu8nm',
    auctionPosition: 83
  },
  {
    identity: 'risasoft',
    locked: '29494590518645263730190',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqthllllsy5r6rh: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/risasoft/logo.png',
    description: 'Node Operator on Rocket Pool and MultiversX',
    name: 'Risa Staking',
    auctionValidators: 5,
    qualifiedAuctionValidators: 5,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '12500000000000000000000',
    qualifiedStake: '12500000000000000000000',
    auctionTopUp: '16994590518645263730190',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqthllllsy5r6rh',
    auctionPosition: 84
  },
  {
    identity: 'cryptobayspace',
    locked: '29277199587892003013272',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq8llllls4xn0vm: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/cryptobayspace/logo.png',
    description: 'Service Stacking Provider',
    name: 'CryptoBay',
    auctionValidators: 8,
    qualifiedAuctionValidators: 8,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '20000000000000000000000',
    qualifiedStake: '20000000000000000000000',
    auctionTopUp: '9277199587892003013272',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq8llllls4xn0vm',
    auctionPosition: 85
  },
  {
    identity: 'n_a_s',
    locked: '28334518715261116092032',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqf0lllls98s48j: 0.91,
      direct: 0.09
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/n_a_s/logo.png',
    name: 'New Age Staking',
    auctionValidators: 4,
    qualifiedAuctionValidators: 4,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '10000000000000000000000',
    qualifiedStake: '10000000000000000000000',
    auctionTopUp: '18334518715261116092032',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqf0lllls98s48j',
    auctionPosition: 86
  },
  {
    identity: 'oferostaking',
    locked: '26121377567923377153328',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs0llllsk20gh7: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/oferostaking/logo.png',
    description: 'A staking agency provided by Ofero Network',
    name: 'Ofero Staking',
    auctionValidators: 8,
    qualifiedAuctionValidators: 8,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '20000000000000000000000',
    qualifiedStake: '20000000000000000000000',
    auctionTopUp: '6121377567923377153328',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs0llllsk20gh7',
    auctionPosition: 87
  },
  {
    identity: 'enttechnologies',
    locked: '25696314737747131376496',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqql0lllls7t6vjr: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/enttechnologies/logo.png',
    description: 'Growth Engine for Elrond https://t.me/EntityCommunity',
    name: 'Entity',
    auctionValidators: 4,
    qualifiedAuctionValidators: 4,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '10000000000000000000000',
    qualifiedStake: '10000000000000000000000',
    auctionTopUp: '15696314737747131376496',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqql0lllls7t6vjr',
    auctionPosition: 88
  },
  {
    identity: 'marbaldur',
    locked: '24434135190211486580306',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/marbaldur/logo.png',
    name: 'Mash',
    auctionValidators: 8,
    qualifiedAuctionValidators: 8,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '20000000000000000000000',
    qualifiedStake: '20000000000000000000000',
    auctionTopUp: '4434135190211486580306',
    auctionPosition: 89
  },
  {
    identity: 'fellowship-staking',
    locked: '23419181800379368188080',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqquhlllls38dywv: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/fellowship-staking/logo.png',
    description: 'Non-custodial staking provider.',
    name: 'Fellowship Staking',
    auctionValidators: 5,
    qualifiedAuctionValidators: 5,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '12500000000000000000000',
    qualifiedStake: '12500000000000000000000',
    auctionTopUp: '10919181800379368188080',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqquhlllls38dywv',
    auctionPosition: 90
  },
  {
    identity: 'octopos',
    locked: '22500000000000000000000',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/octopos/logo.png',
    name: 'Octopos',
    auctionValidators: 9,
    qualifiedAuctionValidators: 9,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '22500000000000000000000',
    qualifiedStake: '22500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 91
  },
  {
    identity: 'castlestake',
    locked: '22319926902158530127265',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq80llllsrepk69: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/castlestake/logo.png',
    description:
      'Staking agency which offers a stable passive income for small and large investors by having stable nodes and low fee. Get a lot of fun!',
    name: 'CastleStake.com',
    auctionValidators: 5,
    qualifiedAuctionValidators: 5,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '12500000000000000000000',
    qualifiedStake: '12500000000000000000000',
    auctionTopUp: '9819926902158530127265',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq80llllsrepk69',
    auctionPosition: 92
  },
  {
    identity: 'cavaleriastaking',
    locked: '22000003081815437169804',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqclllllstm5q7z: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/cavaleriastaking/logo.png',
    description: 'IA CALEA CAVALERULUI MODERN.\r\nFĂ STAKING CU NOI!',
    name: 'Cavaleria Staking',
    auctionValidators: 4,
    qualifiedAuctionValidators: 4,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '10000000000000000000000',
    qualifiedStake: '10000000000000000000000',
    auctionTopUp: '12000003081815437169804',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqclllllstm5q7z',
    auctionPosition: 93
  },
  {
    identity: 'cryptoshigo',
    locked: '21163685740954387947792',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/cryptoshigo/logo.png',
    name: 'CryptoShiGo',
    auctionValidators: 7,
    qualifiedAuctionValidators: 7,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '17500000000000000000000',
    qualifiedStake: '17500000000000000000000',
    auctionTopUp: '3663685740954387947792',
    auctionPosition: 94
  },
  {
    identity: '01node',
    locked: '20949603508920561849156',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpxlllllsxxheum: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/01node/logo.png',
    description: 'High Quality Staking and Validation Services',
    name: '01node',
    auctionValidators: 4,
    qualifiedAuctionValidators: 4,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '10000000000000000000000',
    qualifiedStake: '10000000000000000000000',
    auctionTopUp: '10949603508920561849156',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpxlllllsxxheum',
    auctionPosition: 95
  },
  {
    identity: 'wavenodevalidat',
    locked: '19003049984176945774755',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqd0lllls5qqfun: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/wavenodevalidat/logo.png',
    description: 'MultiversX Validator',
    name: 'Wavenode',
    auctionValidators: 5,
    qualifiedAuctionValidators: 5,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '12500000000000000000000',
    qualifiedStake: '12500000000000000000000',
    auctionTopUp: '6503049984176945774755',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqd0lllls5qqfun',
    auctionPosition: 96
  },
  {
    identity: 'stakecon',
    locked: '17751116398044775122376',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqglllllsa8xtfx: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/stakecon/logo.png',
    description: 'Elrond (eGLD) - Staking provider',
    name: 'StakeCON',
    auctionValidators: 4,
    qualifiedAuctionValidators: 4,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '10000000000000000000000',
    qualifiedStake: '10000000000000000000000',
    auctionTopUp: '7751116398044775122376',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqglllllsa8xtfx',
    auctionPosition: 97
  },
  {
    identity: 'gbunea',
    locked: '17502707307223392523976',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqp8lllllsgen7y3: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/gbunea/logo.png',
    description: 'Syncnode Validator',
    name: 'SyncNode',
    auctionValidators: 4,
    qualifiedAuctionValidators: 4,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '10000000000000000000000',
    qualifiedStake: '10000000000000000000000',
    auctionTopUp: '7502707307223392523976',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqp8lllllsgen7y3',
    auctionPosition: 98
  },
  {
    identity: 'stakepit',
    locked: '17500000000000000000000',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/stakepit/logo.png',
    description: 'Validating blocks of eGold dust in the MultiversX.',
    name: 'Stake Pit',
    auctionValidators: 7,
    qualifiedAuctionValidators: 7,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '17500000000000000000000',
    qualifiedStake: '17500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 99
  },
  {
    locked: '16900000000000000000000',
    distribution: {
      direct: 1
    },
    name: '5396208abff7a5c9b3ed4e736d65d3bdc7e5fa12e28c0abb35a37ec94ca873b17483aeaa7daa42041829844f0abf660c588fd739a2a4bd848d8826ee1242f1178336f96d8e08c2891486241f158a174d4e1a0cef4b3473e161dd4688b0151081',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '14400000000000000000000',
    auctionPosition: 100
  },
  {
    identity: 'chiefeng',
    locked: '16716683631851753963972',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqwhllllsmvhpqu: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/chiefeng/logo.png',
    name: '🌍 Chief Engineer Staking⚓',
    auctionValidators: 4,
    qualifiedAuctionValidators: 4,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '10000000000000000000000',
    qualifiedStake: '10000000000000000000000',
    auctionTopUp: '6716683631851753963972',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqwhllllsmvhpqu',
    auctionPosition: 101
  },
  {
    identity: 'nictherick',
    locked: '16679423544982728518230',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqvhlllls8ml0eg: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/nictherick/logo.png',
    description: 'Feel free with Staking.',
    name: 'Nic Staking',
    auctionValidators: 5,
    qualifiedAuctionValidators: 5,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '12500000000000000000000',
    qualifiedStake: '12500000000000000000000',
    auctionTopUp: '4179423544982728518230',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqvhlllls8ml0eg',
    auctionPosition: 102
  },
  {
    identity: 'inotel',
    locked: '16331717846325892306464',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpx8llllsmzvcp2: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/inotel/logo.png',
    description: 'We do staking for a living!',
    name: 'Inotel',
    auctionValidators: 4,
    qualifiedAuctionValidators: 4,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '10000000000000000000000',
    qualifiedStake: '10000000000000000000000',
    auctionTopUp: '6331717846325892306464',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpx8llllsmzvcp2',
    auctionPosition: 103
  },
  {
    identity: 'mapleleafnetwork',
    locked: '16228967582490463906688',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpp8llllscdsdm4: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/mapleleafnetwork/logo.png',
    description: 'MultiversX | Validator Node Operator.',
    name: 'Maple Leaf Network',
    auctionValidators: 4,
    qualifiedAuctionValidators: 4,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '10000000000000000000000',
    qualifiedStake: '10000000000000000000000',
    auctionTopUp: '6228967582490463906688',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpp8llllscdsdm4',
    auctionPosition: 104
  },
  {
    identity: 'art3mis',
    locked: '15505243946458499317180',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq4lllllsldf2zt: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/art3mis/logo.png',
    name: 'art3mis.cloud',
    auctionValidators: 5,
    qualifiedAuctionValidators: 5,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '12500000000000000000000',
    qualifiedStake: '12500000000000000000000',
    auctionTopUp: '3005243946458499317180',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq4lllllsldf2zt',
    auctionPosition: 105
  },
  {
    identity: 'restake',
    locked: '14179105980169571641388',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqa0llllszujzth: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/restake/logo.png',
    description: 'Effortless staking with institutional standards',
    name: 'Restake',
    auctionValidators: 2,
    qualifiedAuctionValidators: 2,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '5000000000000000000000',
    qualifiedStake: '5000000000000000000000',
    auctionTopUp: '9179105980169571641388',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqa0llllszujzth',
    auctionPosition: 106
  },
  {
    identity: 'truststakingsw',
    locked: '13319608930136455814532',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqvlllllsvqkhj8: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/truststakingsw/logo.png',
    description: 'Member of the parent company Trust Staking S.R.L',
    name: 'Trust Staking Switzerland',
    auctionValidators: 2,
    qualifiedAuctionValidators: 2,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '5000000000000000000000',
    qualifiedStake: '5000000000000000000000',
    auctionTopUp: '8319608930136455814532',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqvlllllsvqkhj8',
    auctionPosition: 107
  },
  {
    identity: 'bwarelabs',
    locked: '13012654593039600823820',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqt0llllsescm7x: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/bwarelabs/logo.png',
    description: 'Decentralized Infrastructure for Everyone',
    name: 'Bware Labs',
    auctionValidators: 4,
    qualifiedAuctionValidators: 4,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '10000000000000000000000',
    qualifiedStake: '10000000000000000000000',
    auctionTopUp: '3012654593039600823820',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqt0llllsescm7x',
    auctionPosition: 108
  },
  {
    identity: 'pulsarmoney',
    locked: '12758486270960755043486',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpg8llllsauamua: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/pulsarmoney/logo.png',
    description: 'Smart Payments Hub',
    name: 'Pulsar Money',
    auctionValidators: 2,
    qualifiedAuctionValidators: 2,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '5000000000000000000000',
    qualifiedStake: '5000000000000000000000',
    auctionTopUp: '7758486270960755043486',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpg8llllsauamua',
    auctionPosition: 109
  },
  {
    identity: 'steak4all',
    locked: '12267382317655138877638',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq2hlllls2t8ama: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/steak4all/logo.png',
    description:
      'Steak4All steaking and gaming, powered by our STEAKS token rewards',
    name: 'steak4all',
    auctionValidators: 2,
    qualifiedAuctionValidators: 2,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '5000000000000000000000',
    qualifiedStake: '5000000000000000000000',
    auctionTopUp: '7267382317655138877638',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq2hlllls2t8ama',
    auctionPosition: 110
  },
  {
    identity: 'swigsstaking',
    locked: '12217256373510137718240',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqahllllslcfrkx: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/swigsstaking/logo.png',
    description:
      'Swiss technology and blockchain solution company www.swigs.ch',
    name: 'Swigs Staking',
    auctionValidators: 3,
    qualifiedAuctionValidators: 3,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '7500000000000000000000',
    qualifiedStake: '7500000000000000000000',
    auctionTopUp: '4717256373510137718240',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqahllllslcfrkx',
    auctionPosition: 111
  },
  {
    identity: 'endeavorstaking',
    locked: '11863380711568762943997',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpy0llllsvwdwn3: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/endeavorstaking/logo.png',
    description:
      'EndeavorStaking is a staking provider for the internet-scale blockchain MultiversX.',
    name: 'EndeavorStaking',
    auctionValidators: 3,
    qualifiedAuctionValidators: 3,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '7500000000000000000000',
    qualifiedStake: '7500000000000000000000',
    auctionTopUp: '4363380711568762943997',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpy0llllsvwdwn3',
    auctionPosition: 112
  },
  {
    identity: 'Metropolis',
    locked: '11392229216076141633770',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpf8llllsnreuyh: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/Metropolis/logo.png',
    description:
      'Metropolis Staking "It starts with a village, to build a metropolis"',
    name: 'Metropolis',
    auctionValidators: 2,
    qualifiedAuctionValidators: 2,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '5000000000000000000000',
    qualifiedStake: '5000000000000000000000',
    auctionTopUp: '6392229216076141633770',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpf8llllsnreuyh',
    auctionPosition: 113
  },
  {
    identity: 'nethus',
    locked: '10277657093176874662209',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqullllls6uyu9r: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/nethus/logo.png',
    description:
      'NTH Inc provides staking services on MultiversX. The best blockchain in the world!',
    name: 'NTH Inc',
    auctionValidators: 3,
    qualifiedAuctionValidators: 3,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '7500000000000000000000',
    qualifiedStake: '7500000000000000000000',
    auctionTopUp: '2777657093176874662209',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqullllls6uyu9r',
    auctionPosition: 114
  },
  {
    identity: 'impactstaking',
    locked: '10000057766820829861414',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqp0llllswfeycs: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/impactstaking/logo.png',
    description:
      'Stake to make an impact! We make regular donations to good causes around the globe.',
    name: 'ImpactStaking',
    auctionValidators: 2,
    qualifiedAuctionValidators: 2,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '5000000000000000000000',
    qualifiedStake: '5000000000000000000000',
    auctionTopUp: '5000057766820829861414',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqp0llllswfeycs',
    auctionPosition: 115
  },
  {
    identity: 'omni1979',
    locked: '10000000000000000000000',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/omni1979/logo.png',
    description:
      '"The Shire at this time had hardly any ‘government’. Families for the most part managed their own affairs."',
    name: 'Shire Staking',
    auctionValidators: 4,
    qualifiedAuctionValidators: 4,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '10000000000000000000000',
    qualifiedStake: '10000000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 116
  },
  {
    identity: 'elrond-giants',
    locked: '9974428028478188320528',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpz0llllsp74u3y: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/elrond-giants/logo.png',
    description: 'Giants Labs',
    name: 'Giants Labs',
    auctionValidators: 2,
    qualifiedAuctionValidators: 2,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '5000000000000000000000',
    qualifiedStake: '5000000000000000000000',
    auctionTopUp: '4974428028478188320528',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpz0llllsp74u3y',
    auctionPosition: 117
  },
  {
    identity: 'truststakingpt',
    locked: '9441806529596778717538',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq0hlllls4nnxck: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/truststakingpt/logo.png',
    description:
      'The most based MEME token on MultiversX, managed by the one and only Trust Staking',
    name: '$BOBER',
    auctionValidators: 2,
    qualifiedAuctionValidators: 2,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '5000000000000000000000',
    qualifiedStake: '5000000000000000000000',
    auctionTopUp: '4441806529596778717538',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq0hlllls4nnxck',
    auctionPosition: 118
  },
  {
    identity: 'moneydigitalx',
    locked: '9219293978175493800248',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqwlllllssh7etn: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/moneydigitalx/logo.png',
    description: 'https://moneydigital.io/',
    name: 'MoneyDigitalX',
    auctionValidators: 2,
    qualifiedAuctionValidators: 2,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '5000000000000000000000',
    qualifiedStake: '5000000000000000000000',
    auctionTopUp: '4219293978175493800248',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqwlllllssh7etn',
    auctionPosition: 119
  },
  {
    identity: 'primestaking',
    locked: '9131389078588337773756',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe0llllsnmz7sk: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/primestaking/logo.png',
    description: 'Staking Provider',
    name: 'Prime Staking',
    auctionValidators: 2,
    qualifiedAuctionValidators: 2,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '5000000000000000000000',
    qualifiedStake: '5000000000000000000000',
    auctionTopUp: '4131389078588337773756',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe0llllsnmz7sk',
    auctionPosition: 120
  },
  {
    identity: 'trustwallet',
    locked: '8703422181746634680228',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpxhllllsda7ph5: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/trustwallet/logo.png',
    description: 'True crypto ownership. Powerful Web3 experiences',
    name: 'Trust Wallet',
    auctionValidators: 2,
    qualifiedAuctionValidators: 2,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '5000000000000000000000',
    qualifiedStake: '5000000000000000000000',
    auctionTopUp: '3703422181746634680228',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpxhllllsda7ph5',
    auctionPosition: 121
  },
  {
    identity: 'staking4all',
    locked: '8458623476285418512538',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpghllllstr0z2r: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/staking4all/logo.png',
    description:
      'Validator for Proof of Stake blockchains. Delegate to us for a easy staking experience',
    name: 'Staking4All',
    auctionValidators: 2,
    qualifiedAuctionValidators: 2,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '5000000000000000000000',
    qualifiedStake: '5000000000000000000000',
    auctionTopUp: '3458623476285418512538',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpghllllstr0z2r',
    auctionPosition: 122
  },
  {
    identity: 'rockxrocks',
    locked: '8451681267034779556582',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq7hllllsds92hc: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/rockxrocks/logo.png',
    description:
      'Lead the digital staking economy by being part of our security and technology for Web 3.0',
    name: 'RockX',
    auctionValidators: 2,
    qualifiedAuctionValidators: 2,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '5000000000000000000000',
    qualifiedStake: '5000000000000000000000',
    auctionTopUp: '3451681267034779556582',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq7hllllsds92hc',
    auctionPosition: 123
  },
  {
    locked: '8213732678036140505348',
    distribution: {
      direct: 1
    },
    name: '51b3f1f284decefa8fa462338b48597d8753a8aa16374818626ad94b8096d4e1bf08358bca87a1af16d6f362a66afe0f1ae94e0c5d590d65ce34677867c3ff480d286d5649c7dac26e5bc08aa3e28fe61df6427f79da2d66a35133c670700610',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '5713732678036140505348',
    auctionPosition: 124
  },
  {
    identity: 'zillabytes',
    locked: '8118692367333059036248',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3hlllls93swj9: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/zillabytes/logo.png',
    name: 'Elrond Philippines Staking',
    auctionValidators: 2,
    qualifiedAuctionValidators: 2,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '5000000000000000000000',
    qualifiedStake: '5000000000000000000000',
    auctionTopUp: '3118692367333059036248',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3hlllls93swj9',
    auctionPosition: 125
  },
  {
    identity: 'imsm',
    locked: '7500000000000000000000',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/imsm/logo.png',
    name: 'Dappmed Poland',
    auctionValidators: 3,
    qualifiedAuctionValidators: 3,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '7500000000000000000000',
    qualifiedStake: '7500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 126
  },
  {
    identity: 'fourtytwoag',
    locked: '7269844816343772640618',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpyllllls63lh90: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/fourtytwoag/logo.png',
    description:
      'We are an integrator for Web3 on MultiversX. We are building smart contracts, NFT marketplaces and customizable dapps.',
    name: 'FourtyTwo',
    auctionValidators: 2,
    qualifiedAuctionValidators: 2,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '5000000000000000000000',
    qualifiedStake: '5000000000000000000000',
    auctionTopUp: '2269844816343772640618',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpyllllls63lh90',
    auctionPosition: 127
  },
  {
    identity: 'colombiastaking',
    locked: '6397026186514431333374',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqallllls5rqmaf: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/colombiastaking/logo.png',
    description: 'First Staking Provider in Colombia',
    name: 'Colombia Staking',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '3897026186514431333374',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqallllls5rqmaf',
    auctionPosition: 128
  },
  {
    identity: 'cryptobizz',
    locked: '6282769946902756036994',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhhllllsgpguss: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/cryptobizz/logo.png',
    description: 'Your partner for simplified staking on the Elrond Blockchain',
    name: 'Cryptobizz',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '3782769946902756036994',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqhhllllsgpguss',
    auctionPosition: 129
  },
  {
    identity: 'trstaking',
    locked: '6240000092827747053187',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/trstaking/logo.png',
    description: 'MultiversX Stake House since 2019',
    name: 'Transylvania Staking',
    auctionValidators: 2,
    qualifiedAuctionValidators: 2,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '5000000000000000000000',
    qualifiedStake: '5000000000000000000000',
    auctionTopUp: '1240000092827747053187',
    auctionPosition: 130
  },
  {
    identity: 'newstake',
    locked: '6135772485605452362463',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqchllllsqqac4d: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/newstake/logo.png',
    description: 'Stake for everyone.\r\n',
    name: 'Mr.Reboot',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '3635772485605452362463',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqchllllsqqac4d',
    auctionPosition: 131
  },
  {
    identity: 'silvic-staking',
    locked: '6070000000000000000000',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/silvic-staking/logo.png',
    name: '7dc6fc13e654cde891f393ecab93bee779b414e85c5ba7dd96c66343f4e682de8cbdb4b295ce3d3bf161399fe042ee114508fcd5ea8fbe16ac2d1dbbeae5822cc26620f48797cbf7d923aedcf269a4c52f28c63934574e8a5ebc5588a7842e89',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '3570000000000000000000',
    auctionPosition: 132
  },
  {
    identity: 'higherground-mx',
    locked: '5999999883075000000000',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/higherground-mx/logo.png',
    name: '68d7d5bc0aa8a95a6f174137189e623dc60047ad94b08544e0ce603d418aed407d4ae4021f532650aebfd9841eb1ce0ab70f2b19897bf3f2632e930692667ca3495e5715910e2d988c0a8297b4c35a4073fe9e2f3f4ee7da6043653728513c80',
    auctionValidators: 2,
    qualifiedAuctionValidators: 2,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '5000000000000000000000',
    qualifiedStake: '5000000000000000000000',
    auctionTopUp: '999999883075000000000',
    auctionPosition: 133
  },
  {
    locked: '5674740322328679342718',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllllllsg5g4ya: 1
    },
    name: 'cd3c5cf9626e78f3fdda2c84dfecbb2ca244dc1afaab8a3ac9ef68042cedec868b5510ac1324329e6df97496e4bda315be15ecf5eaa1d8477ddb6c5ed0ff1e4acdb30ee0287dd849809f02eb9f9a6eb1d9f1a1918494a03c21ffd1bad1293a18',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 1,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '3174740322328679342718',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllllllsg5g4ya',
    auctionPosition: 134
  },
  {
    locked: '5674740322328679342718',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllllllsg5g4ya: 1
    },
    name: '9d4ad9b59582ce76d7f83ace14b2177dc1be5dac8ddb2236df52cd190d84ef3267bda40643838782a5a4862651fd3c1245dece7d5d6aa67afcc82e21f4329af39ec726a50e497eebd7447aab4fa145041472758c40a5510393f1addc1e8b168a',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 1,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '3174740322328679342718',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllllllsg5g4ya',
    auctionPosition: 135
  },
  {
    locked: '5674740322328679342718',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllllllsg5g4ya: 1
    },
    name: '940656c1b41cbfe42d65eaa60f2f1a9f70aafea999c91e7dfcc8c6f030819d8b2f3e9d55c7ddb6126a714fa7cc07340de5a6255de080f66c537be355db3063d9f636ae46cb99203e509582b3bac314f1c94aef87627d5756978a8fefa3263095',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 1,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '3174740322328679342718',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllllllsg5g4ya',
    auctionPosition: 136
  },
  {
    locked: '5674740322328679342718',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllllllsg5g4ya: 1
    },
    name: '73809da075919875085991cfee14c918861dba6c32454f94a061bccd1e191c724a88c082c8cbd3bbea46cf0c7afae301c57f54a7cb7cce0e28a2faffb2a23d110ae501b4195332237c9e72245bdd49fb9365cb63b899493aba0e10e1aa2c0a06',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 1,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '3174740322328679342718',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllllllsg5g4ya',
    auctionPosition: 137
  },
  {
    locked: '5674740322328679342718',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllllllsg5g4ya: 1
    },
    name: '5e2d8e438bb46989c7113447dd3503d17b95f73748143730962223f3654293da583d138fa41d4e78dcae86531cbb2e0c472dda138cf21fb287df1142bdd0d19eb48ebac28f47d6963b56378fd8d35ce8368ace9c96a7dfa5aed01f62991e5595',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 1,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '3174740322328679342718',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllllllsg5g4ya',
    auctionPosition: 138
  },
  {
    locked: '5674740322328679342718',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllllllsg5g4ya: 1
    },
    name: '59ba4e8c3316e36610305c73828a9342858d6a303679fc226befa413b69f107c0dd83b05120387fd030d69790750f2120ca0182e3c3cdb61da7c84d1cde206b44b2977daad132b478fd08bd110656aa74b22751b3112c0ccf79074b6ed35d50c',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 1,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '3174740322328679342718',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllllllsg5g4ya',
    auctionPosition: 139
  },
  {
    locked: '5674740322328679342718',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllllllsg5g4ya: 1
    },
    name: '5304e0499abd49e3476380c7cdef4d93d06e62418b36bed9212f03ba2d7a84cf02c5b9ba006ba43d81c35f6ea9873b14827e7ac9d16d77804be37bc0be00ea01e85d5d4cb2a0075be72b7365736b40dc06040611cadf5c3b98179b5ed25da782',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 1,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '3174740322328679342718',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllllllsg5g4ya',
    auctionPosition: 140
  },
  {
    locked: '5674740322328679342718',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllllllsg5g4ya: 1
    },
    name: '4a922a00bdba355c8b9d555fb01c9fa12be4f544df9727aa1286f8de0181cb4944e5fb48cee743bd5cfc4df44fe2bc0556d14b069b9317d4b37195c24c1c61103650c2fa27074ac5b1fbe8cac0a1ea93c15dff4aaa94e09d2da056cafe5ffc98',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '3174740322328679342718',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllllllsg5g4ya',
    auctionPosition: 141
  },
  {
    locked: '5674740322328679342718',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllllllsg5g4ya: 1
    },
    name: '22bd559821e5948686cfc9834b07cc41cbe26b2bf2aba048ec3a1f3412e17024dfa0445fb2ef9c6c85ebc8f3cec48a0232180db44a67e36d87f933bf25e5941b1c0e3f02b21ba092c595f2c6f58b5afbcceb79dfc644c84cb2aaffd733faff89',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '3174740322328679342718',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllllllsg5g4ya',
    auctionPosition: 142
  },
  {
    locked: '5674740322328679342718',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllllllsg5g4ya: 1
    },
    name: '1b2a6abc9116a85e88f3cf5a69b29c1a2d70d8b107086281ae303b5399490a216193e1ea5541afc14368da25ad95f50dcc12a3e1b2934c1e6aad122fe2af00b0384bf0e41a4a53988d67bb39701419a23b430a99262c68dd01e0f5d902107601',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '3174740322328679342718',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqllllllsg5g4ya',
    auctionPosition: 143
  },
  {
    identity: 'apestaking',
    locked: '5317254664482787828722',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqn8lllls0e2ea0: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/apestaking/logo.png',
    description:
      'ApeStaking’s mission is simple: provide easy and fair access to staking with Elrond, the world’s most amazing blockchain.',
    name: 'ApeStaking',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2817254664482787828722',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqn8lllls0e2ea0',
    auctionPosition: 144
  },
  {
    locked: '5000000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'f4ec86939fe6ecf4c344826b48834bfd3609164627a59835bdc3ea54bc712c4ecd2adc0dfa19287fa0f72164f3a38a0e36c8dbb36d697beebd6b6c6d5f61aaeec8668706ccfbeb0ef0d46ba087a8b6bc86e5b26c1a0cce5b34f94a1e957de311',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2500000000000000000000',
    auctionPosition: 145
  },
  {
    locked: '5000000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'c05bd77e91da8f8df19054774cbb445f5c5c5e1744231dffee7c3d31256f57e6c2f4413d6a41c82b23deea2be5f56e021339eaeb7e9a995e9f8a56ce32682f242f73d51f0935ba8461e46a0316e4247adb967b2bd2caeb446610b8434800a310',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2500000000000000000000',
    auctionPosition: 146
  },
  {
    locked: '5000000000000000000000',
    distribution: {
      direct: 1
    },
    name: '995f961e29dbc3980ba6664a81e4ef41be2c43c72af1a49c4821d866421e02d742db45aab5dae23fa616fe046e9078046a9d4c5795e42fadf909546191317f4b913a95979756b6f7e7e97b74f885e959e72ab146cfdcd38b755274a390e66b02',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2500000000000000000000',
    auctionPosition: 147
  },
  {
    locked: '5000000000000000000000',
    distribution: {
      direct: 1
    },
    name: '1f34fdf80d49cd620f70f35674ac7245043d158ebb61f5229e7f624bf5c3c8cd91a6758a1ae6ef658cf1046a026f2f13ac69d39b8295d63c6da1735855ac9e3413dcff78808465d3064f7876f7bd9aa77b99d8fbbfbcdb1f85f5c7246578f382',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2500000000000000000000',
    auctionPosition: 148
  },
  {
    identity: 'vstake',
    locked: '4977158479115466281491',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpglllllsqcx6pv: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/vstake/logo.png',
    description: 'Vstake has been part of MultiversX since Mainnet Genesis.',
    name: 'Vstake',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2477158479115466281491',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpglllllsqcx6pv',
    auctionPosition: 149
  },
  {
    identity: 'truststakingne',
    locked: '4811512365788918047635',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqjlllllsuz4lc5: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/truststakingne/logo.png',
    description: 'Member of the parent company Trust Staking S.R.L',
    name: 'Trust the Netherlands',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2311512365788918047635',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqjlllllsuz4lc5',
    auctionPosition: 150
  },
  {
    locked: '4795225782661004381141',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym: 1
    },
    name: 'f677a0a6b8deb23e10d3abdac15b4f613c2ebd15c5f7d4f6591b04a9c9ea5cb238b95ebd786d2e5a3192b6032cae5714d71f4e7f2429d2ca091ab186acc53d17805c87881701abaf55c3cac5d50ea30fd14ab945e4fe1adf01ea5db0f4be1501',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2295225782661004381141',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym',
    auctionPosition: 151
  },
  {
    locked: '4795225782661004381141',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym: 1
    },
    name: 'cdfb6d379953fb2f35a14c8bdd9a64c632b22386ee7156f9c928c10a200dcfb4898d3ed41da34b56214a12e4df516f18f33472b2cf824dd90a22aca93d82aee8d11c0d99c553178e30b4267f1436f0755cef013527aae76c5db9579940967d87',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2295225782661004381141',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym',
    auctionPosition: 152
  },
  {
    locked: '4795225782661004381141',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym: 1
    },
    name: 'c02d01362758e59790ef023dd2f98c8bf41c939b8ffd688369f7b7cab0cba7a2c2ea9a2ab58f1e37e76e24eb2c23f108e4d38c74cb9424059981851dcd83a9d383e84341e9d683fdedbb0f2d34b94c8b2e6dc984babbe69062f9447249d9908d',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2295225782661004381141',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym',
    auctionPosition: 153
  },
  {
    locked: '4795225782661004381141',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym: 1
    },
    name: 'bfa7f7a97de9acb96392e5978609f40ca77ad51b242021d7a077e8f118e6a6a0e6b092cd946e9b379f68cbe7d5da49003a2f672188bdcbff33eea4103634f4cba6dcc6207d935b75581a350b1d051ff67210eec40b72d8b285e7aba3ef252194',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2295225782661004381141',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym',
    auctionPosition: 154
  },
  {
    locked: '4795225782661004381141',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym: 1
    },
    name: 'b42d70e6fc10ad17b10f8090d49d7fb2f00db7381b100c2432219a0a82fbb3eddf27ea4ef385fb7b225daa885bc4b5038fe33093abce193c7394f7805e78e95b3a3c8f07df3d95f691ce73bd4cadf037c3f7a215da4cd99ca840a97220515b09',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2295225782661004381141',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym',
    auctionPosition: 155
  },
  {
    locked: '4795225782661004381141',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym: 1
    },
    name: 'ae0a7a95c6287010f439d5197723a29c8420509c5a010af23b54e282a7b4b65a03980286bc023b3061a49f0a1dcbed199c0091c381fb625e970159aea22b68b38c7d8bd695ada10f2a6a30330b1fe4facfad28f867c68d09643935cae762b610',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2295225782661004381141',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym',
    auctionPosition: 156
  },
  {
    locked: '4795225782661004381141',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym: 1
    },
    name: '980b4894f95475b447c4b427510a809d12d0fecfec4ad8b92f2d160de9dda9dcbd7a0e45779d2592d5ae9246065cfd059c0d74e761b3b04f500089817d332ec4107bf976e9b104c0412291d20310963c0f17ec6d7ea217a98b228e293c40f58f',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2295225782661004381141',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym',
    auctionPosition: 157
  },
  {
    locked: '4795225782661004381141',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym: 1
    },
    name: '75a00e1d2eaa78fdab217c3001012ea58750f61fb56b41b52c8ae3d71cde4aa95c698c478d2dd3fb8ab267b6fe123f01d0ce452fc4466d72075e486f5011cc2fa5699347af314b38aeace3f5f5dca5949cac6f1317e2c18e5cfcbbc4b4252b07',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2295225782661004381141',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym',
    auctionPosition: 158
  },
  {
    locked: '4795225782661004381141',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym: 1
    },
    name: '69e1ecb09c83c658588e52e3d99be26d42b4eb7ec6470d3854bf5f0f8f21a8598a3259f0b763397ee2ae879e5bd640169e381c569cd6facb86166288fd142ceed68d2d0122c5f3d4d3ffef26090c4343e7c178633b598030004a1efe2bd9638b',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2295225782661004381141',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym',
    auctionPosition: 159
  },
  {
    locked: '4795225782661004381141',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym: 1
    },
    name: '6900930f63a83a0fd434b61f7db95c157f93de5b7209a40575d805a5637a6dd630fbd24bbdb2dc07441cfecf4f978305c537bc4b4f1ba269c763482fde15285f19238ec95f5ef0206a3e28ad04193effa5e7e2ae7c1de2acca6f960d1c97a698',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2295225782661004381141',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym',
    auctionPosition: 160
  },
  {
    locked: '4795225782661004381141',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym: 1
    },
    name: '61417a3aa5f13c6c536195f0d23cbb75bd1950656cdb24253bcd0a94b64736d53a2eef2ae5b3590c4a9a3c08b1b28511377af2eb49a43010cda5159d3a5cb6a00a90627b463e5fbaddaab7ad33f3980f803129c754e660980c7feaeb462a3315',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2295225782661004381141',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym',
    auctionPosition: 161
  },
  {
    locked: '4795225782661004381141',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym: 1
    },
    name: '4b52aee6ea017b8f7dc64d616b68fb75bc2c8b12ca317958f751b8436871a606a62260dd51faeac2e9648f8b1e7aa206384fefd3f7d9187490f96b2801451acabd331c2c9914b90213aceeda91ad35d6393336241b995b9820ae5145a8761b8f',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2295225782661004381141',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym',
    auctionPosition: 162
  },
  {
    locked: '4795225782661004381141',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym: 1
    },
    name: '2e393e94a961bf75e52f8a6724a16d22beb08388cfb852d9b220646ec220094137c5b68b1ce046df6f36a6f26d2dbe1102b792c6957977241cd22876875daa739ab841e9b4331bfa105f0b73a828b7dd0cebc58268e796bbf8e89fbed78fa594',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2295225782661004381141',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym',
    auctionPosition: 163
  },
  {
    locked: '4795225782661004381141',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym: 1
    },
    name: '28f4a0a598db8975941b3cff6182b8552f04aa0b9856016b879362d27eef3e4ab06bcf239d3196313757d0ad97a00215a138d84a4da7fca2744c2b7678435a06286763a3388d2d2f28474ec9e23ee13aa48ffeb65d989ee629e99d12177b3c09',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2295225782661004381141',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym',
    auctionPosition: 164
  },
  {
    locked: '4795225782661004381141',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym: 1
    },
    name: '27000923daef2465e315dd619690a7b9250085774e94331bcd891bc3419c1a2fcd7f561c461ac6424bcbbff9e2431f0a813e12ed4a31968f4853295a5aea3875a0a6e94c36b85c0be7e473f9e7a199844588f74eec1275e147029b85f6edf80f',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2295225782661004381141',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym',
    auctionPosition: 165
  },
  {
    locked: '4795225782661004381141',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym: 1
    },
    name: '21949e2963b5bb3906c947ae9dd64151984ac3d16169b97344f7856c89afb26fa0a98b189001884d3baac3170c09530b0ace3fd50cd552b58e777c018ae1a47a9d3c77aa3da5be1bbfcbb62d7053de6f3848d107e181c83bfd457e3d941ca003',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2295225782661004381141',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym',
    auctionPosition: 166
  },
  {
    locked: '4795225782661004381141',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym: 1
    },
    name: '05254952e6e51999aa39f80c21f149868f7387fb4146dc4d77a59e97c906d44a4c0531f8eea91a5756649336839fc100cc6a2f15e6c3e0c124f7816d92bbc51886243634c19b77783c37c5de71080d6a36224aafedf62fa9ab94ccfa14acd700',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2295225782661004381141',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq38llllsnwzhym',
    auctionPosition: 167
  },
  {
    identity: 'allstar-staking',
    locked: '4790484941442327297538',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/allstar-staking/logo.png',
    description:
      'AllStar-Staking provides private staking services for the most advanced blockchain in the world: MultiversX',
    name: 'AllStar-Staking',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2290484941442327297538',
    auctionPosition: 168
  },
  {
    identity: 'ttt-thetransylvaniantrader',
    locked: '4766955067258425271047',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqp98llllsf2q3q5: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/ttt-thetransylvaniantrader/logo.png',
    description: 'Navigating the world of finance one trade at a time.',
    name: 'TheTransylvanianTrader',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2266955067258425271047',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqp98llllsf2q3q5',
    auctionPosition: 169
  },
  {
    identity: 'orius',
    locked: '4762996832074860341669',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqp80lllls7xp8j0: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/orius/logo.png',
    description:
      'Your offshore Staking Provider, for even more decentralization.',
    name: 'Orius International',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2262996832074860341669',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqp80lllls7xp8j0',
    auctionPosition: 170
  },
  {
    identity: 'lionstaking',
    locked: '4677545938002673219327',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqlllllstk0t7w: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/lionstaking/logo.png',
    description: 'lionstaking.com\nStaking Agency',
    name: 'Lion Staking',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2177545938002673219327',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqlllllstk0t7w',
    auctionPosition: 171
  },
  {
    locked: '4599026873697057290295',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpx0llllsse9q29: 1
    },
    name: 'd090a67432da87188326a9083e20f4058d5c0852eec100cd7ca8d47c877770e241e4e02cafe2987e35ec9eeca2c1d810d16b4a290f2c8355a396a0c502777b000528a6e79e39383353e2eea0b5fcc3d83eb69c0df3ee77d72cd8865edf7aef06',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2099026873697057290295',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpx0llllsse9q29',
    auctionPosition: 172
  },
  {
    locked: '4599026873697057290295',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpx0llllsse9q29: 1
    },
    name: 'c09e340047072c7d3675d2792787ded9a4dec240ae4fdedc8745427303d7817cf3ed90828b5122240556647189de0505555c69edbef7244d5732a787be1b436ca34c75748925297a7c0d271fb111effe9f34b3d45ebad43eb416fcc43a74ca11',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2099026873697057290295',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpx0llllsse9q29',
    auctionPosition: 173
  },
  {
    locked: '4599026873697057290295',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpx0llllsse9q29: 1
    },
    name: '5c0ca8aa75c71a03b2377c69f59d452393cf771a6c504c4e8fff80d35960a43a617c187e2ae75522a0152ff80e7388062ce48f318e440b69151d687fa8ee7ce7171a366a0c392415604d04e4a15b157ca9986cfb6bf53ba0b33e447dcba4418a',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2099026873697057290295',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpx0llllsse9q29',
    auctionPosition: 174
  },
  {
    locked: '4599026873697057290295',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpx0llllsse9q29: 1
    },
    name: '5679c61a9367c469b93918ca04712bda1076a24e8b413229b3495f9de2ab1a3fccd0ea563695c896f4517bf2bdd5750453867d63776480f716cc3283e4c7ede088f93c93ac11183e39609197a6b04ad715931b03e919759fb19dbcc6222f0095',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2099026873697057290295',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpx0llllsse9q29',
    auctionPosition: 175
  },
  {
    locked: '4599026873697057290295',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpx0llllsse9q29: 1
    },
    name: '07683d8f7952c842e0b00a76d74b8f78231907e0aecd5aa897b97eef9fb93ebfc5014340fc05f1c5a9462fc9896a8c0fd97774c754996b61ee4ea8f68ba0b44104b27152c431746db17c9973ae5d1bc6f9d0c8dca816ed8f235a7117734da605',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2099026873697057290295',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpx0llllsse9q29',
    auctionPosition: 176
  },
  {
    identity: 'alpinesafestaking',
    locked: '4505622305857907245043',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpg0llllsk85rhj: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/alpinesafestaking/logo.png',
    description: 'AlpineSafe Staking provides straking services for MultiversX',
    name: 'AlpineSafe Staking',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2005622305857907245043',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpg0llllsk85rhj',
    auctionPosition: 177
  },
  {
    locked: '4500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'e4467fc0c7f2719a77ff45113095442754de8fe2431f6fa969fb7b56444566be73cf8c28f2590cff01ad1b276c36510e3c1f08e519c12443c827108f6cad6595ac1dcd1d86235bb3bf39a3648cd66cec1ad143b30b70cc9cc963e0f7f41cca90',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2000000000000000000000',
    auctionPosition: 178
  },
  {
    locked: '4500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'b3e7ddad6f251e26191a0e4b4efc9e96e3e0f8ff06b1bb69d6120111eb8f48711e3ed28046144824beb113b33de69f0e6b207d98f32f43db6fe96c077493506b797264f40f87eeda2957284a2b4eebfee54cc73feced30f91165866b7b50d580',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2000000000000000000000',
    auctionPosition: 179
  },
  {
    locked: '4500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'b0612ca566257595c5712ad7bbe565172405f2fdabc84ab738cda442bf710906bcaffcc90d55fe8e5beb3e8c4b5c6f068945cf1e2afb6bba71b9f255b989e2dea6c56543a1dea56b446de3039fbb2a4c68e8d3e9ef714434e98368e563e67c95',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2000000000000000000000',
    auctionPosition: 180
  },
  {
    locked: '4500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '929ae4e5596f3cd7e96721e8d1fbc7fc4685db2f0bfe5bfdbaf602c69a8fc81c4084e750db3a2f3f0253a0f951d92903ba6ba822258cbe8196149644e58e84dfa49ca426fad01b9cb2a4e5290b212f9682ea23004620e71c9b253951e849cc91',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2000000000000000000000',
    auctionPosition: 181
  },
  {
    locked: '4500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '7e6fc4bfdee093b9d48a784439eec00f217b42212e5393793cd7b3dd3b01e1e64a988768944478a1c49289ebeb7d1904eb54edf8a060eaa6d98f28d9303e32fd59c9fe0ed6ce001fca60db266cbc75c17810eed05fa639270549fd1d2f308c0b',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2000000000000000000000',
    auctionPosition: 182
  },
  {
    locked: '4500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '79d7ce0ef902b5aa56c771c3f0b69c27b0cfd7c6c64037aa3a1a9a5e39e836ff41e160b6f6e119b56262c2adcd0d78178da259468837fb0c98897be950de99082ef97807c32c0af6084c71887872cd74ca822863f4ac67381ff8b417b9a65f88',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2000000000000000000000',
    auctionPosition: 183
  },
  {
    locked: '4500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '630ea1321a01ad8cd6fdb125473000f7ec763a10c2660a83e048a9095f6eea10394d5437e6a313bd412ab87431175d10822d5f149a4ff43edd00fcad68a662511ef710c004ab44d44756424bffdd6fe738e560e184c87a1fbefceae5713b068e',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2000000000000000000000',
    auctionPosition: 184
  },
  {
    locked: '4500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '4f7ce40626d078f2f4fd864e45d9f7ca32c1944fc6a63299dce11ee232de81b3f8e9b2a27db8305173a709ab01385800ede6edbca4e86f36438d0428e9c3cb1892d5f3aeb8c6ce1358ac46369c5e75dfc37bdc8b26437bcc475f8bdc7b100314',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2000000000000000000000',
    auctionPosition: 185
  },
  {
    locked: '4500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '329906c42f6e3176e6c5a9b9fb28d0fed3158fba9593f138acbb2d81e9625626259dbbc7136aca5d219d26b16c44c702ef17b200145f895242c54bd293c005632208fa8d3731a81f8325ce74eb716cc4e0d3fdfd1c8a51f20a9222f22705fc18',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2000000000000000000000',
    auctionPosition: 186
  },
  {
    locked: '4500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '3150c1c8318a57ac78b9ee1049505cb10b68c47ce503f864f1e098c09d10ea0d56e438daf5a71e5dafd9cdee18b8e6176b88f771f62a50deb6eb11821ef8342cc1781c1d7520e1b023bf550a6b140258a68d7f16693caa3b2d28a823b68cb819',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '2000000000000000000000',
    auctionPosition: 187
  },
  {
    identity: 'friendsstaking',
    locked: '4439233634671275565035',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs8llllsa3xsu3: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/friendsstaking/logo.png',
    description:
      'We are FriendsStaking, a private staking provider of MultiverseX.',
    name: 'FriendsStaking',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1939233634671275565035',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs8llllsa3xsu3',
    auctionPosition: 188
  },
  {
    locked: '4414400000000000000000',
    distribution: {
      direct: 1
    },
    name: 'f7111600cb06ac04ebb1aa2e062065301a59aa8feb6a9ad630e154b59dbd70b2ec24dd6b8e90cdd87ada5ae9acac4a05581092c4751699712dea568ed1f18a60a42dc46119bd0163603b4f0cd3f4cd5a121f72c5b89323770a687f607ef18b02',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1914400000000000000000',
    auctionPosition: 189
  },
  {
    locked: '4414400000000000000000',
    distribution: {
      direct: 1
    },
    name: 'd947cfce92e365124e2366aa94c1ab4893097f41d4057fe367a2b1473e653375c55db00ce2f5e38247efaad6e0df1d008b5b35a6fe0ffd67c2aea300828d46c84e0759f3c51d43e61a2af8aec0fb4d8866edefe251b8ba301fc1f8a8b8519a0b',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1914400000000000000000',
    auctionPosition: 190
  },
  {
    locked: '4414400000000000000000',
    distribution: {
      direct: 1
    },
    name: 'c74d0c66f6b30d268c67fec3c3c816eb0b59baa0fdd9dafb936adc32e38a3952962608620b56188914226656f0f33d0ae02c81b0c32d97cf63c421f687a5cff4471bd9781277c9b1e928a2c9a85f041561566d63e6e2f25c6159adc99abd0282',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1914400000000000000000',
    auctionPosition: 191
  },
  {
    locked: '4414400000000000000000',
    distribution: {
      direct: 1
    },
    name: 'c1b578521aee40b800a81b8f4dd1bc69c155b9e90a90d3097b90046b0de8bd75b29442f898dbe4dc1a7a69c25ef6f311a48651e602d218e9c9e1fb307732a0ab81a62f18dd118f87c39a9bbfab8beb26b27afe5634ba373e3d50e207c7ace116',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1914400000000000000000',
    auctionPosition: 192
  },
  {
    locked: '4414400000000000000000',
    distribution: {
      direct: 1
    },
    name: 'a87eadfa712ae8b4b940e73b7c4af62dddae33886103a01364e4831641e488ff8f3f01d22755929eceaf17148a68fd012543db0af0be4dcca0939385542d5ae4983250b086733890bd1b80c782030b674fb4b2303b75e95af1bbaa49cbc42b06',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1914400000000000000000',
    auctionPosition: 193
  },
  {
    locked: '4414400000000000000000',
    distribution: {
      direct: 1
    },
    name: 'a6eb2d9ebdba55264b7a9acfea19e424125962960bcb52eaa326bd2f3daa9aa3d2bc37eb94ad5f6da3c0807c2befd2169583afc885826cdf51258787d3d218d376166c7c463330d0d72ae3fba86cb1dfb8ab2ce9aee147262f8e4800448c9d8b',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1914400000000000000000',
    auctionPosition: 194
  },
  {
    locked: '4414400000000000000000',
    distribution: {
      direct: 1
    },
    name: '880e1f9906a2c8d3b743773ae9a8da825e95ca24d6e0e4eb870b92bdeccc282ed48b200d0713e4b58a25ee6b3ee19515b080ce0b14ca6bc1addd51bb1625f2cdc0b6580ead57e6f965bde1af57b4985473d9283fa5f972f4e52c71daf9887b86',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1914400000000000000000',
    auctionPosition: 195
  },
  {
    locked: '4414400000000000000000',
    distribution: {
      direct: 1
    },
    name: '82e0c0396cf2ca016fd0972cd402d7d97b221c2dcc697ff3b529695cdfc6f00e8df93c13c189f1fbc4756b9edc5a38028cef6c61e8a0232c80a19033e693809c09d96ed55284f63aeb8dca4ed12fe5ae188d6421a3ebccc090c7ae28d8868a8b',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1914400000000000000000',
    auctionPosition: 196
  },
  {
    locked: '4414400000000000000000',
    distribution: {
      direct: 1
    },
    name: '7ccea684f31c28e7315fd0d7ce438e40c1fae1256a665799f5a0281ef118601603f7b7f88bb93dd2da4b24da7e4361183be6bdb8f40717bc06adef18f9360e0ea483e292df5dae360b94cbbd0a94674e0241c7dddc8425c3149d2631a402a617',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1914400000000000000000',
    auctionPosition: 197
  },
  {
    locked: '4414400000000000000000',
    distribution: {
      direct: 1
    },
    name: '73d8e2dad9eda9c6d3140bc786541722354f13938e1ec0d9ae2b016db02e472338f636ddf120675fa1c75bcd545277092dbaf5927f4a10768048cf026f9f025a936b61d650cc68e774c53e090eed38c5ce557d060c7612a1824f02d56c307284',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1914400000000000000000',
    auctionPosition: 198
  },
  {
    locked: '4414400000000000000000',
    distribution: {
      direct: 1
    },
    name: '737890c01c5aa9a69c398f5acbc9b6ba76ff7d8399a0798f2c65e973509da8a64200de846ae7e7a925ed8c3c0f2872170b1ce87f09f5a3e3a1e123682089df91c8eae5c3f3ac86307fa0f6fb902fb3579d4d80ac76033e178333c21edb07c480',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1914400000000000000000',
    auctionPosition: 199
  },
  {
    locked: '4414400000000000000000',
    distribution: {
      direct: 1
    },
    name: '622473cc2a134874deb7683e9988a893fadb7bd107e1db2cbd7358f4d3b2ad538c39835c48c853039ec916dcb5792005c64b1fa7448afd63125b30c2ed3e635f125a2be6699d8e8091c06ea311a7e6d20cccf25aca7124740b7b9813c9b3a610',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1914400000000000000000',
    auctionPosition: 200
  },
  {
    locked: '4414400000000000000000',
    distribution: {
      direct: 1
    },
    name: '48a058aadc7c99fa177762cf98ac2a1c01bf21990afc84c563e334bb158dc82254ba2d0b10a157216be255240363af18f648f08a53e35c9788a233c0c23b0aee1c6cbb21c237ff265b4f353e35f420b4966646959bdfa95ddeefeb35bdeaa98c',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1914400000000000000000',
    auctionPosition: 201
  },
  {
    locked: '4414400000000000000000',
    distribution: {
      direct: 1
    },
    name: '1b9d182ce6d9afb297a48eb4fd00cda0396782af5150de9c7a3c9bc8c245edd49d9ac81385fa7551a2ef09a2a2c8a6007ced06e831c356dc3fb152c91c95f925eb91407e64b48e9f968e548bf6d15bffbbfbf39573adc810fe04784ff9094182',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1914400000000000000000',
    auctionPosition: 202
  },
  {
    locked: '4414400000000000000000',
    distribution: {
      direct: 1
    },
    name: '038b45ceacd515fc6940bf43c68bf7a99b7858a54d4544d3fb089c23b5695138234458480f85c783ab7ed6a82847150ae24a1f7675416e898e43c972d734632b40aa3d0a54f4d876f1df4afedbb6bafa3c5174b79bccc4b71a4a166775636515',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1914400000000000000000',
    auctionPosition: 203
  },
  {
    identity: 'kcuk',
    locked: '4260297219190351945811',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/kcuk/logo.png',
    name: 'ken',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1760297219190351945811',
    auctionPosition: 204
  },
  {
    identity: 'paulalicante',
    locked: '4148280000000000000000',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/paulalicante/logo.png',
    name: '🇨🇵 🏖️...Paul... 🌴 🇪🇸',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1648280000000000000000',
    auctionPosition: 205
  },
  {
    locked: '4084171873817878499937',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpyhlllls32k0wq: 1
    },
    name: '2826d817d404c4f968137edbb4c11c94dec7676f1823d4b9b8c5bac3f5cb6e8f4d08a72c6b7bf60e04583596737c13077ca6bde888799a108b2175337f66e29377f68eaa0b860ffe9ce9c57e8c10486589d239b2b9766af31aae7f5107213b86',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1584171873817878499937',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpyhlllls32k0wq',
    auctionPosition: 206
  },
  {
    identity: 'infstonescom',
    locked: '4075386323664493707210',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqmlllllsencflu: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/infstonescom/logo.png',
    description:
      'Founded in 2018 with offices across three countries and two continents, InfStones is the worlds leading blockchain infrastructure provider.',
    name: 'InfStones',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1575386323664493707210',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqmlllllsencflu',
    auctionPosition: 207
  },
  {
    locked: '4060017426162681464365',
    distribution: {
      direct: 1
    },
    name: 'cb9e0943890de2b81305a5938766d7ca1d2698e57c0053a948bc8def188071c4d424c2b4c1c6ffdbb7b81800db4ae608d8903cffe89edc7747580a60cac4896adc49bebbdbb94ade5c26c2b67715f2937c91a4795cabf65d1303d77b91999b05',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1560017426162681464365',
    auctionPosition: 208
  },
  {
    identity: 'core-block',
    locked: '4059667348601338994490',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpf0llllsccsy0c: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/core-block/logo.png',
    description:
      'Our servers run on the best hardware in a secure, highly reliable data center. This allows us to provide some of the best staking returns among all MultiversX validators.',
    name: 'Core Block',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1559667348601338994490',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpf0llllsccsy0c',
    auctionPosition: 209
  },
  {
    identity: 'honestscales',
    locked: '4018704860438863517855',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqshllllstw5f20: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/honestscales/logo.png',
    description:
      'Honest Scales Staking is devoted to uphold integrity and quality in its operations. \r\n\r\nFounding Principle: Proverbs 16:11',
    name: 'HonestScales',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1518704860438863517855',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqshllllstw5f20',
    auctionPosition: 210
  },
  {
    identity: 'peacockvalidator',
    locked: '4000000000000000000000',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/peacockvalidator/logo.png',
    name: 'Peacock Validator',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1500000000000000000000',
    auctionPosition: 211
  },
  {
    identity: 'nosetraction',
    locked: '4000000000000000000000',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/nosetraction/logo.png',
    description:
      'Just a simple validator node maintaining order on the network.',
    name: '👃nose-TRACTION-baltic',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1500000000000000000000',
    auctionPosition: 212
  },
  {
    locked: '3850000000000000000000',
    distribution: {
      direct: 1
    },
    name: '60e385bddb7e27c5da15f37e161f02cf21040d6f2d2d09ebbe520fe1fac8ed33ae2e7fb8e7cc514b32e817e66c585207ac1136a92bd645b7f368b41df548d4363a727e2831ec6f9bc4e84516be5c8a36f52cb6bf155276963ddb6ff36edb9197',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1350000000000000000000',
    auctionPosition: 213
  },
  {
    identity: 'truststakingro',
    locked: '3826755112469169415818',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq6hllllsuh4kve: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/truststakingro/logo.png',
    description: 'Member of the parent company Trust Staking S.R.L',
    name: 'Trust Staking RO',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1326755112469169415818',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq6hllllsuh4kve',
    auctionPosition: 214
  },
  {
    identity: 'kevinlallement',
    locked: '3764558091207800143675',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdlllllszljs2d: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/kevinlallement/logo.png',
    name: 'Eda',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1264558091207800143675',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqdlllllszljs2d',
    auctionPosition: 215
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'fb30877b07abb03511b30e154501c8a73719a386c86a34a96608d186fab41869508d7e6ee4f23f1f32790876deff0c05868fd0d34ace22d502df8a352c0cfb56fd0a992aa73050ed2e1ff44f2b6f7861e97a6964ad3e33ab01261cf34772520f',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 216
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'f3fc4c0afcc51e38ac9cff2af32aced77a3fc1d3a3bd7c87c9ac176b89038f4e8777e0f35cec9ffec602ddede53f5d01d73691c166cfaf1bdf5a923511ac5cb071b6a5cf88d6a335b9e2830a249f9e1d180f7feec2d4d1d1e47925c54cdcf118',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 217
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'e4ed50e575c455439e5fa47f90376ff3c05225aea7c9afd87daa9afdacebfa040ce67278ad25365d1e5359334036d516b3c86a97465ac48bcbf74eea6b8ec38cf3513e7d80e318b66e6421c026d3472771103dc9faaf22b68da7945e0d954c88',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 218
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'defe389a875e70a9d6bcffb0f5dc49cf5a1bdaae1c4964089ba4b0682200b25698c3ffdabf122c2716e232db70865407022ff5c3cffb4ccd63cdaa71927c6c00cbadf68b9fd8f216567889203faa528bf72fb335bf8d9c939471959664fb4411',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 219
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'dcc253929fc8ffc1b80694c0cde688fe7dd8c3f4c7fac5b26d31a12bb755a1c90855cac83ce9b47deccc3cdcc243581224683fe8ea3cdd9a0a52f03e7dbadc2e92eafea962464c72f6251c037a272d2071943a5683404ae453760c788eade090',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 220
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'd144f0d2d972259ac53a41578281949fb1130d8e046ac37c9105c8f775778e0fb47fde51691c20d2da4767a650a1c8103bf81481df59d2691eb8baddee61dff0b7fae098a8ec2228e498dcfa40d4f7591d90c043a35a46e822ead3a8ea5c4e09',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 221
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'ce1149f5151915ab01500cd616aaa393f15a1d5065e2c672dfab41816d4e61bda31d24f92710ccbd4d4906676376f50bbf8543f7b0a36fc858381feb47100c3c0c5b70f789d0f6ae46cb2bc5b574c89374f3bc0732b2756178795c89b119f391',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 222
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'c16ab54965ba54383222505bdd8fedc9f81350c8c934d57cb116b7e7cef323a8f2e8dc27dc250b09c5858a07fe940e1705909af770bbec0925b95616a8626eb4e349eec9124262a0259c71ccff78d39117752f183ab8582d69a9cf924606ac13',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 223
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'adde4772d34cf1d2bb9fe231e96ca896133bcb86cd448be69d7aed6dc27e7fc93c0b627b5c629c1352ad18d75d4d1f13f666792d12aaf3ad7bbc69faa266e22c40f531576339c74ee71a352b80e971109a16e34236969a20560a5c05bd66ba03',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 224
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'aaf99c940798dc9517875e7600749d3ebf798e3d293f8e0107e99a87cea55f4e290764cc278334151c24854fee844b187245f9bc452ab075692dd60d01c4af095308b3d3a4919648a28997fe2bbb9100e735cb3fd0629ecfe46c965e2ff11b89',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 225
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '9df662626e7127e24a838596d514b37c588fab5d734b0b51f1d455263bccc826ab532488d28778a16fc1eb1f1978a70f727d997750fb1a0e390658f4f95828565339d4369ea8c2b67c6a09ec03df1dc764c8ac6e640d39a7a8384d7fa2335495',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 226
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '74d98825f6ddb030a22ae198c99db31af08a0c63291cc0ae1926d403d83298185198a583176d385e592837aad2da231337b29f11c6fee6f38863f38984a3f7b46abd7d828423f39a7435eb540fd7691e46d2949070248970a4d71f6d77ea2d06',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 227
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '74b1f99a2b5e8ea607ee2d5fd1e6b0f6d479088fda5e631f18a66dc073281fcbd59d2b10c6802b15913a464a48fbb119d210b802c543c139597e06ee34cb48ad56b157fcbf7724d2df3e4dbbc12e67c3f344e9c99172d926ad5e884b3fd88990',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 228
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '6cf91197bd5e5f22f13a35572c61495dc7108f277128f20ca7f808cd8b32372ac8d31617434ae6022a0984430f8ebf12b62dbc2c60e43bee2ecc4ec365f5b15981ee0166705ea2c05d280267d9a3c763a128ec2200fc01d2c4061720f3abfb86',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 229
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '61083905e33a89d874e560ecd385c9e72b102fe9be57e9b02dfc7efd0e3bcc94f60ce155bedb19346d4a8c676eb002175e5b68332f617de070b9bbb5b443e12e1cabe677f8c1e7be507cfb614a939df4577e21facdc5c5072c0425d9b384f491',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 230
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '60a4c59102fb88db899dac7ccb80e042b073b075350f378c22a33f5c1ed67f16872e7fb7d0039272d4ce07f4cd47570be69a6786af75ec46f7f8aa0d4ce6c35193e980950f048b0a7b1b2bba8d169d7e5ca96de5c15f423bc9c264f6ecae3a81',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 231
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '5ec9bc0c43a2d494d87db49a8c60d17fbff76ea6bd3775c41676c667ac7114a4e724adb863d6e072e4ab4e03a293f401100242d8fa6baa82e6d393a8e952c7318b122a5e163fc382eb7f7c10c2a469ff4881ee9543c495b37b70281374283f0b',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 232
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '53b662c9c432e66a25fe428857a454c1ed71a9597ba77ba85b17e98fffaef4a365e0738e61fbf3e7f21d7b9b3fcb3e088181a1796e517b93d2cd9713e6e5f219201bf34adbea3a1ee9dff72bd493c6b64ff4744e6cca143eff28484935d09c04',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 233
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '4f92183a0cd140554bce70d1ff16cec18a42fd96027a102eca055cb71bab7ccf73470c035e18c24c720c347706c8640fab65bac5791be62efc0dab58ef6b8f5dccfbb368ff96fe9e91a4bcea9644ede98485e9ecfc5e9bde3650c020c42c388a',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 234
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '4f1b366b61373a3e036967d403451ea4a5028a22ed67f7411170cd865ff9302d20a8bd1ef0d2e66a0d8b10150ab7e103d5da7bc255b8ff04f365e2eef31be48eeb2887aa41a1db2d2b9cbb494c615ec734c49963500a989e372ba4a58a4cf30e',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 235
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '47bed2aaac4ec28e7effaff714a881d27c472d85bfd8576f7065bace12285e20ad4124a164785932b2205671e88da503c61a795a426a38eb049d6562cd9fe18cc82a3fc76fc84ddf5d7f6a531da35aced7705b496bcb643ce4a180d440f39388',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 236
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '3c714227edf3b6556a55dd1d24930457fbd7966f6f1d12adc609805d9df017c5b6d46a84cde0c90ffbfb12b96391ad0d1b91f9fac05b45b4173b781b06fda7bfbebd2c29fbbb69b03ccd74373d3b523217b16a4a5a9d54b45aae7ddb6d383e82',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 237
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '2aae65536cdbed73f58c16361f3e0852e930edf21d79ce223c6bece4285b484921fefc9210c883c53f8fa9d2523ceb03c7d4b39ce4441a933c0d9961fcc9cbd32b169afc67c4e9a3062494abe6af0292dfaf13d2d95f83b3dde77be71db50b8a',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 238
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '24793d6fc657d08aed7f8f0de4d2b9a1fbedea26b9912dfa302b07fed16ed13d2d1d379ca9d5786853d6e18c4033de0adb796d07254491e935e08d4cbaea86ade977a55ff358ba18e097c54216950f7d4f66f942b02bc6a081bd5b3031b0378d',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 239
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '2205cebdc47cf711ca4ed49085771b9f96495e3775eca4bf5bc1ba4d8c222b9b4c8c220e7ba57ea7dc49584292db1b10d36c44c46f31b070ae72fdb445570778d94e00ad756d2863d07473cbeda9dfd22c950e207b18f11ccd1a1b9f41e34917',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 240
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '214b4827319a592a775f9e355d3a57d2f06e3406fa101672456c9b04549e660e596b48c08d239cf5782abda14fadee0fa7720036d72f132850c4dc920e96db5b1afef44a7ab7dad85590d705c165d9f42744af3490b7faab6906395e20922609',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 241
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '1f84fae3c9fee5a9f2c14ea652630272d6650113d290570da1c886457f3920b49bcbf0411b5858399b884227fa407a07d91afc5ef2c8087c8290bf391c3aea6fd58fd9063407e0eab939039a1c9c3c2222eb20c47a360880e5e9d1774c016b98',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 242
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '130675734a59d77e0088ac3a94dc70edc04e6362ceb3fad6b8905b7608b454ce56c9f797498c2310d5d590462c1b1e0bc1b4e843421fe138a9e2b45c8a91735db03f4b7cf5267f52e4113b925244d23000f65e0163e9257f99c588cfc818b684',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 243
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '0f6ea0fde8bf4e263475c4bd3c22a57c89bc7d0d4135d542ce6376fc345587f6706496e624731aac6dcf2823383f1e18b524b3a1b6edb10a7765e6fb9197b743781bc432e293ed43a6b26f82c729bc0b9468538cc82977cf2e5765cd31ee6f18',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 244
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '0f356c448c4e93cb9ec52b256fb3edfa47d0008bf4d520afa2f83d1a2e9a5501d8398679a1219980bf085a6cdde37b04f47c32677da08da6bba3fcc8355832777ef468a8dba01ea7d45e8df5f4bc5f371133dff12ae8afcdb5cd69c1b05f2317',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 245
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '083e6b774babcb0d8d4364dfc0588989445e3acf12996f06f6cc34b85d59b0d72803c27fc6226b9bf815fb0e9f1ac20d9450abc73ebc232717a52e0f95e41f51df89bcef6d7a7cf30fbe70037b002a15b37d2cfb6f1d0aaebcceb66612877d97',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 246
  },
  {
    locked: '3750000000000000000000',
    distribution: {
      direct: 1
    },
    name: '04f25dfa11ee43cd0f1979e2fa127720a968c133de7f610f6ecb5e5e40f2761217aa46721d1d0900189c79e7119e700a2a7255506a4f2aeab07f8da7fdbdec4a54d2b055c1cdf882c2477cd2983c7d6db6f000dd13400f942e3e4f8d9f399811',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1250000000000000000000',
    auctionPosition: 247
  },
  {
    locked: '3736058892248470909228',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpr8llllsy6crzp: 1
    },
    name: 'a69d63fd4326bfbd33c0e225f00995a67482e25a2d8afaab140c460eb6bf9f69593bbe3c29ee7b8f914355899755a119123f42a3c674e872370d7f6435ae106b459c973770814312114fd24bdda2a0b6c91cfdcd0e00614c5ffd7e7a3bfb9716',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1236058892248470909228',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpr8llllsy6crzp',
    auctionPosition: 248
  },
  {
    locked: '3736058892248470909228',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpr8llllsy6crzp: 1
    },
    name: '7cc35aa42283e713eb691e014ebb3caf64386b7d204e846a2cf39cc6bdaddf61ac3d91b71e1afc07b677dd6f28422a0b5c891f37c17ed386f87283a4d6a643e801a2b74e37e9b8c28f89153d03149579fb568b91ee0cf91d0fb6ca639a990c95',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1236058892248470909228',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpr8llllsy6crzp',
    auctionPosition: 249
  },
  {
    locked: '3736058892248470909228',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpr8llllsy6crzp: 1
    },
    name: '6a5fc1f124c20a39b473affff29c8375124b3d11d657666b31202852a7ef4faac71dce69fde075025fa67818e2ba331386bb80574d069ec6f18b9d6aafbd31ea6cc1c60240c51d7e3c3a3d93a774a9800e42663dcc43939fb2b70a874745a30f',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1236058892248470909228',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpr8llllsy6crzp',
    auctionPosition: 250
  },
  {
    locked: '3736058892248470909228',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpr8llllsy6crzp: 1
    },
    name: '3277de06afd9713fc7d03361e518354ad6c42e5a76d5d8f9b550fc52def44cb3dd6ffe02e536ea0a32ebd921c7bc020a12eb012821ad703167aa068febfc165f4715e2d86f9e82761f8fde1b8615f02659b717dd9493c1f2ba8e17e6704e5216',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1236058892248470909228',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpr8llllsy6crzp',
    auctionPosition: 251
  },
  {
    locked: '3736058892248470909228',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpr8llllsy6crzp: 1
    },
    name: '22ded36d735c57a5467007b4fe691930a8d147aecca51a6ceee2d105731c2e0984d0d8c49abfaff2934a6cf2a326d806627b7f95414c07ba0c2a755c7df41af40eea14aa09385a40b3cfa947d6e04632f9491ec7edce80fc0a7b262dca1f7689',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1236058892248470909228',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpr8llllsy6crzp',
    auctionPosition: 252
  },
  {
    locked: '3736058892248470909228',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpr8llllsy6crzp: 1
    },
    name: '08b9ae5f30cc0ed2eb0149318ca9c564ee3a8abcaa514c6ac8d7d77f688b7ea8782f256061cfc2877db521407f1b240bad5f31a2f9724715b76f5691038eb0407c2b650e87c0ce9f8dd23fc0268985d160e35b0b68e7c55b741b53cc25ee218e',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1236058892248470909228',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqpr8llllsy6crzp',
    auctionPosition: 253
  },
  {
    locked: '3684626832147567147793',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq6lllllshvuw8k: 1
    },
    name: '9143c1279e9cdbb5a85703850b8d74856c4b88ccc47b9525f03aa2516d569dfcb7249d172d27b342e6430b5b60a74f192d3bc50869379283283f8c8f4312dca5486ae2c38e7fccc22098899cd3485ef988e13080c2420454489622833628a385',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1184626832147567147793',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq6lllllshvuw8k',
    auctionPosition: 254
  },
  {
    locked: '3684626832147567147793',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq6lllllshvuw8k: 1
    },
    name: '4b59957d4a16f8b9493669dc71b5415027f4567443a0b3d350757831ba231b0d52b8cf708e004c13497ba956d7863117f600adea8080a7108e20475d935b3ac7c3e3bca5958211e300e2dbb22a1e730f476a5d5690589467eeba3b95dcfc530b',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1184626832147567147793',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq6lllllshvuw8k',
    auctionPosition: 255
  },
  {
    locked: '3684626832147567147793',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq6lllllshvuw8k: 1
    },
    name: '2b6edf9cad13d3e002f7a35d6f798382048552141de6fb920e2dc0d4625052bdc0143897574d8bf4892986903ce4b018d3c344e6db79d26f945876198c4fc1b8800cbc3e248b1ea7ff9310086465e6b80f0ba8fc307abdebf8fb7a2b0d49ee0d',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1184626832147567147793',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqq6lllllshvuw8k',
    auctionPosition: 256
  },
  {
    locked: '3429294830510823986976',
    distribution: {
      direct: 1
    },
    name: 'db6f284d32de0d5a7110768a4767636cbc3b2586347c5a6d1407bf5dd464751d3ed2cca10ec885006df01c13cfdc511435f50b37e3d8e3d9677d16437895b2bde10ab6ad41bea8390cef87c0b0f9be390c9be38d5310862608ebb0c6dab9288b',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '929294830510823986976',
    auctionPosition: 257
  },
  {
    locked: '3362000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'f3dd779c5185e521f4e74693f23ae7b55c17b20540e12c73654e3f6a6f22d521a3014cb76961758280eb9f6966f5d91327b3575f00484ed3025e7f4d148fc020b485da4afb32e995a63f862abf3aea532e4bab73304a12772d0ff39cc5f09789',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '862000000000000000000',
    auctionPosition: 258
  },
  {
    locked: '3300000000000000000000',
    distribution: {
      direct: 1
    },
    name: '1f06f8d46bfd75ec9af5487ec752a50cf4edd92b830aac3f846c7b5d064239eb2697af21dec799898e2c777ab9080c088ffa6b017a474b0d2340c2034925c2267d999b8fcba4d19b1342f619a3f8e9ec87ddf71e070672d01a3441d90ee1260a',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '800000000000000000000',
    auctionPosition: 259
  },
  {
    locked: '3266952901867535760900',
    distribution: {
      direct: 1
    },
    name: 'fbbb4bee81b909e7a0f2697240491d5ed3f103090174489ee94ce14a42efeb7f9b596524209e567816740396c66f4319f382ef56393970602682518fdd03591ee939c79eecd262d07319489bfda0c452305fc69da290cb9a71ea015b240cb593',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '766952901867535760900',
    auctionPosition: 260
  },
  {
    locked: '3266952901867535760900',
    distribution: {
      direct: 1
    },
    name: 'f00aa83b3dd403630efc56abf2d4201c214914bf048cb11ec01512edffcd11eaa92f9bc2d62c0f319d8c1801ac4a640caad405f32c39f72d62c1660216fd2a5c8470af13207a12bb00eb09872d5da41024113b29ef8cf946985d93ae7d939208',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '766952901867535760900',
    auctionPosition: 261
  },
  {
    locked: '3266952901867535760900',
    distribution: {
      direct: 1
    },
    name: 'ce82f114d0b53da5080d544b0a80c4d91ee7b534f1ecc679697df221061a7da6c1000c824efe60c45e0b8343d3e8bd0cde4c93cab311179a8e7a149056d5e990b3842a8d4bebb722d44e20b42b321e58675d971d8e291433711429911773c089',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '766952901867535760900',
    auctionPosition: 262
  },
  {
    locked: '3266952901867535760900',
    distribution: {
      direct: 1
    },
    name: 'cab02a5e7440ba9fb7240cfbf0719cabea9233aeac142af264accc0bea743f47dcb6e6ed931f3245dfb7a730e84b820cebf78db8a5543d5ec5b0d7a7b92e6918077651eba2324709bf2e2be3bb13c4cfa6b62acd4f766ec37087b2800cdcf812',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '766952901867535760900',
    auctionPosition: 263
  },
  {
    locked: '3266952901867535760900',
    distribution: {
      direct: 1
    },
    name: '35b568fda58fe688aaf1a107490612bed1397a33d8637210e1ae30e2447430b140501d2a2f7640386fa159ad8e1eb20de137d8ae546320de54171b48483b965803addc600119f15cf65e9afa2a50c986200f6333b9fbab70de6570361b9b5201',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '766952901867535760900',
    auctionPosition: 264
  },
  {
    locked: '3266952901867535760900',
    distribution: {
      direct: 1
    },
    name: '1baf76378672e00353b3ac387578f4f38df8151a83ca3f871586c8cd43f75be1f203a4363c839324b17a7911f2860515e7d312b807e34918b8a1f2717ca6e746274213b12cf122f3776b52f549b6cbbd1dfd27bab6ff369b6acea7c41ea4fb09',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '766952901867535760900',
    auctionPosition: 265
  },
  {
    locked: '3095000000000000000000',
    distribution: {
      direct: 1
    },
    name: '84248789ff790c5341041438835622bd02bd2ff1ffe52e149aeff905e325e44d12203a782c2f27fcc295132a4569f016a48092bd91466c216d8161cc1c6d4c28416c008dae25ea974d9b3172403aedc529de5c2b45c49540d7e7d1b8bfc6c287',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '595000000000000000000',
    auctionPosition: 266
  },
  {
    locked: '3095000000000000000000',
    distribution: {
      direct: 1
    },
    name: '49c83cd41fbb768bb92341251a7b80f1477b0e235d607501faed604d95cc316f29d7061c9d07a8a8e47975df834da40cc5eea1dede520b760e4ccf8c845d3c0dacc4d07b803451b0845a7d4484cea328cf23dca80bf3065b68fc2c2ab666ce13',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '595000000000000000000',
    auctionPosition: 267
  },
  {
    locked: '3095000000000000000000',
    distribution: {
      direct: 1
    },
    name: '0cd4cf1e145c63c7f15e0d0988e27e7bff386c4f600dcc16864de153bc71f47ad857b2e067f6a64ed0e51e4b03214b12a785bc3da8ce32962188291ce90ad11fdf2ae2212fb9e56c3b037b91711f531ccbba98eb328486d926bbf10584b69390',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '595000000000000000000',
    auctionPosition: 268
  },
  {
    locked: '3010000000000000000000',
    distribution: {
      direct: 1
    },
    name: '39759ce6bce709c787d5b072593c4ba6109b6ff5e58863d9cf1f65154cf80590d2adcc9f0a8f47515be07fb80722650f1cd5055cd4b8cef5dfe4eb8d0c7ea6ad12ee045fe6a5e0faf2fc8ec21c55119daacdce4236e3af2df76f4e650b28c897',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '510000000000000000000',
    auctionPosition: 269
  },
  {
    locked: '3010000000000000000000',
    distribution: {
      direct: 1
    },
    name: '1ae5a28c387254e66065457f4c4099d1c4dad0152c25ae099c4946cfe9fa49f59eae03f1f5ff2d897ae07a9747808b009a813585898811945a2d9f72b65f3a0838dd06c55bf074efdd775f7924f7ee8a0e6ab51272d696a054e42c9d1b81e802',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '510000000000000000000',
    auctionPosition: 270
  },
  {
    locked: '3000000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'db23d2d4937f09a213d283090b1d238f572e1e76ba310b3af1f9c435160530e30827cfda1a0a804dcea44a1f5ca8b1027e465c20a8322b920c0bbaa8610a89e74f655ef77c5bc157ae7b296c89fd1d629bf7205156dabe2dd837f535e9eea186',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '500000000000000000000',
    auctionPosition: 271
  },
  {
    locked: '3000000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'ae0cd598e47fa839bf25c591d363afd145a1da730e40ce6489eac50073e440255a98f6071852089047a45c87e4074603b244af984542f95a07b66899e88379a4957fa4823f51e1d8357ee447258fcf911169788c2f64772b037e52ad78e06c8f',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '500000000000000000000',
    auctionPosition: 272
  },
  {
    locked: '3000000000000000000000',
    distribution: {
      direct: 1
    },
    name: '89f5f9f2136551140d8eabdfc55ee5042b1825ea4a9f9e6c03515f604194b41d1ccfb99e4be73c6fc4db892ec6c1e001940233c9ca49416950d697cd2ed609a069d48be41f209906c4fec95a84229a8fc81dc8d6639adef19472bfa90bdf3811',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '500000000000000000000',
    auctionPosition: 273
  },
  {
    locked: '3000000000000000000000',
    distribution: {
      direct: 1
    },
    name: '353941c7eb1f014e92644355e052a31d32b6c3b1d648b8975d6faea134c85603ec3f3885adb4281e890094433ccdc20153fde219c404bbcea695281a5fc85f4322744fdc2237f1fe0cf89685e1a8f8024597e4f66e20762d6e435d1d017c1a13',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '500000000000000000000',
    auctionPosition: 274
  },
  {
    locked: '3000000000000000000000',
    distribution: {
      direct: 1
    },
    name: '09c680d3646cbc2b41519b054b62f5bdc63df3065a55bc26944c7418a0ab35984da63a9c64f4a563cdf7da2ebff6a308893d43792010f27016637f648b7bde0a8c5fcfe75a1764c71abc6c881539084c21e2008b6e3aacd2bb20e94d0cb92486',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '500000000000000000000',
    auctionPosition: 275
  },
  {
    locked: '2775796292808620247487',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz0llllsup4dew: 1
    },
    name: 'f6d0d35d0bef9fef25516d2651c686d89dc8c4c5f856bd6f42d926895ee566e2ee81aced3eb594257fb2156706725a0f2fb4ed61dfc6b813d3f6b7bf19666dc91dfc7e702f62109518b05285bd608f8fa3347668822648c83778d9f431557294',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '275796292808620247487',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz0llllsup4dew',
    auctionPosition: 276
  },
  {
    locked: '2775796292808620247487',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz0llllsup4dew: 1
    },
    name: 'aaab1a0681850adfeeaef9c582e5460fb28b93755623dcf459064d03ba7c6e43e0fc94c2c41fa683898dac4473df1e057e3abcfd2e8e6294effd475dfae3121a3fd45bb0140f3ca150d5e42ca801ef833d2baac89e51db8e680c5c7c6d1f6e15',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '275796292808620247487',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz0llllsup4dew',
    auctionPosition: 277
  },
  {
    locked: '2775796292808620247487',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz0llllsup4dew: 1
    },
    name: '82c8e3cc5d93748fb0df8c46590576a5312bd7d1e71ae20f1d4209f162a714a26902232beca816244e50e3911f24e81868b76fd1312778a81c67c8d694a56ddedb4034d1e76f6d39ac1988e19afb24b366a2ead19486bb9be2c34a0cd7e3cf08',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '275796292808620247487',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz0llllsup4dew',
    auctionPosition: 278
  },
  {
    locked: '2775796292808620247487',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz0llllsup4dew: 1
    },
    name: '5b42ff1b9f3d77d37fb7eb0449f8c846a35edb5ca9d019758618ebfc1895fb3b41d225950afdedd1956606e64c084315a81d2a4c8356905f60dd50f7337459ea8a0df8132af02e50bd5d964361e1a1dfdcee553e4a5ccd1faf46f8644faf8897',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '275796292808620247487',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz0llllsup4dew',
    auctionPosition: 279
  },
  {
    locked: '2775796292808620247487',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz0llllsup4dew: 1
    },
    name: '52edac3f2ffd93cff504e742b4e14486b2c1c257015b860b1b602b1f67ed362ffeaa1cd7a8cb8fc201128168acd9640aa22113fc796d5ad2b34def42f8b596257af719dbe868ad2a9f4a1eb0ef38f1e45d1d43cdfcd1e62e05031a06d5df0717',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '275796292808620247487',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz0llllsup4dew',
    auctionPosition: 280
  },
  {
    locked: '2775796292808620247487',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz0llllsup4dew: 1
    },
    name: '16b5d23c3cbcd4196ba05db78ce38332180edc6e15b0ce43a35883387dccde45a264d7c16b55e1a6883ce160a5723c05715e5af24f68929779cd7d01511b5041ad3c99c4d7e3d170ee8043c30b58ca505d31b4b048af2f0e7a3f60ec78cb5613',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '275796292808620247487',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqz0llllsup4dew',
    auctionPosition: 281
  },
  {
    locked: '2762567203979601124377',
    distribution: {
      direct: 1
    },
    name: '65dfbfd5b59f9b31d23dd47f87f73d69f3e62e0ba2f9739fb333c224981229ffc4f2954dc46334f9d5df3cfae8ebef0d1bba619fe74f01a4dd1bcb72743274b74b44a760d14f625a7e19b9840e9ff1fb2051756dc1c360045cd37daa170a4e18',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '262567203979601124377',
    auctionPosition: 282
  },
  {
    locked: '2713300595383918131830',
    distribution: {
      direct: 1
    },
    name: '810424ddb9e5a062a6eb48bbb7f69a65989f638f72a97fe3c839a21caa2337665193b26246d320ae970b24ab9698dd113204c20cc4967357ce8bcde630e82938d06d9495a649b3c244709766b40ee83c2a1b0e1247029cd505443fe4c7581317',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '213300595383918131830',
    auctionPosition: 283
  },
  {
    identity: 'pxr-staking',
    locked: '2699998610155876197378',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqk8llllssp7z7y: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/pxr-staking/logo.png',
    description: 'eldarion-telcontar',
    name: 'PXR Staking',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '199998610155876197378',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqk8llllssp7z7y',
    auctionPosition: 284
  },
  {
    locked: '2677667371300138258843',
    distribution: {
      direct: 1
    },
    name: 'e8c05896d2a615d9e5ea286f9af2f1570338cadafb18587b1db496b2ba74e3d2c645d58d58f4224d8ae835afa6cfbd180af70d9a126ae4a89c9e5c4c20b0d72b27b1554eecf4d381b81936965976558deb30930c75e0db0c9184a95aa9a73a80',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '177667371300138258843',
    auctionPosition: 285
  },
  {
    identity: 'gldtree',
    locked: '2625000000000000000000',
    distribution: {
      erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr0llllsj732py: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/gldtree/logo.png',
    name: '120c9da599c407acbd255366982ac268442405f43fdef53eb47f6767e4c69d253c77ad55b1aa53c46ffd8058d59a411424c370c505b3fc4fc5914fdb8837e3731f60d1f6c62225f89f27d11e61a7ca9f664eb9ddfb9cdb391d5653f59b8bb40f',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '125000000000000000000',
    owner: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr0llllsj732py',
    auctionPosition: 286
  },
  {
    locked: '2525000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'e40d66e5743e0fa87ea45d5bc382d46b90d06a10ba1ba0dd784e559a77c1122166ef6b564e607b9f3ee270e98e5962056cc2cf8f9c69a424cfd76a2a71df6420469d115e48140d2291023c36c61cc04322757e3fa41ab61ceb1565b41bf55e16',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '25000000000000000000',
    auctionPosition: 287
  },
  {
    locked: '2525000000000000000000',
    distribution: {
      direct: 1
    },
    name: '029406e3c9f3b5cc6edbef6f724137ae9c95bbbfbe39da9a27ef5e50cd57a32d145e8e2f225d737f51dcd4d82d60ea0d42ff2306a60d6e09feadb790e874fcaa678d63fd27bdce33ae0042307499bc28706de6b0da218d16e7250e38957bd702',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '25000000000000000000',
    auctionPosition: 288
  },
  {
    locked: '2501000000000000000000',
    distribution: {
      direct: 1
    },
    name: '4b75063f80025ab62c5de408cb55fa006a2ce7fec774a7f19d30f0f2b37290cc906484f64d7f1f04fb456e1be7f3bc15f2a6c3379ccb4da0f911510354fd3931ac99933803cf5a2a03dbad73fbe6410f99cee674e9d1579519aa2b5a8ac5dd14',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1000000000000000000',
    auctionPosition: 289
  },
  {
    locked: '2501000000000000000000',
    distribution: {
      direct: 1
    },
    name: '3c04830eb46ff2d33fc2fca00cd403b182fb2a3444a7cf6042ea267a0c4db8d03f0aa1f8d9d06e23576718ee9ed7b3178f32e7c09b010d837be19e37c278a0fdc6c1318bde51bc29ce13fb7440ff7f8a7b96a2fafae697ea0eb0ac739f0a6003',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1000000000000000000',
    auctionPosition: 290
  },
  {
    identity: 'ravenx29',
    locked: '2501000000000000000000',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/ravenx29/logo.png',
    description: 'Stewie',
    name: 'Ravenx29',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '1000000000000000000',
    auctionPosition: 291
  },
  {
    locked: '2500894625000000000000',
    distribution: {
      direct: 1
    },
    name: 'bdf7f29695373b34337676edfbf429b75eaf9d1f33dcefd555fb6b61624739e2ef67c65367bc434a7824d5d20be80f026481e9db7c0bf4ab1fef7d21190162335d2ab204e16db1a3f9d29c8db3d926e4855ff7964806b8367dc5f2e80b2cd70a',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '894625000000000000',
    auctionPosition: 292
  },
  {
    locked: '2500556989370030832585',
    distribution: {
      direct: 1
    },
    name: 'e825d8681da1ab98a8c94b39e49e67578947027ee12091c5aa9e0caac064544c26c07668b44d17fbf4e5dd20e4cc3b0b371fe7ea3d28580492cb52148e1b07c1b70dc5e3c9a635555c6701b863619f108c4a59e239c9372f36100fe90b27ca0d',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '556989370030832585',
    auctionPosition: 293
  },
  {
    locked: '2500189707325520668496',
    distribution: {
      direct: 1
    },
    name: '98453ff3e7ed4a404247d668d03db2f2ec3644436da0529bfe64106cc6f38a0e8df6c58c942984b78b54197621ed7a0b3c761b04f01794fe588fad8e84a4b895232ab8d88ddc1488621185c1f430e69f71a211ac6c9c9566c24b4df75efec30f',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '189707325520668496',
    auctionPosition: 294
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'ef3aaaa29f56799cae093d5b2694b12d91cad4e254dbbaa7ed780b91d7f442836a4d37e5d1f3a5e827a35e5fc2be51170213947d526a636bf4add24a5520a763b3c8ec2af95cd17c37099b52a7ca213f50077e832afa9753055ca33fd81c1900',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 295
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'ed7f5aeae4e887bf3b16a5afda0bbd641722840cd7e56758e3376f9f232e5c8a2e49602a3039e67af5eb0ef15026221317d05daa1a88f8b0683f95d531a6d418888f94215effe2535e014bcafdc6f13a71cc8ea13bb4dadbfc6e347fc4d1ce80',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 296
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'e69185db1d32dadc9edc52885c6a57554fe87da8c457afedb7c22a6285a4b0b6455b9b43d630a68aa7f60e1e13f80404f8e7b2d04d69e95d17effabe3815afffe807c9604cc57317610ce402ffa363762a14e93b3c8d739f575f47430b0b1299',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 297
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'e45ce92cf689ad488f1bce36a76d467042159810d34bd7dd03ee3165f88e63a368f8ed1fba2a67649ecd5c29f0aae90a693f19b6817ac6d55fc7c16a34ef91473919b9f54e75070238c8892f30b75d16e1900acfba54a985eaa47e79e13c170b',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 298
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'e3e36428d6c2ba8954de1f940bf9906a09d4024a28fb8a307661ac59a8a052c79e8ab554c447968cb83b17536654d406b2c2c27e18d4e6bab3d084da05fdcf8d7dcd6ea179bcc97a9cdac9055d0159beffe0bf62bd404c1c09797ba161a56519',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 299
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'e235f783a9b93018c177a68c62ade4591329d27f8a998ade181109c57c8fc0a616d1b53070c01e35cdabf2878a6d2d16c3dca735b79af65fac902e002f41343033cb9f3da9520a3aace0d8eb0c94ec70b153a92a8d15338d3c7e2961ac685a85',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 300
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'd5f4e75c52d6a579e0274edbb134a807e7a22db4e87971ad5bb48eb27164c59250eb15b1a43ce50957cc1b3c1e9d530c55b8001ce741033bb44a42bd6014126125f247719daac512a303d9895db2dc7fb4f79b65e948a4b09491ac4c689bcf8b',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 301
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'd4d7cc51191ba8f7cd856862a646532279c2abf5472a04563e13c1f41ffeb2ee93eeefb29ba559d7f78a33419e019a13dbda0cbb84ba43bdfb04aa43b5e2b987f5c7aa9626fc347265aedadd1166a4787efdfea5388346a881ca303a9c1d0e93',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 302
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'd208d25eb8562276cf9f2a89d04daf42b33dac79c81cb42f55469ff67c126bc3177fa97937599c05109cbd75eb86f715ef0ea046767cab7e3f7fd96fef5968b6d701267296ac749c1e76b4949ac7b2fc9d40eaf3cd91f932d9e0cfbc13197397',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 303
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'cf747cfd525b21f15f01700b1b06a7ac4c7bfe8cc6d2a7358681e25b0163392f7cee60e8a4685ce6bdf482199ee90b17f9dd9b3b328d4081bd5b58f1d755b5d5798f2d3b06a9d47edbe44f3a37c4d3b2565378a453b831632ea9ef78b8539e8f',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 304
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'ccea9c6d5bb3833dcb90358d9585d1dddb113523d049ec93762774e620c38dabbf1868fb7b61712c3e573d788203270e0efffc97f33af38e7f46b216d04694b13c49e91f33c1bfda000634fde3557c65390065f0d5a8a211020dfa36f5c72f90',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 305
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'c5e531c141120b237f29911a03166ff500e858511e4a579f8a92bdd9ced113db0149f351f633696c5fe53e1a5ffae50309e860037dd1631b1b211691e4efe02ee1c89bbea869ce72a3b1a7b883da1655620abc6e7c6212b28b965a74e817798b',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 306
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'c2ad528a5b4860615b1a624ee17be3e53c0967774ec2c25795d7b7e1dd2d08414fd055f38f09f6f919e6f1f65c6e280f3553db21fa6d686c1bdf6d38a320a10189d292a63223550fcd9b8d25c532fc7bab594a281a0758b0f48be1aef0ef5f01',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 307
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'c17a9d2d24352864b40fcf1df4b2627a4da41ad9d4b49225e083ff09f304505545bdedc5eca232a3dc6964b71a2a7407dba8e7397813ae84780d3cc6897cbdf58dc4726054ffb7dddcab2ead5118e7e9453f4198c9d8c3b3447c4b8ed61e3f16',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 308
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'c0e3f99217f1fea1e69c687612c603184db9e9e0ca0d31075e8c5a9b36ecdfe5052a6fcc03f7ac01999f6d56f91d6213e1e9838441d45db5928133d65a22fd04b383963db26473d56ea5e7ca428f6bab96196c9e5b9d4c187f1b225e7ac7970c',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 309
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'b39c0558a636bee4f767c8b6687949b52e48cbf86a8f3c84ad95beeef43e47154cf0529b4052c11fae1fc841f61d9216b4447707d4472331d073c9600e97b218e6f7f4cfecb03346fd8ea745e41057be2c5f611df8238c2bf42f4ee3aeb99991',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 310
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'afd10a0d870a3816be4e286767a678ebc752e1a043f1fca1b178f891f3157be3557d9dba3cba4c7b0fc2ff9ff3db410345105f7fd1cc8605438dc4f2f6b3956a6da942b7c293c8fcbb303640c5b8c5d9eebe369e8710a01f7a929ccf27324395',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 311
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'acd8c2bb901300bbb8127e9d1e69af91293e00792c2b722544357027af1085a725fcdb6f321ba6b64630055a25ff6400f21b216df7dde2997ab2020c38831de5c1cdec8540864416997c7a2076da216002adc9cf21df1b13ae2d28b403dd3688',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 312
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: 'a5bb8b1bcaef498cd6388f1ce2161e2b10da8db89d84b58f256600d0832df8f7262717b287746c98dfe8db205ea11212938f39a7e74367dfa01f74f7ccbe1c40256d9c11dd900bdebc2d651fd7e87da51fb00d8ea2ed5a7e2d6e2efc6096b60e',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 313
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '9f7b8b2015e148160c5709d95f35327e9dcbc9352005d0c44e051fca7afccde2b1cca672aec4fdad454085156fa62903200bc01ea0133f183d350bf265a2c74657005cb686633b66cb477b6fc8423aa773d5469e632f4ead84b1f0222d7cfa80',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 314
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '9eba8ef61be9f1ac483f568eac25328c23bbce67f352d975fed610d692a2a8af4824b08c86a5d156161e23e43da9ad02449c7bd8ddafb423762d28620c9a71782ca7f5547e68363e8e4b4cfe5c0f3c867fa20971a7edcef02dbffd35a71e2a07',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 315
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '9db7395257a7d89c1e071ca0e51a0bb0893a9e9a1a52bf0a3dff09c7594ff0d7cf0bacd0dedf9a5755aa6246cdd8cf14e95ef0c890b2bb95d643916560b6f9a222830bf70cef235f1c46d8327c7843606f7f0d6806953b5496dd527e3e52dc10',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 316
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '9c840d4dcae034d01de74705d9b1cc67c5beef61967c018c6c05f9a553dcd7b41d98bedd3302368f259db73e20ff1f023e0b201777c73c57e93fda7d9758add780aa502f5dc92e3556fc9ac4b275ac5a811eefb534c9b24bc86fc96a8389a694',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 317
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '96036cd0a496e625f434e3703f03e0c0fde8d3ac98281aeb691171bfb277a8b18e2a65a5688017e1cc1c64056a383a1230071d4ed8f96294561abcec73330c7bc23b06280bcdce41baf803fd7658ad66ecd835c5c675e06248486a10cb347099',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 318
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '8b1ad2a5ad24d86e1b7dbb2bfbf360054600c7b12e53ef3e878b3f336964094ae215cd0ef6be64dfc97a3d055ce5c508a95c7bbea18665c77eae36c191c6ec761a6895b07aabbea3702926cc370ab34703293e4df29524698dd0fb9ae25d7799',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 319
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '7ce30cc2e493b32a86a75dab24760dc0a1c0d354555e95add4f4622004ac2db5f8e3b2a26243e1a4c4bfa0f238d5f813204f28c1e9366bf198cac512450ad43831933c9141e2638a55f24d5b613c75539148bbce13cf0ac0712b2cb78a764187',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 320
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '7abdcbaa362c303ce5d3c2d94283efaac92f8134de527e48319b25b3c8fd1aa3b6ad346e13917d3fa407ce91240db2146e9d1c1b8220928d8061e32cd8f555d8abbf0c619048321c5a2758d10946fe392761e251a4e771a3f83352309aa1c693',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 321
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '79a587d43669912d7133ebdc0990062280b5bf4a6090ff5f441ca2dceddc0024d3b274482724eb1ca03e73d0c3b1e0185f393a9e7405bf4242b1cbd0a71921520f4b762e56040bb527717d4464ffece32759f6b224ea1e7e6ba85147bbc7980f',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 322
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '79a008806e398bf56ac129bd5525e9773bb5d63815d74c96929bfc78061d3b7745f58281330767f162aa1abce733630858a0e877e9d11eb9f27c68aae9b0df9932c6a50f0b46f753232a82b5071dc377cfa6b9b3a4961f8c90c6b9906cb33f85',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 323
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '752f4d283f887a8755660761148c6a8484028ca25ef29debd3a3d949a2af43cebf8cb12befe2dbad7c3f4af8ac5bf71955e49207a334b1e589e089d204741606fc989d0f729294e081544ee544c5c1467b172c2f1bd2fe56c5a29f20371be80f',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 324
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '7003796117f8048dd3b7dea91c7ca2c3b970b1ecdcf868b4ff4de379d29186b10abd34a71f54a82270bbdaaf00489411712893979ec636f88bf9c4ffaae5cb74a2a046dc98530c4c8dd30e0868d3b3a2b873040c5cf566397fd2ae7063a55586',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 325
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '6edbee610aa8e6700686ccac596da90384457cb0cb1eb39feb7b3df9dad539fd42ea38983fb7cdc2f3a29c5f3b79240cc738af9313d8eba3c1eb06c0aabaf52133597163a1ba23a26caae559094942e7364d6e265d62a34214456d1fd45fab91',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 326
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '6c3bfe88f3710a356bb89f14a6001c929d4a57525834320181b8b8d591ecd7816495c214aee29f3f67a4c821204ead043fc35c67dcaf1e33f5862bcf1fcddf185038e43424db0a2ed1f18011b3479edd8ea6024c957cd4fcd6540d1304c66983',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 327
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '683b101d55145e1338b0c9b7470005445d7d289dfb2531e22ea4f00debb4daf14dcd57b2a53368b3c5dcf86ca2030011b9062a77066c9a5efa03c9fcd28f260b9bc37ae67bacd4b387ab4277d8e9224ba8d89e47d68f98670f304c73ad220783',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 328
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '658c3352b88eaaafb56e2ca684e943ccbc0df332a7a72564fbccd1caf8869aab3a0b1d2869c1809ec94d399e3a30f106e552d29bd11032ccaa64e2147a254eb2991ed21267c1e1c7eaf0e2c407a34f729fa6a2b5f0c64bdadff547be95043d13',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 1,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 329
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '63c265317fbc3375ef548d102d30d161e576e58b08270e6a54026c6f75a87910512e33969d3488cb5c2794f423386c0cccf123ec760d34334d3bce64b1098d1a6bbc11c5c3bbb9bf08696b26f509ab4e5507257c9e7e1131b0cd8ab21d0a4005',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 1,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 330
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '5d73ac08fbe5b487d637a683cb675270f39447b5c2dcf3fb74084136dd9bc2dbf66c5db7f71c8a1db9f4736197ad04128db62e484fb0be14c831c8da13ada81f576c2102dae4164b1e602ab885c33eaaaa21602f759cc2f1b91969051bb4b182',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 1,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 331
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '5d66cdfa8fd05a8ba23820a2775bdf80fb964cb8be3c3fa7c4fa00a65e833d8f015a82efb63690cef5c7e50d6f936400fbf23657d043cc25f1c23ee7214b9c91a2f3dfde2e5ef79be7e243a6a623ddc861b4f068ccec701568f1a65d82f8d786',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 1,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 332
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '5b44bfe467e58f467e23b3252f020c8bdb1000c6dcc43e4d32507d6341e20b42cfbd6539297d4552cc135b4260f98d01d0311c11a9d87abad90ea52a4a47f49aeef8fbdd0b954e1f2c80556880ab285123913d26802bad6b038c01a22b3f5d86',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 1,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 333
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '5a5de583931b9c72a7180058ca997938307d73f2b6a9992d7800b541541ce54b12c40dc5e9d2fe72c25233f3438a710ba39be5b8b680936dfff3fc29d3602f8a9d02e783617b2b3e0e20ab83e536b6615d0145e84b9856853c9a371615963d18',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 1,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 334
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '5827061f758d6dbc250de8af78f6f41cb051fda5aba638725df05960513326e899c19ac672d9e7ca673ebd964f7604104da53914be490e98601d8c0f31f9074f7ef29ed04e7b5547dc1bc5661a3e8c6016792bad646e3629c509fdc5c9ce9b01',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 1,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 335
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '54055d652e5510a6b2fa6c864ceb0f3b16d30b96a4c032ed9040fd343049676062ca5d2947c16c320c90e3a0f12123137d80620779c0fee9bda1d4b5e1b2d2264861e26b0c4cf4c122fa8ff30339fd5869061774b83e78d26db13a06a41ced95',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 1,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 336
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '5006d66bec6b4512b898263db44ed257c405fd519b0e2b8eb4cc9865648443970c09f8aa9b7680c517e19b6b96270308e3a4f4fd273b2eaf7df4e716fa82979036e0a6506c064c4015e8502c0b9d765f7c12618af7d79a6c3a61deae78581095',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 1,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 337
  },
  {
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '4964d0a4c0e13c3166425586d4e3e510c037cc77df3ca9b749ffa2ee0cae0970f718d3204f7030e3363a489b1be75710edaa14c2d1abc603fe01535db2b0eeb450115a64a85761f894e0412cf00f52f1768a341d21c30701717f0b8c35708f12',
    auctionValidators: 1,
    qualifiedAuctionValidators: 1,
    dangerZoneValidators: 1,
    droppedValidators: 0,
    stake: '2500000000000000000000',
    qualifiedStake: '2500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 338
  },

  // NOT QUALIFIED
  {
    locked: '1500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '43ed069d9ec924a0e52482f083e333eceffef308a379cf71a02c24b7decc2071d3c1bb065f85480af8295b3da33784093a35e77456c5d57c02dea57be142d35dc12a5d42560402510510aab2ad69b5e49bcbc72fadf8b328ad4f19131361560a',
    auctionValidators: 1,
    qualifiedAuctionValidators: 0,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '1500000000000000000000',
    qualifiedStake: '1500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 339
  },
  {
    locked: '1500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '43e345514b740aba7ad6a8ee2a6128dd1696ac549226815292c788f0a924fbcdb126bf792ddf1ce5ad509b910cf9d610487842c5d4e6a8beba47b5b9a939ab4ac83a42c12ff22fa9d67ff523bfcaaa2a88ba84bd7201d791df05f7ce77614c89',
    auctionValidators: 1,
    qualifiedAuctionValidators: 0,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '1500000000000000000000',
    qualifiedStake: '1500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 340
  },
  {
    locked: '1500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '3a3cd593f6862b13c9e22e710191b7f3065f4e2dad6115d609f9c5c001ea0b0b6131a4539e0daee86237db7ca4c0971260ee9abcff8c4ff5bed3d384a34a4e04f0d58337920172fb21928ed72ad2524a0e941c589ed0c694610a69c2b80c7480',
    auctionValidators: 1,
    qualifiedAuctionValidators: 0,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '1500000000000000000000',
    qualifiedStake: '1500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 341
  },
  {
    locked: '1500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '369b593a23d9d82aef3b661ee6c551efef9a638b2ec41aa8dc40b8370ad93663bf30d0bb176bf97e974f997dd3289a177e2b7dfb185b50a4015033564a9508b24f32db3cc6f821d8102e2ef7860c90395433305ae14214fa57cfd752116f1f87',
    auctionValidators: 1,
    qualifiedAuctionValidators: 0,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '1500000000000000000000',
    qualifiedStake: '1500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 342
  },
  {
    locked: '1500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '333051e2a77899ed76c8070b21ffc48296032e4049e1c68cc2443599841d4fc1967bc64897803e41df53759c82905002558c2f20a7cca4884965bb7ee81b0f5f0b02297770fa94cdf2c640945d8e9d05a3effa37129b8c70b65ab503a04ec300',
    auctionValidators: 1,
    qualifiedAuctionValidators: 0,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '1500000000000000000000',
    qualifiedStake: '1500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 343
  },
  {
    locked: '1500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '2f36fbf2f0b776be372618ee551c9cb6638c08258ec644bd2dea013000a2eb97deff23df7026bd475ae6024caa6581146dce30f52274e5d6fe4c527ac220fe20da26f1534091fe1759d735cd9fc7ff50faadc53f19a582739470832a37237397',
    auctionValidators: 1,
    qualifiedAuctionValidators: 0,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '1500000000000000000000',
    qualifiedStake: '1500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 344
  },
  {
    locked: '1500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '2a539ca3a87150ff116a6dca6724191945a829e1b5ca946d8234f42b39fd1539aad09b3dd03711b0c6554ff0176f5712af7654f041f5f31895a625833ed577034305efae497a6468517763c73dc92cb96fa04677de0302ce676539d282d4160c',
    auctionValidators: 1,
    qualifiedAuctionValidators: 0,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '1500000000000000000000',
    qualifiedStake: '1500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 345
  },
  {
    locked: '1500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '28e49678d3fc9b491fbbf2ce135665a6645168d4776c6e5f70f928edc73c73c761a7adf3c450117642ab35f3c6e3b50fc567703acafd3d42a990a00aeceacd5852292fa4b6a8e0cb36b7143bcda7d3c75bf0f9e9f766ca4952ec294c6a158311',
    auctionValidators: 1,
    qualifiedAuctionValidators: 0,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '1500000000000000000000',
    qualifiedStake: '1500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 346
  },
  {
    locked: '1500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '1d6371bd9955306e092fa4fc095e08d8909b97a85a66a39327442b4da48b7b07abbd068f3036ad7d081effc7c5e8ae079880c594cc16d654edde716d78a88a14049ecb9e470dbb3e793c458ab3e6ad2b0b359ff6b556ccb0f44cb2f68724a519',
    auctionValidators: 1,
    qualifiedAuctionValidators: 0,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '1500000000000000000000',
    qualifiedStake: '1500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 347
  },
  {
    locked: '1500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '1bccca0676c5f3a05a72e9c6e3473ca78c59863f1576103cbc981780c4fb40096cf824611d20c7576eb450efcc9716000fe2f94bc24de78c21f9467ecd574377224557f22e072ae685082c53f1ca9c2b39f10c7d2c8e4762984553fe8501fb19',
    auctionValidators: 1,
    qualifiedAuctionValidators: 0,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '1500000000000000000000',
    qualifiedStake: '1500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 348
  },
  {
    locked: '1500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '1b824049b75eae175c834a9def41e81a109351fdf6b86e8134bf6344357ea7898f637141d34e3c79ce6603d6ce69251477af6eb82473c4c9bab7a5e9758cecb98938f8c5f79651cc7054943089865e79c0bf9180dd737a33f1b6092092419a06',
    auctionValidators: 1,
    qualifiedAuctionValidators: 0,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '1500000000000000000000',
    qualifiedStake: '1500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 349
  },
  {
    locked: '1500000000000000000000',
    distribution: {
      direct: 1
    },
    name: '0c53dfcee4022b2556ac71131e6e78ef40bcd65051d6adc4fa8cd03edf0beaefe871771ca515b6f74a61fbc7f6fb3a0e7531eb06209db5334f3a3f8a75a1fe65ebf72536eafe11d0818809b004e86c75fb737a61a215a7776b1c73c7689e410d',
    auctionValidators: 1,
    qualifiedAuctionValidators: 0,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '1500000000000000000000',
    qualifiedStake: '1500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 350
  },
  {
    identity: 'blockgorillaz',
    locked: '2500000000000000000000',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/blockgorillaz/logo.png',
    name: 'BlockGorillaz',
    auctionValidators: 1,
    qualifiedAuctionValidators: 0,
    dangerZoneValidators: 0,
    droppedValidators: 0,
    stake: '1500000000000000000000',
    qualifiedStake: '1500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 351
  },
  {
    identity: 'chainguardians',
    locked: '1500000000000000000000',
    distribution: {
      direct: 1
    },
    avatar:
      'https://raw.githubusercontent.com/multiversx/mx-assets/master/identities/chainguardians/logo.png',
    name: 'ChainGuardians',
    auctionValidators: 1,
    qualifiedAuctionValidators: 0,
    dangerZoneValidators: 0,
    droppedValidators: 1,
    stake: '1500000000000000000000',
    qualifiedStake: '1500000000000000000000',
    auctionTopUp: '0',
    auctionPosition: 352
  }
];

export const AuctionListTable = ({
  showPosition = true,
  className
}: AuctionListTableUIType) => {
  const [searchParams] = useSearchParams();
  const { sort, order } = useGetSort();
  const { isQualified, isAuctionDangerZone } = Object.fromEntries(searchParams);

  const {
    unprocessed: { minimumAuctionQualifiedStake }
  } = useSelector(stakeSelector);

  const [qualifiedExpanded, setQualifiedExpanded] = useState(false);
  const [notQualifiedExpanded, setNotQualifiedExpanded] = useState(false);

  let filterText = '';
  if (isQualified !== undefined) {
    if (isQualified) {
      filterText = 'Qualified';
    }
    filterText = 'Not Qualified';
  }
  if (isAuctionDangerZone) {
    filterText = 'Qualified in Danger Zone';
  }

  const hasNoFilters =
    isQualified === undefined && isAuctionDangerZone === undefined;

  const filteredValidators = hasNoFilters
    ? auctionListValidators
    : auctionListValidators.filter((validator) => {
        if (
          isQualified === 'true' &&
          isAuctionDangerZone === undefined &&
          new BigNumber(
            validator.qualifiedAuctionValidators ?? 0
          ).isGreaterThan(0)
        ) {
          return true;
        }
        if (
          isAuctionDangerZone === 'true' &&
          new BigNumber(
            validator.qualifiedAuctionValidators ?? 0
          ).isGreaterThan(0) &&
          new BigNumber(validator.dangerZoneValidators ?? 0).isGreaterThan(0)
        ) {
          return true;
        }

        if (
          isQualified === 'false' &&
          new BigNumber(validator.qualifiedAuctionValidators ?? 0).isZero()
        ) {
          return true;
        }

        return false;
      });

  const isAuctionSortDesc =
    sort === 'qualifiedStake' && order === SortOrderEnum.desc;

  const expandRowConfig = {
    ...getExpandRowDetails(filteredValidators),
    qualifiedExpanded,
    notQualifiedExpanded,
    setQualifiedExpanded,
    setNotQualifiedExpanded
  } as ExpandRowConfigType;

  const thresholdIndex = isAuctionSortDesc
    ? filteredValidators.findIndex((validator) =>
        hasThresholdRow(validator, minimumAuctionQualifiedStake)
      )
    : filteredValidators.findLastIndex((validator) =>
        hasThresholdRow(validator, minimumAuctionQualifiedStake)
      );

  const tableTotalAuction = filteredValidators.reduce(
    (accumulator, currentValue) =>
      accumulator.plus(new BigNumber(currentValue?.auctionValidators ?? 0)),
    new BigNumber(0)
  );
  const tableTotalDropped = filteredValidators.reduce(
    (accumulator, currentValue) =>
      accumulator.plus(
        new BigNumber(
          currentValue?.droppedValidators ??
            (currentValue?.auctionValidators ?? 0) -
              (currentValue?.qualifiedAuctionValidators ?? 0)
        )
      ),
    new BigNumber(0)
  );
  const tableTotalQualified = filteredValidators.reduce(
    (accumulator, currentValue) =>
      accumulator.plus(
        new BigNumber(currentValue?.qualifiedAuctionValidators ?? 0)
      ),
    new BigNumber(0)
  );

  const qualifiedValidators = filteredValidators.filter((validator) =>
    new BigNumber(validator.qualifiedAuctionValidators ?? 0).isGreaterThan(0)
  );
  const notQualifiedValidators = filteredValidators.filter((validator) =>
    new BigNumber(validator.qualifiedAuctionValidators ?? 0).isZero()
  );

  if (filteredValidators.length === 0) {
    return (
      <PageState
        icon={faCogs}
        title={`No ${
          filterText ? `${filterText} ` : ''
        }Validators in Auction List`}
      />
    );
  }

  return (
    <div className={classNames('auction-list-table table-wrapper', className)}>
      <table className='table mb-0'>
        <thead>
          <tr>
            {showPosition && <th className='th-rank'>#</th>}
            <th className='th-identity'>Identity</th>
            <th className='th-auction-nodes'>Auction List Nodes</th>
            <th className='th-dropped'>Dropped</th>
            <th className='th-qualified'>Qualified</th>
            <th className='th-stake'>Qualified Stake / Node</th>
            <th className='th-info'>Delta</th>
          </tr>
        </thead>
        <tbody>
          {filteredValidators.map((validator, index) => {
            const showThresholdRow = Boolean(
              thresholdIndex && index === thresholdIndex && hasNoFilters
            );

            return (
              <AuctionListRow
                validator={validator}
                index={index}
                key={index}
                expandRowConfig={expandRowConfig}
                thresholdRowConfig={{
                  showThresholdRow,
                  qualifiedValidators: qualifiedValidators.length,
                  notQualifiedValidators: notQualifiedValidators.length
                }}
              />
            );
          })}
          <tr>
            {showPosition && <td></td>}
            <td></td>
            <td className='text-neutral-300'>
              <FormatNumber value={tableTotalAuction} />{' '}
              {getStringPlural(tableTotalAuction, { string: 'node' })}
            </td>
            <td className='text-neutral-300'>
              <FormatNumber value={tableTotalDropped} />{' '}
              {getStringPlural(tableTotalDropped, { string: 'node' })}
            </td>
            <td className='text-neutral-300'>
              <FormatNumber value={tableTotalQualified} />{' '}
              {getStringPlural(tableTotalQualified, { string: 'node' })}
            </td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
