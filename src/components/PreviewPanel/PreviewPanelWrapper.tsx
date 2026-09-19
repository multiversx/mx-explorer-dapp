import { ReactNode, useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { OverlayTriggerType } from 'react-bootstrap/esm/OverlayTrigger';

import { Loader } from 'components';
import { WithClassnameType, ApiAdapterResponseType } from 'types';

export interface PreviewPanelWrapperUIType extends WithClassnameType {
  preview: ReactNode;
  children: ReactNode;
  fetchData: () => Promise<ApiAdapterResponseType>;
  onApiData: (response: any) => void;
  cachedPreviews: Record<string, any>;
  hash: string;
  trigger?: OverlayTriggerType[];
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const PreviewPanelWrapper = ({
  preview,
  children,
  fetchData,
  onApiData,
  cachedPreviews = {},
  hash = '',
  trigger = ['click', 'hover'],
  onMouseEnter,
  onMouseLeave
}: PreviewPanelWrapperUIType) => {
  const [show, setShow] = useState(false);
  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [previewDetails, setPreviewDetails] = useState<any | undefined>();

  const hasHoverTrigger = trigger.includes('hover');

  const fetchDetails = () => {
    if (!hash) {
      return;
    }

    if (cachedPreviews?.[hash]) {
      setPreviewDetails(cachedPreviews[hash]);
      setDataReady(true);
      return;
    }

    fetchData().then(({ data, success }) => {
      if (!data || !success) {
        return;
      }

      onApiData(data);
      setPreviewDetails(data);
      setDataReady(data && success);
    });
  };

  const handleOnMouseEnter = () => {
    setShow(true);
    if (onMouseEnter && hasHoverTrigger) {
      onMouseEnter();
    }
  };
  const handleOnMouseLeave = () => {
    setShow(false);
    if (onMouseLeave && hasHoverTrigger) {
      onMouseLeave();
    }
  };

  return (
    <OverlayTrigger
      key='popover'
      trigger={trigger}
      placement='top'
      delay={{ show: 100, hide: 400 }}
      rootClose
      onToggle={(show) => {
        if (!show) {
          if (onMouseLeave) {
            onMouseLeave();
          }
          return;
        }

        fetchDetails();
        if (onMouseEnter) {
          onMouseEnter();
        }
      }}
      overlay={
        <Popover
          id='popover-positioned-bottom'
          className='preview-panel-wrapper'
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
        >
          {dataReady && previewDetails ? (
            <>{preview}</>
          ) : (
            <Loader className='px-5' />
          )}
        </Popover>
      }
      {...(hasHoverTrigger ? { show } : {})}
    >
      <div onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
        {children}
      </div>
    </OverlayTrigger>
  );
};
