import axios from 'axios';

export interface KeybaseArrayType {
  identity: string;
  publicKeys: string[];
}

interface ParamsType {
  explorerApi: string;
  timeout: number;
  keybaseArray: KeybaseArrayType[];
}

export async function getBrandData({ explorerApi, timeout, keybaseArray }: ParamsType) {
  try {
    // const { data } = await axios.post(`${explorerApi}/validators`, keybaseArray, { timeout });
    const { data } = await axios.post(`${explorerApi}/validators`, JSON.stringify(keybaseArray), {
      timeout,
    });

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
