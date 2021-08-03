import JSXSlack from "jsx-slack";

// export const Bold = ({ children }) => {
export const Bold = (children: JSXSlack.JSX.Element) => {
  return <b>{children}</b>;
};
