// UuTextButton (§6.1) · UuIconButton (§6.2): role, nhãn, Disabled / Loading khoá chạm.
import { fireEvent, render, screen } from '@testing-library/react-native';
import { UuIconButton, UuProvider, UuTextButton, UuTextButtonDanger } from '../src';

const wrap = (ui: React.ReactElement) => render(<UuProvider>{ui}</UuProvider>);

describe('UuTextButton', () => {
  it('role button, tên = label, chạm thì gọi onPress', async () => {
    const onPress = jest.fn();
    await wrap(<UuTextButton label="Tiếp tục" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Tiếp tục' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('State=Disabled: disabled trong accessibilityState, chạm không gọi onPress', async () => {
    const onPress = jest.fn();
    await wrap(<UuTextButton label="Tiếp tục" state="disabled" onPress={onPress} />);
    const btn = screen.getByRole('button', { name: 'Tiếp tục' });
    expect(btn).toBeDisabled();
    await fireEvent.press(btn);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('State=Loading: busy, khoá chạm, nhãn vẫn hiện', async () => {
    const onPress = jest.fn();
    await wrap(<UuTextButton label="Đang lưu" state="loading" onPress={onPress} />);
    const btn = screen.getByRole('button', { name: 'Đang lưu' });
    expect(btn).toBeBusy();
    expect(screen.getByText('Đang lưu')).toBeOnTheScreen();
    await fireEvent.press(btn);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('UuTextButtonDanger bấm được như nút thường', async () => {
    const onPress = jest.fn();
    await wrap(<UuTextButtonDanger label="Xoá tài khoản" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Xoá tài khoản' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('UuIconButton', () => {
  it('tên cho trình đọc màn hình lấy từ label; Disabled khoá chạm', async () => {
    const onPress = jest.fn();
    const { rerender } = await wrap(<UuIconButton icon="xmark" label="Đóng" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Đóng' }));
    expect(onPress).toHaveBeenCalledTimes(1);
    await rerender(<UuProvider><UuIconButton icon="xmark" label="Đóng" state="disabled" onPress={onPress} /></UuProvider>);
    await fireEvent.press(screen.getByRole('button', { name: 'Đóng' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
