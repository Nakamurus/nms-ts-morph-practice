import { useButton } from "./hook";

type CounterButtonProps = {
  incrementButtonLabel?: string;
  decrementButtonLabel?: string;
};

export function CounterButton(props: CounterButtonProps) {
  return <IncrementButtonInternal {...props} />;
}

const IncrementButtonInternal = (props: CounterButtonProps) => {
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