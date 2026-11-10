// UuToast (§6.6): nội dung đọc được, Action và nút đóng bấm được.
import { fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { UuProvider, UuToast } from '../src';

const wrap = (ui: React.ReactElement) => render(<UuProvider>{ui}</UuProvider>);

describe('UuToast', () => {
  it.each(['neutral', 'negative', 'positive', 'warning'] as const)('Type=%s: hiện nội dung, Action + nút "Đóng" bấm được', async (type) => {
    const onAction = jest.fn();
    const onClose = jest.fn();
    await wrap(<UuToast type={type} content="Đã xoá 1 mục" actionLabel="Hoàn tác" onAction={onAction} onClose={onClose} />);
    expect(screen.getByText('Đã xoá 1 mục')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Hoàn tác' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Đóng' }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('không truyền action / onClose thì không có nút', async () => {
    await wrap(<UuToast content="Đã lưu" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it.each([
    ['negative', 'assertive', 'alert', false],
    ['neutral', 'polite', undefined, true],
    ['positive', 'polite', undefined, true],
    ['warning', 'polite', undefined, true],
  ] as const)('Type=%s: live region %s, role %s; iOS announce queue=%s', async (type, live, role, queue) => {
    const spy = jest.spyOn(AccessibilityInfo, 'announceForAccessibilityWithOptions').mockImplementation(() => {});
    await wrap(<UuToast type={type} content="Không lưu được" />);
    let box = screen.getByText('Không lưu được');
    while (box.props.accessibilityLiveRegion === undefined && box.parent) box = box.parent;
    expect(box.props.accessibilityLiveRegion).toBe(live);
    expect(box.props.accessibilityRole).toBe(role);
    expect(spy).toHaveBeenCalledWith('Không lưu được', { queue });
    spy.mockRestore();
  });
});
