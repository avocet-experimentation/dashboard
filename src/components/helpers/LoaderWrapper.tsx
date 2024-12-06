export function LoaderWrapper({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: React.ReactNode;
}) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{isLoading ? 'loading...' : children}</>;
}
