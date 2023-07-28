import FileSaver from 'file-saver';

interface DownloadFileType {
  data: any;
  name: string;
  fileType: 'csv' | 'json' | 'wasm';
}

export const getFileMetadata = (type: DownloadFileType['fileType']) => {
  switch (type) {
    case 'csv':
      return 'data:text/csv;charset=utf-8';

    case 'wasm':
      return 'application/octet-stream';

    default:
      return 'application/json; charset=utf-8';
  }
};

export const downloadFile = ({ data, name, fileType }: DownloadFileType) => {
  if (data && name && process.env.NODE_ENV !== 'test') {
    const type = getFileMetadata(fileType);
    const blob = new Blob([data], { type });

    if (!navigator.userAgent.match('CriOS')) {
      FileSaver.saveAs(blob, name + '.' + fileType);
    } else {
      const reader = new FileReader();
      reader.onload = function onload(e) {
        (window.location.href as any) = reader.result;
      };
      reader.readAsDataURL(blob);

      const fileURL = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = fileURL;
      a.target = '_blank';
      a.download = name + '.' + fileType;
      document.body.appendChild(a);
      a.click();
    }
  }
};
