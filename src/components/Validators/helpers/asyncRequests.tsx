import axios from 'axios';
import fakeHeartbeatstatus from './mockHearbeat';
import fakeStatistics from './mockStatistics';
import fakeBrandData from './mockBrandData';

interface ParamsType {
  nodeUrl: string;
  timeout: number;
}

export async function getValidatorsHeartbeat({ nodeUrl, timeout }: ParamsType) {
  try {
    let {
      data: { message },
    } = await axios.get(`${nodeUrl}/node/heartbeatstatus`, { timeout });

    // message = fakeHeartbeatstatus.message ? fakeHeartbeatstatus.message : message;

    if (Array.isArray(message)) {
      return {
        data: message,
        success: message.length >= 1,
      };
    }
    return {
      data: [],
      success: false,
    };
  } catch {
    return {
      data: [],
      success: false,
    };
  }
}

export async function getValidatorStatistics({ nodeUrl, timeout }: ParamsType) {
  try {
    let {
      data: { statistics },
    } = await axios.get(`${nodeUrl}/validator/statistics`, { timeout });

    // statistics = fakeStatistics.statistics ? fakeStatistics.statistics : statistics;

    return {
      statistics,
      success: true,
    };
  } catch {
    return {
      statistics: {},
      success: false,
    };
  }
}

interface KeybaseArrayType {
  identity: string;
  publicKeys: string[];
}

interface BrandDataParamsType {
  explorerApi: string;
  timeout: number;
}

export async function getBrandData({ explorerApi, timeout }: BrandDataParamsType) {
  try {
    let { data } = await axios.get(`${explorerApi}/validators`, { timeout });

    data = fakeBrandData ? fakeBrandData : data;

    return {
      data,
      success: true,
    };
  } catch {
    return {
      data: [],
      success: false,
    };
  }
}
