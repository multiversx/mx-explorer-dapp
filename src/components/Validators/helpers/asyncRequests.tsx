import axios from 'axios';

interface ParamsType {
  nodeUrl: string;
  timeout: number;
}

export async function getValidatorsHeartbeat({ nodeUrl, timeout }: ParamsType) {
  try {
    const {
      data: {
        data: { heartbeats: message },
        code,
        error,
      },
    } = await axios.get(`${nodeUrl}/node/heartbeatstatus`, { timeout });

    if (code === 'successful') {
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
    } else {
      throw new Error(error);
    }
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
      data: {
        data: { statistics },
        code,
        error,
      },
    } = await axios.get(`${nodeUrl}/validator/statistics`, { timeout });

    if (code === 'successful') {
      return {
        statistics,
        success: true,
      };
    } else {
      throw new Error(error);
    }
  } catch {
    return {
      statistics: {},
      success: false,
    };
  }
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
