import axios from 'axios';

type ParamsType = {
  nodeUrl: string;
  timeout: number;
};

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
