// UuTextInput / UuTextArea (§6.3): dòng gợi ý dưới label, trên ô; có lỗi vẫn giữ, dòng lỗi dưới ô.
import { render, screen } from '@testing-library/react-native';
import { UuProvider, UuTextArea, UuTextInput } from '../src';

const wrap = (ui: React.ReactElement) => render(<UuProvider>{ui}</UuProvider>);

describe.each([
  ['UuTextInput', UuTextInput],
  ['UuTextArea', UuTextArea],
] as const)('%s Helper text', (_name, Comp) => {
  it('gợi ý đứng trước ô; có lỗi vẫn giữ, lỗi đứng sau ô', async () => {
    const r = await wrap(<Comp label="Mật khẩu" helperText="Tối thiểu 8 ký tự" error errorMessage="Mật khẩu quá ngắn" />);
    const json = JSON.stringify(r.toJSON());
    const iHelper = json.indexOf('Tối thiểu 8 ký tự');
    const iInput = json.indexOf('"accessibilityHint"');
    const iError = json.indexOf('Mật khẩu quá ngắn');
    expect(iHelper).toBeGreaterThan(-1);
    expect(iHelper).toBeLessThan(iInput);
    expect(iInput).toBeLessThan(iError);
  });

  it('ô đọc gợi ý làm hint, kể cả khi có lỗi', async () => {
    await wrap(<Comp label="Mật khẩu" helperText="Tối thiểu 8 ký tự" error errorMessage="Sai" />);
    expect(screen.getByLabelText('Mật khẩu').props.accessibilityHint).toBe('Tối thiểu 8 ký tự');
  });
});
