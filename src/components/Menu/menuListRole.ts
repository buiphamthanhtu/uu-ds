import { createContext } from 'react';

/**
 * Nội bộ, không xuất ra gói: vai của khối danh sách trong `Menu`.
 * `listbox` (mặc định): chọn giá trị, hàng là option. `list`: hàng là nút hành động và có nút phụ trong hàng
 * (listbox chỉ được chứa option, WCAG 1.3.1). Dùng cho nhóm "Tìm gần đây" của SearchInput (spec 6.3g).
 */
export const MenuListRoleContext = createContext<'listbox' | 'list'>('listbox');
