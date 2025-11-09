import { useButton } from "./hook";

type IncrementButtonProps = {
  incrementButtonLabel?: string;
  decrementButtonLabel?: string;
};

export const IncrementButton = (props: IncrementButtonProps) => {
  const { decrement, increment, count } = useButton(0);
  return (
    <>
      <button type="button" onClick={increment}>
        {props.incrementButtonLabel || "Increment"}
      </button>
      <button type="button" onClick={decrement}>
        {props.decrementButtonLabel || "Decrement"}
      </button>
      <div>Count: {count}</div>
    </>
  );
};