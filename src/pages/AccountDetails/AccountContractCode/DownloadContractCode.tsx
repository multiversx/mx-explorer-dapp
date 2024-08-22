import { downloadFile } from 'helpers';

export const DownloadContractCode = ({
  code,
  fileName
}: {
  code: string;
  fileName?: string;
}) => {
  const download = (e: React.MouseEvent) => {
    const name = (fileName ?? 'contract').toLowerCase();

    e.preventDefault();
    if (code && name) {
      const codeBuffer = Buffer.from(code, 'hex');
      downloadFile({ data: codeBuffer, name, fileType: 'wasm' });
    }
  };

  return (
    <button type='button' onClick={download} className='btn btn-primary'>
      Download WASM File
    </button>
  );
};
