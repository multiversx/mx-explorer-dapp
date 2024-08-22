import { RawAbiType } from '@multiversx/sdk-dapp-sc-explorer/types/abi.types';

import { downloadFile } from 'helpers';

export const DownloadABIFile = ({
  abi,
  fileName
}: {
  abi: RawAbiType;
  fileName?: string;
}) => {
  const download = (e: React.MouseEvent) => {
    const name = (fileName ?? 'contract').toLowerCase();

    e.preventDefault();
    if (abi && name) {
      downloadFile({
        data: JSON.stringify(abi, null, 2),
        name: `${name}.abi`,
        fileType: 'json'
      });
    }
  };

  return (
    <button type='button' onClick={download} className='btn btn-primary'>
      Download ABI File
    </button>
  );
};
