import { useEffect, useRef, useState, useSyncExternalStore, type ComponentRef } from 'react';
import { Keyboard, Platform, type View } from 'react-native';

// Mép trên của những thứ chiếm đáy màn (BottomBar, bàn phím), toạ độ cửa sổ. UuFeedbackHost đọc để Toast
// nổi trên mép cao nhất (§6.6) — app không truyền tay chiều cao thanh.
const edges = new Map<number, number>();
let seq = 0;
let top: number | null = null;
const subs = new Set<() => void>();
const emit = () => {
  const all = [...edges.values()];
  top = all.length ? Math.min(...all) : null;
  subs.forEach((f) => f());
};
const subscribe = (f: () => void) => {
  subs.add(f);
  return () => subs.delete(f);
};
const setEdge = (id: number, y: number | null) => {
  if (y === null) edges.delete(id);
  else edges.set(id, y);
  emit();
};

/** Mép trên cao nhất đang chiếm đáy màn (toạ độ cửa sổ), `null` khi không có. */
export const useUuBottomEdge = () => useSyncExternalStore(subscribe, () => top);

/** Gắn vào view của BottomBar: báo mép trên mỗi lần layout, gỡ khi unmount. */
export function useUuBottomEdgeReporter() {
  const ref = useRef<ComponentRef<typeof View>>(null);
  const id = useRef(0);
  if (!id.current) id.current = ++seq;
  useEffect(() => () => setEdge(id.current, null), []);
  const onLayout = () => ref.current?.measureInWindow((_x, y, _w, h) => setEdge(id.current, h > 0 ? y : null));
  return { ref, onLayout };
}

/** Bàn phím báo mép trên của nó (iOS báo trước khi trượt lên, Android sau khi hiện). */
export function useUuKeyboardEdge() {
  useEffect(() => {
    const kid = ++seq;
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', (e) => setEdge(kid, e.endCoordinates.screenY));
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setEdge(kid, null));
    return () => { show.remove(); hide.remove(); setEdge(kid, null); };
  }, []);
}

/** Mép trên bàn phím (toạ độ màn), `null` khi bàn phím đóng. Dùng trong Modal (sheet), nơi BottomBar phía sau bị che. */
export function useUuKeyboardTop() {
  const [y, setY] = useState<number | null>(null);
  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', (e) => setY(e.endCoordinates.screenY));
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setY(null));
    return () => { show.remove(); hide.remove(); };
  }, []);
  return y;
}
