import { Icon } from '../../icons';

export interface FieldLabelProps {
  htmlFor?: string;
  id?: string;
  children: string;
  /** `.suffix` variant: Required → "∙ Bắt buộc", Optional → "∙ Không bắt buộc". */
  requirement?: 'required' | 'optional';
  /** Icon tooltip 16 (ẩn mặc định trong bản thiết kế). Tên icon `circle-info` là giả định — bản thiết kế không chỉ rõ. */
  tooltip?: string;
}

/** `.label` dùng chung cho mọi field: HORIZONTAL gap 8, h24, style body, object-primary. */
export function FieldLabel({ htmlFor, id, children, requirement, tooltip }: FieldLabelProps) {
  const Tag = htmlFor ? 'label' : 'div';
  return (
    <div className="uu-fieldlabel">
      <Tag className="uu-fieldlabel__text" htmlFor={htmlFor} id={id}>
        <span className="uu-fieldlabel__name">{children}</span>
        {requirement && (
          <span className="uu-fieldlabel__suffix">∙ {requirement === 'required' ? 'Bắt buộc' : 'Không bắt buộc'}</span>
        )}
      </Tag>
      {tooltip && <span className="uu-fieldlabel__tip" title={tooltip}><Icon name="circle-info" size={16} title={tooltip} /></span>}
    </div>
  );
}
