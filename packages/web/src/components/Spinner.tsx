import type { HTMLAttributes } from 'react';

/** `.loading` (mục 6.12): spinner 18×18, gradient quét, màu kế thừa từ text color của nút. */
export function Spinner({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={['uu-spinner', className].filter(Boolean).join(' ')} role="status" aria-label="Đang xử lý" {...rest} />;
}
