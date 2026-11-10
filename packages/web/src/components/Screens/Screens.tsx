import type { HTMLAttributes, ReactNode } from 'react';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup';
import { NavigationBar } from '../NavigationBar/NavigationBar';
import './Screens.css';

/** Ảnh minh hoạ trong ô tròn 128. Ảnh là nội dung → `alt` bắt buộc khi có ảnh. */
export interface ScreenIllustration {
  src: string;
  alt: string;
}

/** Một nút duy nhất của màn / khối rỗng và lỗi (TextButtonAccent Solid Large qua `ButtonGroup`). */
export interface ScreenAction {
  label: ReactNode;
  onClick?: () => void;
}

interface StateContentProps {
  /** Thiết kế: `Title` (TEXT). */
  title: ReactNode;
  /** Thiết kế: `Description` (TEXT). */
  description?: ReactNode;
  /** Ảnh minh hoạ. Bỏ trống thì ô tròn 128 nền `background-accent-muted` vẫn còn. */
  image?: ScreenIllustration;
}

function StateContent({ title, description, image, size, square }: StateContentProps & { size: 'section' | 'screen'; square?: boolean }) {
  const Heading = size === 'screen' ? 'h2' : 'h3';
  return (
    <div className="uu-state__content">
      {square
        ? image && <img className="uu-state__image uu-state__image--square" src={image.src} alt={image.alt} />
        : <div className="uu-state__image">{image && <img src={image.src} alt={image.alt} />}</div>}
      <Heading className={`uu-state__title uu-state__title--${size}`}>{title}</Heading>
      {description && <p className="uu-state__description">{description}</p>}
    </div>
  );
}

export interface EmptySectionProps extends StateContentProps, Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Thiết kế: `Action` (BOOLEAN) — một nút (tạo mới, khám phá). Bỏ trống để ẩn. */
  action?: ScreenAction;
}

/**
 * `EmptySection` (§6.19) — khối nhúng: một vùng trong màn chưa có dữ liệu (danh sách rỗng, thân bảng rỗng).
 * V · p 12 · g12 · căn giữa. Title `heading-sm`, Description `body`, cả hai `object-primary` căn giữa.
 */
export function EmptySection({ title, description, image, action, className, ...rest }: EmptySectionProps) {
  return (
    <div className={['uu-state', className].filter(Boolean).join(' ')} {...rest}>
      <StateContent title={title} description={description} image={image} size="section" />
      {action && <ButtonGroup className="uu-state__action" primary={action} />}
    </div>
  );
}

export interface ErrorSectionProps extends StateContentProps, Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Một nút thử lại — luôn có. */
  action: ScreenAction;
}

/**
 * `ErrorSection` (§6.19) — lỗi chỉ ở một khối, phần còn lại của màn vẫn dùng được. Cùng bố cục `EmptySection`,
 * luôn có một nút thử lại. Lỗi cả màn → `ErrorScreen`; lỗi sửa được ngay → `Dialog` / `Toast`.
 */
export function ErrorSection({ title, description, image, action, className, ...rest }: ErrorSectionProps) {
  return (
    <div role="alert" className={['uu-state', className].filter(Boolean).join(' ')} {...rest}>
      <StateContent title={title} description={description} image={image} size="section" />
      <ButtonGroup className="uu-state__action" primary={action} />
    </div>
  );
}

export interface EmptyScreenProps extends StateContentProps {
  /** Tiêu đề của `NavigationBar` (tên màn). */
  screenTitle: string;
  /** Thiết kế: `Back action=true` — màn rỗng vẫn là một màn bình thường, có nút back. */
  onBack: () => void;
  /** Thiết kế: `Action` (BOOLEAN) — một nút ở Footer. Bỏ trống để ẩn. */
  action?: ScreenAction;
  className?: string;
}

/**
 * `EmptyScreen` (§6.19) — template màn: cả màn chưa có dữ liệu. `NavigationBar` có back, Body FILL căn giữa
 * hai chiều (padding ngang 16), Footer HUG padding 16 chứa một nút. Title `heading-base`.
 * Cao bằng khung chứa (`height: 100%`). Home indicator do OS vẽ, code bỏ.
 */
export function EmptyScreen({ screenTitle, onBack, title, description, image, action, className }: EmptyScreenProps) {
  return (
    <div className={['uu-state-screen', className].filter(Boolean).join(' ')}>
      <NavigationBar title={screenTitle} onBack={onBack} />
      <div className="uu-state-screen__body">
        <StateContent title={title} description={description} image={image} size="screen" />
      </div>
      {action && (
        <div className="uu-state-screen__footer">
          <ButtonGroup layout="vertical" primary={action} />
        </div>
      )}
    </div>
  );
}

/** Body + Footer chung của `ResultScreen` · `ErrorScreen`: Body FILL căn giữa hai chiều (padding ngang 16) · Footer HUG padding 16. */
function ScreenBody({ className, role, children, footer }: { className?: string; role?: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className={['uu-state-screen', className].filter(Boolean).join(' ')}>
      <div className="uu-state-screen__body" role={role}>{children}</div>
      <div className="uu-state-screen__footer">{footer}</div>
    </div>
  );
}

export interface ResultScreenProps extends StateContentProps {
  /** Ảnh ô vuông **không nền** — ảnh do màn quyết, cần `alt`. */
  image?: ScreenIllustration;
  /** Nút chính (trên) — TextButtonAccent Solid Large. */
  primary: ScreenAction;
  /** Lối đi phụ (dưới, Outline). Bỏ trống để ẩn. */
  secondary?: ScreenAction;
  className?: string;
}

/**
 * `ResultScreen` (§6.19) — việc đã xong, người dùng phải sang chỗ khác (đặt phòng xong, thanh toán xong).
 * Chỉ dựng Body + Footer: ảnh ô vuông không nền · tiêu đề `heading-base` · mô tả `body` · `ButtonGroup` dọc —
 * nút chính trên, lối đi phụ dưới. `NavigationBar` (`Back action=false`) và safe area do màn đặt.
 */
export function ResultScreen({ title, description, image, primary, secondary, className }: ResultScreenProps) {
  return (
    <ScreenBody className={className} footer={<ButtonGroup layout="vertical" primary={primary} secondary={secondary} />}>
      <StateContent title={title} description={description} image={image} size="screen" square />
    </ScreenBody>
  );
}

export interface ErrorScreenProps extends StateContentProps {
  /** Đúng **một** nút thử lại — luôn có. */
  action: ScreenAction;
  className?: string;
}

/**
 * `ErrorScreen` (§6.19) — lỗi chặn cả chức năng cốt lõi, không tự khắc phục được. Chỉ dựng Body + Footer:
 * ảnh tròn 128 nền `background-accent-muted` · tiêu đề `heading-base` · mô tả `body` · **một** nút thử lại.
 * `NavigationBar` (`Back action=false`) và safe area do màn đặt. Lỗi một khối → `ErrorSection`; sửa được ngay → `Dialog` / `Toast`.
 */
export function ErrorScreen({ title, description, image, action, className }: ErrorScreenProps) {
  return (
    <ScreenBody className={className} role="alert" footer={<ButtonGroup layout="vertical" primary={action} />}>
      <StateContent title={title} description={description} image={image} size="screen" />
    </ScreenBody>
  );
}
