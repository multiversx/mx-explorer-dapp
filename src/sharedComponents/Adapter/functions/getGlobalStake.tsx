import axios from 'axios';

interface GlobalStakeType {
  proxyUrl: string;
  timeout: number;
}

export default async function getGlobalStake({ proxyUrl, timeout }: GlobalStakeType) {
  try {
    const { data } = await axios.get(`${proxyUrl}/stake`, { timeout });
    return {
      data,
      success: true,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
    };
  }
}
