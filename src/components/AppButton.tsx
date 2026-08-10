import Button from '@mui/material/Button';
import type { ComponentProps } from 'react';

type AppButtonProps = ComponentProps<typeof Button> & {
  loading?: boolean;
};

export default function AppButton({
  children,
  variant = 'contained',
  loading = false,
  disabled = false,
  ...rest
}: AppButtonProps) {
  return (
    <Button variant={variant} disabled={disabled || loading} {...rest}>
      {loading ? 'Loading…' : children}
    </Button>
  );
}
