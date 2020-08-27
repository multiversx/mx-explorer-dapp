import { useGlobalState } from 'context';
import elastic from './elastic';

export default function useAdapter() {
  const {
    activeTestnet: { elasticUrl },
    timeout,
  } = useGlobalState();

  // const useApi = elasticUrl.includes('.elrond.com');

  return {
    getBlocks: () =>
      elastic({
        path: `/blocks`,
        queryStringParameters: {
          size: 25,
        },
        elasticUrl,
      }).then((data) => console.log(1111, data)),
  };
}
