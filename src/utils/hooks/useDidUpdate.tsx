import { useRef, useEffect } from "react";


export default function useDidUpdateEffect(effect:()=>void, deps?: any  ) {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      effect();
    } else {
      didMount.current = true;
    }
  }, deps);
}