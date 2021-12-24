interface EquationProps {
  equation: string;
  href: string | null;
}
export const Equation = (props: EquationProps) => {
  const { equation, href } = props;
  if (!href) return <>{equation}</>;
  return (
    <>
      <a href={href}>{equation}</a>
    </>
  );
};
