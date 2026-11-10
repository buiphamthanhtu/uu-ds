import './Pagination.css';

export type PaginationPosition = 'begin' | 'middle' | 'end';

export interface PaginationProps {
  /** CHỈ ba vị trí: gạch dài ở slick 1 (begin), 3 (middle) hay 5 (end). Không mô hình hoá "trang 2/5". */
  position: PaginationPosition;
  className?: string;
}

/** Hàng gạch chỉ vị trí trong băng chuyền. Bề RỘNG là tín hiệu chính, màu chỉ phụ. */
export function Pagination({ position, className }: PaginationProps) {
  const active = { begin: 0, middle: 2, end: 4 }[position];
  return (
    <div className={['uu-pagination', className].filter(Boolean).join(' ')} role="img" aria-label={{ begin: 'Đầu băng chuyền', middle: 'Giữa băng chuyền', end: 'Cuối băng chuyền' }[position]}>
      {Array.from({ length: 5 }, (_, i) => <span key={i} className={['uu-pagination__slick', i === active && 'uu-pagination__slick--active'].filter(Boolean).join(' ')} />)}
    </div>
  );
}
