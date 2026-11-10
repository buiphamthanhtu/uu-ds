import { useLayoutEffect, useRef, useState, useSyncExternalStore, type ComponentRef, type ReactNode } from 'react';
import { View } from 'react-native';

// Lớp portal tối giản: nội dung vẽ ở UuFeedbackHost (gốc app), toạ độ theo cửa sổ.
let nodes = new Map<number, ReactNode>();
let hosts = 0;
let origin = { x: 0, y: 0 };
let seq = 0;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
const subscribe = (f: () => void) => {
  subs.add(f);
  return () => subs.delete(f);
};

/** Có lớp portal (UuFeedbackHost) đang gắn không. */
export const hasPortalHost = () => hosts > 0;
/** Góc trên trái của lớp portal trong cửa sổ — trừ đi để đổi toạ độ `measureInWindow` sang toạ độ lớp. */
export const portalOrigin = () => origin;

/** Vẽ `children` lên lớp portal (cần UuFeedbackHost). Không có host thì vẽ tại chỗ. */
export function UuPortal({ children }: { children: ReactNode }) {
  const id = useRef(0);
  if (!id.current) id.current = ++seq;
  useLayoutEffect(() => {
    nodes = new Map(nodes).set(id.current, children);
    emit();
  });
  useLayoutEffect(
    () => () => {
      nodes = new Map(nodes);
      nodes.delete(id.current);
      emit();
    },
    [],
  );
  return null;
}

/** Lớp vẽ portal, phủ kín cha. UuFeedbackHost đã gồm lớp này. */
export function UuPortalLayer() {
  const all = useSyncExternalStore(subscribe, () => nodes);
  const ref = useRef<ComponentRef<typeof View>>(null);
  const [, force] = useState(0);
  useLayoutEffect(() => {
    hosts++;
    force((n) => n + 1);
    return () => {
      hosts--;
    };
  }, []);
  return (
    <View
      ref={ref}
      pointerEvents="box-none"
      onLayout={() => ref.current?.measureInWindow((x, y) => { origin = { x, y }; emit(); })}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {[...all.entries()].map(([k, n]) => (
        <View key={k} pointerEvents="box-none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          {n}
        </View>
      ))}
    </View>
  );
}
