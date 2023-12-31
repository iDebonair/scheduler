import { renderHook, act, waitForNextUpdate } from "@testing-library/react-hooks";

import useVisualMode from "hooks/useVisualMode";

const FIRST = "FIRST";
const SECOND = "SECOND";
const THIRD = "THIRD";

test("useVisualMode should return to previous mode", () => {
  const { result } = renderHook(() => useVisualMode(FIRST));

  act(() => result.current.transition(SECOND));
  expect(result.current.mode).toBe(SECOND);

  act(() => result.current.transition(THIRD));
  expect(result.current.mode).toBe(THIRD);

  //act(() => result.current.back());

  act(() => result.current.back());
  expect(result.current.mode).toBe(SECOND);

  //act(() => result.current.back());

  act(() => result.current.back());
  expect(result.current.mode).toBe(FIRST);
});