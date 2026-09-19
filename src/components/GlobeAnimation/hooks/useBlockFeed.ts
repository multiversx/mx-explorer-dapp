import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { blocksSelector } from 'redux/selectors';
import { UIBlockType } from 'types';

const FEED_INTERVAL = 1400;
const MAX_QUEUE = 6;
const MAX_SEEN = 500;

export const useBlockFeed = (isEnabled: boolean) => {
  const { blocks } = useSelector(blocksSelector);
  const seenRef = useRef<Set<string>>(new Set());
  const queueRef = useRef<UIBlockType[]>([]);
  const hasStartedRef = useRef(false);
  const [activeBlock, setActiveBlock] = useState<UIBlockType>();

  useEffect(() => {
    if (blocks.length === 0) {
      return;
    }

    const seen = seenRef.current;
    const queue = queueRef.current;
    const unseen = blocks.filter((block) => !seen.has(block.hash));
    unseen.forEach((block) => seen.add(block.hash));

    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      queue.push(blocks[0]);
    } else {
      queue.push(...unseen.slice().reverse());
    }

    if (queue.length > MAX_QUEUE) {
      queue.splice(0, queue.length - MAX_QUEUE);
    }

    if (seen.size > MAX_SEEN) {
      seenRef.current = new Set(blocks.map((block) => block.hash));
    }
  }, [blocks]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const tick = () => {
      const next = queueRef.current.shift();
      if (next) {
        setActiveBlock(next);
      }
    };

    tick();
    const intervalId = setInterval(tick, FEED_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isEnabled]);

  return activeBlock;
};
