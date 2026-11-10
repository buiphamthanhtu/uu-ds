import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type ComponentRef, type ReactNode } from 'react';
import { Animated, Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
import { UuIconButton, UuSpinner, UuTextButton } from './buttons';
import { UuIcon, type UuIconName } from './icon';
import { UuMenuAnchor, UuMenuItem, UuMenuPanel, UuMenuSection } from './menu-base';
import { useUu } from './theme';
import { useUuHover } from './pressable';
import { gap, opacity, size } from './tokens.g';

export type UuRequirement = 'required' | 'optional';

/** `.label` dùng chung: cao = line-height body, body object-primary, hậu tố caption, icon tooltip 16. */
export function UuFieldLabel({ text: label, requirement, tooltip, error = false, disabled = false }: { text: string; requirement?: UuRequirement; tooltip?: string; error?: boolean; disabled?: boolean }) {
  const { colors: c, text } = useUu();
  const color = error ? c.objectNegative : disabled ? c.objectDisabled : c.objectPrimary;
  return (
    <View style={{ height: text.body.lineHeight, flexDirection: 'row', alignItems: 'center' }}>
      <Text style={[text.body, { color }]}>{label}</Text>
      {requirement && <Text style={[text.caption, { marginLeft: gap.g1, color: c.objectSecondary }]}>∙ {requirement === 'required' ? 'Bắt buộc' : 'Không bắt buộc'}</Text>}
      {tooltip && (
        <View style={{ marginLeft: gap.g2 }} accessible accessibilityLabel={tooltip}>
          <UuIcon name="circle-info" size={16} color={c.objectSecondary} />
        </View>
      )}
    </View>
  );
}

/** Vỏ Field (cao 48 · radius 16 · viền 1px · padding 0/12) — viền theo state, lớp hover object-secondary 5%. */
export function UuFieldShell({ children, focused = false, error = false, disabled = false, height, multiline = false, onPress }: { children: ReactNode; focused?: boolean; error?: boolean; disabled?: boolean; height?: number; multiline?: boolean; onPress?: () => void }) {
  const { colors: c, sizes: z, outerShadow, restBorder } = useUu();
  const [hover, hoverHandlers] = useUuHover();
  const border = error ? c.borderNegative : focused ? c.borderEmphasized : disabled ? c.borderMuted : restBorder(c.borderMuted);
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      {...hoverHandlers}
      accessible={false}
      style={{
        height: height ?? z.fieldHeight,
        paddingHorizontal: z.fieldPaddingX,
        paddingVertical: multiline ? gap.g3 : 0,
        backgroundColor: disabled ? c.backgroundDisabled : c.backgroundSurface,
        borderRadius: z.fieldRadius,
        borderWidth: 1,
        borderColor: border,
        flexDirection: multiline ? 'column' : 'row',
        alignItems: multiline ? 'stretch' : 'center',
        gap: gap.g2,
        overflow: 'hidden',
        boxShadow: outerShadow,
      }}
    >
      {children}
      {hover && !focused && !disabled && <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: c.objectSecondary, opacity: opacity.o5 }} />}
    </Pressable>
  );
}

/** Dòng lỗi caption object-negative. Chiếm chỗ thật, không đè. */
export function UuFieldError({ message, center = false }: { message: string; center?: boolean }) {
  const { colors: c, text } = useUu();
  return <Text accessibilityLiveRegion="polite" style={[text.caption, { color: c.objectNegative, textAlign: center ? 'center' : 'left' }]}>{message}</Text>;
}

const useInputStyle = (disabled: boolean) => {
  const { colors: c, text } = useUu();
  return {
    style: [text.body, { flex: 1, color: c.objectPrimary, padding: 0, margin: 0, ...({ outlineStyle: 'none' } as object) }], // Filled+Disabled giữ object-primary — cố ý. outline none: trên web viền Field đã báo focus.
    placeholderTextColor: disabled ? c.objectDisabled : c.objectSecondary,
    cursorColor: c.objectAccent,
    selectionColor: c.objectAccent,
  };
};

function Labeled({ label, requirement, tooltip, error, errorMessage, helperText, disabled, children, centerError }: { label?: string; requirement?: UuRequirement; tooltip?: string; error?: boolean; errorMessage?: string; helperText?: string; disabled?: boolean; children: ReactNode; centerError?: boolean }) {
  return (
    <View style={{ gap: gap.g1, alignSelf: 'stretch' }}>
      {label && <UuFieldLabel text={label} requirement={requirement} tooltip={tooltip} error={error} disabled={disabled} />}
      {helperText && <UuFieldHelper text={helperText} disabled={disabled} />}
      {children}
      {error && errorMessage && <UuFieldError message={errorMessage} center={centerError} />}
    </View>
  );
}

/** Dòng gợi ý (§6.3 `Helper text`): dưới label, trên ô, caption `object-secondary`; Disabled → `object-disabled`. Có lỗi vẫn giữ. */
export function UuFieldHelper({ text: t, disabled = false }: { text: string; disabled?: boolean }) {
  const { colors: c, text } = useUu();
  return <Text style={[text.caption, { color: disabled ? c.objectDisabled : c.objectSecondary }]}>{t}</Text>;
}

type UuInputRef = ComponentRef<typeof TextInput>;

/** Nhận mọi `TextInputProps` của RN (`maxLength`, `onFocus` / `onBlur`, `autoFocus`, `keyboardType`…) trừ `style` và `editable` (dùng `disabled`). */
export interface UuTextInputProps extends Omit<TextInputProps, 'style' | 'editable'> {
  label?: string;
  requirement?: UuRequirement;
  tooltip?: string;
  placeholder?: string;
  /** Thiết kế `Prefix`: Type=Icon (24) hoặc Type=Label. */
  prefixIcon?: UuIconName;
  prefixLabel?: string;
  /** Thiết kế `Action`: TextButtonNeutral Ghost Small trong suffix, vạch ngăn trái 1px. */
  actionLabel?: string;
  onAction?: () => void;
  error?: boolean;
  errorMessage?: string;
  /** Thiết kế `Helper text`: dòng gợi ý dưới label, trên ô. Có lỗi vẫn hiện; dòng lỗi nằm dưới ô. */
  helperText?: string;
  disabled?: boolean;
}

/** TextInput (§6.3). State suy ra từ focus + value. Error đổi ba thứ: viền, nhãn, dòng lỗi. `ref` trỏ tới `TextInput` của RN (`.focus()`). */
export const UuTextInput = forwardRef<UuInputRef, UuTextInputProps>(function UuTextInput({ label, requirement, tooltip, prefixIcon, prefixLabel, actionLabel, onAction, error = false, errorMessage, helperText, disabled = false, onFocus, onBlur, ...input }, forwarded) {
  const { colors: c, sizes: z, text } = useUu();
  const ref = useRef<UuInputRef>(null);
  useImperativeHandle(forwarded, () => ref.current as UuInputRef);
  const [focused, setFocused] = useState(false);
  const is = useInputStyle(disabled);
  return (
    <Labeled label={label} requirement={requirement} tooltip={tooltip} error={error} errorMessage={errorMessage} helperText={helperText} disabled={disabled}>
      <UuFieldShell focused={focused} error={error} disabled={disabled} onPress={() => ref.current?.focus()}>
        {prefixIcon && <UuIcon name={prefixIcon} size={z.fieldIcon} color={c.objectSecondary} />}
        {prefixLabel && <Text style={[text.body, { color: c.objectPrimary }]}>{prefixLabel}</Text>}
        <TextInput ref={ref} accessibilityLabel={label} accessibilityHint={helperText} {...input} {...is} editable={!disabled} onFocus={(e) => { setFocused(true); onFocus?.(e); }} onBlur={(e) => { setFocused(false); onBlur?.(e); }} />
        {actionLabel && (
          <View style={{ paddingLeft: gap.g2, borderLeftWidth: 1, borderLeftColor: c.borderMuted }}>
            <UuTextButton label={actionLabel} tone="neutral" type="ghost" size="small" onPress={onAction} state={disabled ? 'disabled' : 'normal'} />
          </View>
        )}
      </UuFieldShell>
    </Labeled>
  );
});

export interface UuSearchInputProps {
  value: string;
  onChangeText: (v: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  onSubmit?: (v: string) => void;
  onClear?: () => void;
  clearLabel?: string;
  /** `State=Loading`: đang chờ gợi ý. Chỉ hiện khi ô có chữ; spinner 16 thay chỗ nút xoá, viền như Typing. */
  loading?: boolean;
  /** Thiết kế `Cancel` (mobile, màn tìm kiếm riêng): nút "Huỷ" Ghost Small bên phải — xoá chữ, bỏ focus, gọi onCancel. */
  cancel?: boolean;
  cancelLabel?: string;
  onCancel?: () => void;
  /** Nhóm "Tìm gần đây" — hiện khi ô rỗng và đang focus. */
  recent?: string[];
  /** Nhóm "Gợi ý" — hiện khi đang gõ và không loading. */
  suggestions?: string[];
  onSelectSuggestion?: (v: string) => void;
  /** Nút `xmark` cuối hàng "Tìm gần đây": xoá đúng mục đó, panel vẫn mở. */
  onRemoveRecent?: (v: string) => void;
  /** Nút "Xoá" của nhóm "Tìm gần đây". */
  onClearRecent?: () => void;
}

/**
 * SearchInput (§6.3g): khung Field, `magnifier` 24 cố định bên trái, nút xoá `circle-xmark` 16 (vùng chạm 32) khi có chữ.
 * Không có Error. Có `recent` / `suggestions` thì ô tự neo panel gợi ý ngay dưới (cùng bề rộng, cách 4).
 */
export function UuSearchInput({ value, onChangeText, label, placeholder = 'Tìm kiếm', disabled = false, onSubmit, onClear, clearLabel = 'Xoá từ khoá', loading = false, cancel = false, cancelLabel = 'Huỷ', onCancel, recent, suggestions, onSelectSuggestion, onRemoveRecent, onClearRecent }: UuSearchInputProps) {
  const { colors: c, sizes: z } = useUu();
  const ref = useRef<ComponentRef<typeof TextInput>>(null);
  const [focused, setFocused] = useState(false);
  const [panel, setPanel] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(blurTimer.current), []);
  const is = useInputStyle(disabled);
  const filled = value.length > 0;
  const busy = loading && filled && !disabled;
  const clear = () => {
    onChangeText('');
    onClear?.();
  };
  const field = (
    <UuFieldShell focused={focused || busy} disabled={disabled} onPress={() => ref.current?.focus()}>
      <UuIcon name="magnifier" size={z.fieldIcon} color={disabled ? c.objectDisabled : c.objectSecondary} />
      <TextInput
        ref={ref}
        {...is}
        value={value}
        onChangeText={(v) => {
          setPanel(true);
          onChangeText(v);
        }}
        onSubmitEditing={(e) => onSubmit?.(e.nativeEvent.text)}
        returnKeyType="search"
        // Gợi ý do SearchInput tự hiện — tắt thanh tự điền (danh bạ, địa chỉ) của iOS / Android.
        autoComplete="off"
        textContentType="none"
        autoCorrect={false}
        editable={!disabled}
        placeholder={placeholder}
        accessibilityLabel={label ?? placeholder}
        onFocus={() => {
          clearTimeout(blurTimer.current);
          setFocused(true);
          setPanel(true);
        }}
        // Trễ một nhịp để bấm vào hàng gợi ý kịp chạy trước khi panel đóng.
        onBlur={() => {
          setFocused(false);
          blurTimer.current = setTimeout(() => setPanel(false), 150);
        }}
      />
      {busy ? (
        <View style={{ width: size.s8, height: size.s8, alignItems: 'center', justifyContent: 'center' }}>
          <UuSpinner size={size.s4} color={c.objectSecondary} />
        </View>
      ) : filled && !disabled ? (
        <Pressable onPress={clear} accessibilityRole="button" accessibilityLabel={clearLabel} style={{ width: size.s8, height: size.s8, alignItems: 'center', justifyContent: 'center' }}>
          <UuIcon name="circle-xmark" size={16} color={c.objectSecondary} />
        </Pressable>
      ) : null}
    </UuFieldShell>
  );
  const hasPanel = recent !== undefined || suggestions !== undefined;
  const hasContent = !busy && searchHasContent(value, recent, suggestions);
  const refocus = () => {
    clearTimeout(blurTimer.current);
    ref.current?.focus();
  };
  const anchored = hasPanel ? (
    <UuMenuAnchor
      inline
      open={panel && hasContent && !disabled}
      onClose={() => setPanel(false)}
      menu={
        <UuSearchSuggestions
          query={value}
          recent={recent}
          suggestions={suggestions}
          onSelect={(v) => {
            setPanel(false);
            onSelectSuggestion?.(v);
          }}
          onRemoveRecent={onRemoveRecent && ((v) => { onRemoveRecent(v); refocus(); })}
          onClearRecent={onClearRecent && (() => { onClearRecent(); refocus(); })}
        />
      }
    >
      {field}
    </UuMenuAnchor>
  ) : (
    field
  );
  return (
    <Labeled label={label} disabled={disabled}>
      {cancel ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: gap.g2 }}>
          <View style={{ flex: 1 }}>{anchored}</View>
          <UuTextButton
            label={cancelLabel}
            tone="neutral"
            type="ghost"
            size="small"
            state={disabled ? 'disabled' : 'normal'}
            onPress={() => {
              setPanel(false);
              if (filled) clear();
              ref.current?.blur();
              onCancel?.();
            }}
          />
        </View>
      ) : (
        anchored
      )}
    </Labeled>
  );
}

const searchHasContent = (query: string, recent: string[] = [], suggestions: string[] = []) => (query.trim() ? suggestions.length > 0 : recent.length > 0);

/**
 * Panel gợi ý / lịch sử của SearchInput (§6.3g): ô rỗng → "Tìm gần đây" (icon `clock`, nút "Xoá", `xmark` từng mục);
 * đang gõ → "Gợi ý" (icon `magnifier`, phần trùng từ khoá in 600). Không có gì → không vẽ.
 * `flat`: màn tìm kiếm toàn màn trên mobile — không bo, không bóng.
 */
export function UuSearchSuggestions({ query, recent = [], suggestions = [], onSelect, onClearRecent, onRemoveRecent, flat = false, recentTitle = 'Tìm gần đây', suggestionsTitle = 'Gợi ý', clearRecentLabel = 'Xoá' }: { query: string; recent?: string[]; suggestions?: string[]; onSelect?: (v: string) => void; onClearRecent?: () => void; onRemoveRecent?: (v: string) => void; flat?: boolean; recentTitle?: string; suggestionsTitle?: string; clearRecentLabel?: string }) {
  if (!searchHasContent(query, recent, suggestions)) return null;
  const typing = query.trim().length > 0;
  const items = typing ? suggestions : recent;
  return (
    <UuMenuPanel flat={flat}>
      <UuMenuSection
        title={typing ? suggestionsTitle : recentTitle}
        trailing={!typing && onClearRecent ? <UuTextButton label={clearRecentLabel} tone="neutral" type="ghost" size="small" onPress={onClearRecent} /> : undefined}
      />
      {items.map((it) => (
        <UuMenuItem
          key={it}
          label={it}
          icon={typing ? 'magnifier' : 'clock'}
          highlight={typing ? query : undefined}
          trailing={!typing && onRemoveRecent ? <UuIconButton icon="xmark" label={`Xoá “${it}”`} tone="neutral" type="ghost" size="small" onPress={() => onRemoveRecent(it)} /> : undefined}
          onPress={() => onSelect?.(it)}
        />
      ))}
    </UuMenuPanel>
  );
}

export interface UuTextAreaProps extends Omit<TextInputProps, 'style' | 'editable' | 'multiline'> {
  label?: string;
  requirement?: UuRequirement;
  tooltip?: string;
  maxLength?: number;
  error?: boolean;
  errorMessage?: string;
  /** Thiết kế `Helper text`: dòng gợi ý dưới label, trên ô. Có lỗi vẫn hiện; dòng lỗi nằm dưới ô. */
  helperText?: string;
  disabled?: boolean;
}

/** TextArea (§6.3e): Field dọc cao 112, padding 12, chữ bám mép trên, bộ đếm (n/max) caption góc phải dưới. */
export const UuTextArea = forwardRef<UuInputRef, UuTextAreaProps>(function UuTextArea({ label, requirement, tooltip, maxLength = 100, error = false, errorMessage, helperText, disabled = false, value, defaultValue, onChangeText, onFocus, onBlur, ...input }, forwarded) {
  const { colors: c, text } = useUu();
  const ref = useRef<UuInputRef>(null);
  useImperativeHandle(forwarded, () => ref.current as UuInputRef);
  const [focused, setFocused] = useState(false);
  const [inner, setInner] = useState(defaultValue ?? '');
  const v = value ?? inner;
  const is = useInputStyle(disabled);
  return (
    <Labeled label={label} requirement={requirement} tooltip={tooltip} error={error} errorMessage={errorMessage} helperText={helperText} disabled={disabled}>
      <UuFieldShell multiline height={size.s28} focused={focused} error={error} disabled={disabled} onPress={() => ref.current?.focus()}>
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          accessibilityHint={helperText}
          {...input}
          {...is}
          multiline
          textAlignVertical="top"
          value={v}
          maxLength={maxLength}
          onChangeText={(t) => {
            setInner(t);
            onChangeText?.(t);
          }}
          editable={!disabled}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        />
        <Text style={[text.caption, { alignSelf: 'flex-end', color: disabled ? c.objectDisabled : c.objectSecondary }]}>({[...v].length}/{maxLength})</Text>
      </UuFieldShell>
    </Labeled>
  );
});

export interface UuOTPInputProps {
  value: string;
  onChange: (v: string) => void;
  length?: number;
  /** Thiết kế `Masked`: số đã nhập hiện thành chấm 8. */
  masked?: boolean;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  onComplete?: (v: string) => void;
  autoFocus?: boolean;
}

/**
 * OTPInput (§6.3b): 6 ô cao 48 gap 8, ô rỗng "-", con trỏ 2×24 object-accent nhấp nháy, Masked → chấm 8,
 * Error → cả 6 ô viền đỏ, chữ ở lại, dòng lỗi căn giữa. Một TextInput trong suốt phủ lên nhận bàn phím số + autofill mã.
 */
export function UuOTPInput({ value, onChange, length = 6, masked = false, error = false, errorMessage, disabled = false, onComplete, autoFocus }: UuOTPInputProps) {
  const { colors: c, sizes: z, text, outerShadow, restBorder } = useUu();
  const [focused, setFocused] = useState(false);
  const blink = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!focused) return;
    const a = Animated.loop(Animated.sequence([Animated.timing(blink, { toValue: 1, duration: 0, useNativeDriver: true }), Animated.delay(500), Animated.timing(blink, { toValue: 0, duration: 0, useNativeDriver: true }), Animated.delay(500)]));
    a.start();
    return () => a.stop();
  }, [focused, blink]);
  const digits = value.replace(/\D/g, '').slice(0, length);
  const caret = Math.min(digits.length, length - 1);
  return (
    <Labeled error={error} errorMessage={errorMessage} centerError>
      <View>
        <View style={{ flexDirection: 'row', gap: gap.g2 }}>
          {Array.from({ length }, (_, i) => {
            const ch = digits[i];
            const isCaret = focused && !error && i === caret && digits.length < length;
            return (
              <View key={i} style={{ flex: 1, minWidth: z.fieldOtpMinWidth, maxWidth: z.fieldHeight, height: z.fieldHeight, borderRadius: z.fieldRadius, borderWidth: 1, borderColor: error ? c.borderNegative : isCaret ? c.borderEmphasized : disabled ? c.borderMuted : restBorder(c.borderMuted), backgroundColor: disabled ? c.backgroundDisabled : c.backgroundSurface, alignItems: 'center', justifyContent: 'center', boxShadow: outerShadow }}>
                {ch === undefined ? (
                  <Text style={[text.body, { color: disabled ? c.objectDisabled : c.objectSecondary }]}>-</Text>
                ) : masked ? (
                  <View style={{ width: size.s2, height: size.s2, borderRadius: size.s2 / 2, backgroundColor: c.objectPrimary }} />
                ) : (
                  <Text style={[text.body, { color: c.objectPrimary }]}>{ch}</Text>
                )}
                {isCaret && <Animated.View style={{ position: 'absolute', left: gap.g3, width: 2, height: size.s6, backgroundColor: c.objectAccent, opacity: blink }} />}
              </View>
            );
          })}
        </View>
        <TextInput
          value={digits}
          onChangeText={(t) => {
            const d = t.replace(/\D/g, '').slice(0, length);
            onChange(d);
            if (d.length === length) onComplete?.(d);
          }}
          editable={!disabled}
          autoFocus={autoFocus}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          maxLength={length}
          caretHidden
          accessibilityLabel="Mã OTP"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.011, color: 'transparent' }}
        />
      </View>
    </Labeled>
  );
}

/** Định dạng `DD/MM/YYYY` cho DateInput. */
export const formatDateVN = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

function SelectField({ label, disabled = false, error = false, errorMessage, text: shown, filled, filledBold, icon, iconSize, onPress, wrap }: { label?: string; disabled?: boolean; error?: boolean; errorMessage?: string; text: string; filled: boolean; filledBold: boolean; icon: UuIconName; iconSize: number; onPress?: () => void; wrap?: (f: ReactNode) => ReactNode }) {
  const { colors: c, text } = useUu();
  const color = filled ? c.objectPrimary : disabled ? c.objectDisabled : c.objectSecondary;
  const field = (
    <View accessible accessibilityRole="button" accessibilityLabel={label} accessibilityValue={{ text: shown }} accessibilityState={{ disabled }}>
      <UuFieldShell disabled={disabled} error={error} onPress={onPress}>
        {/* gợi ý rỗng: body 400 secondary · giá trị: Dropdown label 600 · DateInput body 400 */}
        <Text numberOfLines={1} style={[filled && filledBold ? text.label : text.body, { flex: 1, color }]}>{shown}</Text>
        <UuIcon name={icon} size={iconSize} color={disabled ? c.objectDisabled : c.objectSecondary} />
      </UuFieldShell>
    </View>
  );
  return (
    <Labeled label={label} error={error} errorMessage={errorMessage} disabled={disabled}>
      {wrap ? wrap(field) : field}
    </Labeled>
  );
}

/**
 * DateInput (§6.3c): ô "chọn" ngày — chạm mở date picker, không gõ tay. Hiển thị `DD/MM/YYYY`, body 400.
 * Gói không kèm picker: truyền `onOpen` và mở picker của app (vd. `@react-native-community/datetimepicker`), rồi đặt `value`.
 */
export function UuDateInput({ label, value, placeholder = 'Bấm để chọn', onOpen, error, errorMessage, disabled }: { label?: string; value?: Date | null; placeholder?: string; onOpen?: () => void; error?: boolean; errorMessage?: string; disabled?: boolean }) {
  const { sizes: z } = useUu();
  return <SelectField label={label} disabled={disabled} error={error} errorMessage={errorMessage} text={value ? formatDateVN(value) : placeholder} filled={!!value} filledBold={false} icon="calendar-days" iconSize={z.fieldIcon} onPress={onOpen} />;
}

/**
 * Dropdown (§6.4): ô "chọn" với `chevron-down` 16. Danh sách bung ra là `UuMenu`: truyền `menu` + `open` để ô
 * tự neo panel dưới mình (cách 4, rộng bằng ô, lật khi thiếu chỗ); hoặc dùng `onOpen` mở sheet rồi trả value.
 */
export function UuDropdown({ label, value, placeholder = 'Bấm để chọn', onOpen, menu, open = false, onClose, error, errorMessage, disabled = false }: { label?: string; value?: string | null; placeholder?: string; onOpen?: () => void; menu?: ReactNode; open?: boolean; onClose?: () => void; error?: boolean; errorMessage?: string; disabled?: boolean }) {
  const filled = !!value;
  return (
    <SelectField
      label={label}
      disabled={disabled}
      error={error}
      errorMessage={errorMessage}
      text={filled ? value! : placeholder}
      filled={filled}
      filledBold
      icon="chevron-down"
      iconSize={16}
      onPress={onOpen}
      wrap={menu ? (f) => <UuMenuAnchor open={open && !disabled} onClose={onClose} menu={menu}>{f}</UuMenuAnchor> : undefined}
    />
  );
}
