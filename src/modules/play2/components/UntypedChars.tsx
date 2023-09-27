import { useCodeStore } from "../state/code-store";
export function UntypedChars() {
  const untypedChars = useCodeStore((state) => state.untypedChars);
  return <span style={{ color: '#212121' }}>{untypedChars()}</span>;
}
