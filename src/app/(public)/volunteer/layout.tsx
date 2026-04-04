import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Volunteer',
};

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
