import { Badge } from '@/components/ui/badge';
import { ListingStatus } from '@/types';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ListingStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const configs = {
    pending: {
      label: 'Pending',
      variant: 'outline' as const,
      icon: Clock,
      className: 'border-warning text-warning',
    },
    approved: {
      label: 'Approved',
      variant: 'outline' as const,
      icon: CheckCircle2,
      className: 'border-success text-success',
    },
    rejected: {
      label: 'Rejected',
      variant: 'outline' as const,
      icon: XCircle,
      className: 'border-destructive text-destructive',
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
