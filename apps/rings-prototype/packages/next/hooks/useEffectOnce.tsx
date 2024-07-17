import { EffectCallback, useEffect } from 'react';

/**
 * This is for effects that should only happen when the component is mounted and/or when the
 * component is unmounted.
 * @param effect
 */
const useEffectOnce = (effect: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
};

export default useEffectOnce;