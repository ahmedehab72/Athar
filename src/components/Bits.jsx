/** A value the brand has not supplied yet. Shown on purpose, never disguised as real data. */
export function Placeholder({ value }) {
  if (!value?.placeholder) return value ?? null;
  return (
    <span className="ph" title="قيمة مؤقتة، تُستبدل قبل الإطلاق">
      [{value.label}]
    </span>
  );
}

/** One shot of the film: a full-height section the camera holds on. */
export function Shot({ children, align = 'start', className = '', ...rest }) {
  return (
    <section className={`shot shot--${align} ${className}`} data-shot {...rest}>
      {children}
    </section>
  );
}

/** Museum-plate text block. Heading first, catalogue line beneath it. */
export function Plate({ as: H = 'h2', title, meta, children, wide = false }) {
  return (
    <div className={`plate reveal${wide ? ' plate--wide' : ''}`}>
      <H className="plate__title">{title}</H>
      {meta && <p className="plate__meta">{meta}</p>}
      <div className="plate__body">{children}</div>
    </div>
  );
}
