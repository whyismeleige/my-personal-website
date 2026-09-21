export function SectionHeading({ children, id }: { children: React.ReactNode; id?: string }) {
  return <h2 id={id} className="eyebrow">{children}</h2>;
}
