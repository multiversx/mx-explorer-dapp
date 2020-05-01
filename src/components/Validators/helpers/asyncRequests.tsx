import axios from 'axios';

interface ParamsType {
  nodeUrl: string;
  timeout: number;
}

export async function getValidatorsData({ nodeUrl, timeout }: ParamsType) {
  try {
    const {
      data: { message },
    } = await axios.get(`${nodeUrl}/node/heartbeatstatus`, { timeout });

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
    const {
      data: { statistics },
    } = await axios.get(`${nodeUrl}/validator/statistics`, { timeout });
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
    const { data } = await axios.get(`${explorerApi}/validators`, { timeout });

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
