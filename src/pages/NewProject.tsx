import { Navigate, useSearchParams } from 'react-router-dom';
import { OFFERS, SITE_NOVO } from '@/config/pricing';

/** Creating a new service starts at payment; business details belong to post-payment intake. */
export default function NewProject() {
  const [params] = useSearchParams();
  const tier = OFFERS.some(o => o.key === params.get('plan')) ? params.get('plan')! : SITE_NOVO.key;
  return <Navigate to={`/checkout?plan=${tier}`} replace />;
}
