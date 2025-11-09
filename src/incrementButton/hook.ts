import { useState } from "react";

const useIncrement = (initialValue: number) => {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => {
    setCount((prevCount) => prevCount + 1);
  };
  return { count, increment };
}

const useDecrement = (initialValue: number) => {
  const [count, setCount] = useState(initialValue);
  
  const decrement = () => {
    setCount((prevCount) => prevCount - 1);
  };
  return { count, decrement };
}

export const useButton = (initialValue = 0) => {
  const incrementHook = useIncrement(initialValue);
  const decrementHook = useDecrement(initialValue);
  
  return {
    increment: incrementHook.increment,
    decrement: decrementHook.decrement,
    count: incrementHook.count, // Both hooks share the same count state
  };
}