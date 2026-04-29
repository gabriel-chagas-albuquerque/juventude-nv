import { Studio } from 'sanity';
import config from '../../sanity.config';

export default function StudioPage() {
  return (
    <div className="h-screen w-full bg-white fixed inset-0 z-[9999] overflow-auto">
      <Studio config={config} />
    </div>
  );
}
