import React, { useCallback } from 'react';

const ellipse = (parentNode: any, childNode: any, txtNode: any) => {
  const childWidth = childNode.offsetWidth;
  const containerWidth = parentNode.offsetWidth;
  const txtWidth = txtNode.offsetWidth;
  const targetWidth = childWidth > txtWidth ? childWidth : txtWidth;
  const tolerance = 2.6; // 5

  if (targetWidth > containerWidth) {
    const str = txtNode.textContent;
    const txtChars = str.length;
    const avgLetterSize = txtWidth / txtChars;
    const canFit = (containerWidth - (targetWidth - txtWidth)) / avgLetterSize;
    const delEachSide = (txtChars - canFit + tolerance) / 2;
    const endLeft = Math.floor(txtChars / 2 - delEachSide);
    const startRight = Math.ceil(txtChars / 2 + delEachSide);

    txtNode.setAttribute('data-original', txtNode.textContent);
    txtNode.textContent = str.substr(0, endLeft) + '...' + str.substr(startRight);
  }
};

const TrimHash = (props: any) => {
  const prepEllipse = (node: any) => {
    const parent = node.parentNode;
    const child = node.childNodes[0];
    const txtToEllipse = parent.querySelector('.ellipseMe') || child;

    if (child !== null && txtToEllipse !== null) {
      // (Re)-set text back to data-original-text if it exists.
      if (txtToEllipse.hasAttribute('data-original')) {
        txtToEllipse.textContent = txtToEllipse.getAttribute('data-original');
      }

      ellipse(
        // Use the smaller width.
        node.offsetWidth > parent.offsetWidth ? parent : node,
        child,
        txtToEllipse
      );
    }
  };

  const measuredParent = useCallback((node) => {
    if (node !== null) {
      window.addEventListener('resize', () => {
        prepEllipse(node);
      });
      prepEllipse(node);
    }
  }, []);

  return (
    <div
      ref={measuredParent}
      style={{
        wordBreak: 'keep-all',
        overflowWrap: 'normal',
        ...(props.width && { width: props.width }),
      }}
    >
      {props.children}
    </div>
  );
};

interface TrimHashType {
  text: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

export default (props: TrimHashType) => {
  const { text, className } = props;

  const spanProps = {
    ...(props['data-testid'] ? { 'data-testid': props['data-testid'] } : {}),
  };

  return (
    <div className={`flex-shrink-1 text-nowrap overflow-hidden ${className ? className : ''}`}>
      <div>
        <TrimHash>
          <span className="ellipseMe" {...spanProps}>
            {text}
          </span>
        </TrimHash>
      </div>
    </div>
  );
};
