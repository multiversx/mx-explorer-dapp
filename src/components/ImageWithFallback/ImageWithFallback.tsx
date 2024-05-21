import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { PLACEHOLDER_IMAGE_PATH } from 'appConstants';

interface ImageWithFallbackType extends React.ComponentProps<'img'> {
  src: string;
}

export const ImageWithFallback = ({
  src,
  className,
  ...props
}: ImageWithFallbackType) => {
  const [hasError, setHasError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  return (
    <>
      {hasError ? (
        <img
          src={PLACEHOLDER_IMAGE_PATH}
          className={classNames('fallback', className)}
          {...props}
        />
      ) : (
        <img
          onError={() => {
            setHasError(true);
          }}
          onLoad={() => {
            setImageLoaded(true);
          }}
          src={src}
          className={classNames(className, {
            loading: !imageLoaded
          })}
          {...props}
        />
      )}
    </>
  );
};
