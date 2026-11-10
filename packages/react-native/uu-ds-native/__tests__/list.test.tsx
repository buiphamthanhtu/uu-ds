// UuListItem · UuListGroup (§6.32): bấm cả hàng, bấm hàng = bật / chọn, Action vùng bấm riêng, Disabled.
import { fireEvent, render, screen } from '@testing-library/react-native';
import { UuListGroup, UuListItem, UuProvider } from '../src';

const wrap = (ui: React.ReactElement) => render(<UuProvider>{ui}</UuProvider>);

describe('UuListItem', () => {
  it('hàng có onPress là một nút, tên = Title (+ Description)', async () => {
    const onPress = jest.fn();
    await wrap(<UuListItem title="Ngôn ngữ" description="Tiếng Việt" trailing="chevron" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Ngôn ngữ, Tiếng Việt' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('Disabled: chạm không gọi onPress', async () => {
    const onPress = jest.fn();
    await wrap(<UuListItem title="Ngôn ngữ" onPress={onPress} disabled />);
    const row = screen.getByRole('button', { name: 'Ngôn ngữ' });
    expect(row).toBeDisabled();
    await fireEvent.press(row);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('hàng chỉ hiển thị: không có nút', async () => {
    await wrap(<UuListItem title="Phiên bản" />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('Phiên bản')).toBeOnTheScreen();
  });

  it('Checkbox: cả hàng mang role checkbox, chạm hàng là toggle', async () => {
    const onChange = jest.fn();
    await wrap(<UuListItem title="Hà Nội" selection={{ type: 'checkbox', checked: false, onChange }} />);
    const row = screen.getByRole('checkbox', { name: 'Hà Nội' });
    expect(row).not.toBeChecked();
    await fireEvent.press(row);
    expect(onChange).toHaveBeenCalledWith(true);
    // Ô tick bên trong chỉ để nhìn: chỉ một phần tử trợ năng role checkbox.
    expect(screen.getAllByRole('checkbox')).toHaveLength(1);
  });

  it('Checkbox Indeterminate → mixed, chạm hàng → Checked', async () => {
    const onChange = jest.fn();
    await wrap(<UuListItem title="Tất cả" selection={{ type: 'checkbox', checked: null, onChange }} />);
    const row = screen.getByRole('checkbox', { name: 'Tất cả' });
    expect(row).toBePartiallyChecked();
    await fireEvent.press(row);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('Switch: chạm hàng là bật', async () => {
    const onChange = jest.fn();
    await wrap(<UuListItem title="Thông báo đẩy" selection={{ type: 'switch', checked: false, onChange }} />);
    await fireEvent.press(screen.getByRole('switch', { name: 'Thông báo đẩy' }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('Radio: hàng đang chọn chạm lại không gì', async () => {
    const onChange = jest.fn();
    await wrap(<UuListItem title="Tiếng Việt" selection={{ type: 'radio', checked: true, onChange }} />);
    const row = screen.getByRole('radio', { name: 'Tiếng Việt' });
    expect(row).toBeChecked();
    await fireEvent.press(row);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Disabled selection: chạm hàng không toggle', async () => {
    const onChange = jest.fn();
    await wrap(<UuListItem title="A" disabled selection={{ type: 'switch', checked: false, onChange }} />);
    await fireEvent.press(screen.getByRole('switch', { name: 'A' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Trailing Action có vùng bấm riêng, không kích hoạt hàng', async () => {
    const onPress = jest.fn();
    const onAction = jest.fn();
    await wrap(<UuListItem title="Địa chỉ nhà" onPress={onPress} action={{ icon: 'xmark', label: 'Xoá địa chỉ', onPress: onAction }} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Xoá địa chỉ' }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('UuListGroup', () => {
  it('tiêu đề nhóm là header', async () => {
    await wrap(
      <UuListGroup title="Tài khoản">
        <UuListItem title="Hồ sơ" onPress={() => {}} />
        <UuListItem title="Bảo mật" onPress={() => {}} />
      </UuListGroup>,
    );
    expect(screen.getByRole('header', { name: 'Tài khoản' })).toBeOnTheScreen();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
});
