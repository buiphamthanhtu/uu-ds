// UuCheckbox (§6.3f) · UuRadio (§6.3d) · UuSwitch (§6.17): role, checked / mixed, vùng chạm cả hàng, Disabled.
import { fireEvent, render, screen } from '@testing-library/react-native';
import { UuCheckbox, UuCheckboxInput, UuProvider, UuRadio, UuRadioInput, UuRadioList, UuSwitch } from '../src';

const wrap = (ui: React.ReactElement) => render(<UuProvider>{ui}</UuProvider>);

describe('UuCheckbox', () => {
  it.each([
    [false, false],
    [true, true],
    [null, 'mixed'],
  ] as const)('checked=%s → accessibilityState.checked=%s', async (checked, state) => {
    await wrap(<UuCheckbox checked={checked} accessibilityLabel="Đồng ý" onChange={() => {}} />);
    expect(screen.getByRole('checkbox', { name: 'Đồng ý' }).props.accessibilityState.checked).toBe(state);
  });

  it('chạm Unchecked → true, Checked → false, Indeterminate → true', async () => {
    const onChange = jest.fn();
    const { rerender } = await wrap(<UuCheckbox checked={false} onChange={onChange} accessibilityLabel="A" />);
    await fireEvent.press(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenLastCalledWith(true);
    await rerender(<UuProvider><UuCheckbox checked onChange={onChange} accessibilityLabel="A" /></UuProvider>);
    await fireEvent.press(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenLastCalledWith(false);
    await rerender(<UuProvider><UuCheckbox checked={null} onChange={onChange} accessibilityLabel="A" /></UuProvider>);
    await fireEvent.press(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenLastCalledWith(true);
  });

  it('Disabled khoá chạm', async () => {
    const onChange = jest.fn();
    await wrap(<UuCheckbox checked={false} disabled onChange={onChange} accessibilityLabel="A" />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
    await fireEvent.press(screen.getByRole('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('UuCheckboxInput: chạm chữ cũng tick', async () => {
    const onChange = jest.fn();
    await wrap(<UuCheckboxInput checked={false} label="Nhận tin khuyến mãi" onChange={onChange} />);
    expect(screen.getByRole('checkbox', { name: 'Nhận tin khuyến mãi' })).toBeOnTheScreen();
    await fireEvent.press(screen.getByText('Nhận tin khuyến mãi'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('UuCheckboxInput Disabled: chạm chữ không tick', async () => {
    const onChange = jest.fn();
    await wrap(<UuCheckboxInput checked={false} disabled label="A" onChange={onChange} />);
    await fireEvent.press(screen.getByText('A'));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('UuRadio', () => {
  it('chạm radio chưa chọn → onSelect; đang chọn → không gì', async () => {
    const onSelect = jest.fn();
    const { rerender } = await wrap(<UuRadio checked={false} onSelect={onSelect} accessibilityLabel="A" />);
    await fireEvent.press(screen.getByRole('radio', { name: 'A' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    await rerender(<UuProvider><UuRadio checked onSelect={onSelect} accessibilityLabel="A" /></UuProvider>);
    expect(screen.getByRole('radio')).toBeChecked();
    await fireEvent.press(screen.getByRole('radio'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('UuRadioInput: chạm chữ là chọn', async () => {
    const onSelect = jest.fn();
    await wrap(<UuRadioInput checked={false} label="Giao nhanh" onSelect={onSelect} />);
    await fireEvent.press(screen.getByText('Giao nhanh'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('UuRadioList: chọn theo value, bỏ qua mục Disabled', async () => {
    const onChange = jest.fn();
    await wrap(<UuRadioList value="a" onChange={onChange} options={[{ value: 'a', label: 'Tiêu chuẩn' }, { value: 'b', label: 'Nhanh' }, { value: 'c', label: 'Hoả tốc', disabled: true }]} />);
    expect(screen.getByRole('radio', { name: 'Tiêu chuẩn' })).toBeChecked();
    await fireEvent.press(screen.getByText('Nhanh'));
    expect(onChange).toHaveBeenCalledWith('b');
    await fireEvent.press(screen.getByText('Hoả tốc'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('UuSwitch', () => {
  it('role switch, chạm → onChange(!checked); Disabled khoá', async () => {
    const onChange = jest.fn();
    const { rerender } = await wrap(<UuSwitch checked={false} onChange={onChange} accessibilityLabel="Thông báo" />);
    await fireEvent.press(screen.getByRole('switch', { name: 'Thông báo' }));
    expect(onChange).toHaveBeenLastCalledWith(true);
    await rerender(<UuProvider><UuSwitch checked disabled onChange={onChange} accessibilityLabel="Thông báo" /></UuProvider>);
    expect(screen.getByRole('switch')).toBeChecked();
    await fireEvent.press(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
