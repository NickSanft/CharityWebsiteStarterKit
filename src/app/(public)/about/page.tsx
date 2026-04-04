import { Metadata } from 'next';
import { Eye, Users, TrendingUp, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'About',
};

const values = [
  {
    icon: Eye,
    title: 'Transparency',
    description:
      'We believe in open communication and accountability. Every dollar donated and every hour volunteered is tracked and reported so our community can see the impact of their generosity.',
  },
  {
    icon: Users,
    title: 'Community',
    description:
      'We are rooted in the belief that meaningful change happens when people come together. Our programs are built on collaboration, mutual respect, and shared purpose.',
  },
  {
    icon: TrendingUp,
    title: 'Impact',
    description:
      'We measure everything we do by the real difference it makes. From the number of families served to the long-term outcomes of our programs, impact drives every decision.',
  },
  {
    icon: ShieldCheck,
    title: 'Inclusion',
    description:
      'We are committed to creating spaces where everyone feels welcome and valued. Our programs are designed to be accessible and equitable, regardless of background or circumstance.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            About Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
            Learn about our story, our mission, and the values that guide
            everything we do.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold tracking-tight">Our Story</h2>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Founded with a simple belief that everyone deserves the opportunity
              to thrive, our organization has grown from a small community
              initiative into a force for positive change. What started as a
              handful of dedicated volunteers has become a vibrant network of
              supporters, donors, and advocates united by a shared vision.
            </p>
            <p>
              Over the years, we have expanded our programs to address the most
              pressing needs in our community. From educational support and
              mentorship to emergency assistance and long-term development, our
              work touches lives at every stage. We believe that sustainable change
              comes not from quick fixes, but from investing in people and
              empowering them to build a better future.
            </p>
            <p>
              Our approach is grounded in partnership. We work alongside the
              communities we serve, listening to their needs and co-creating
              solutions that are both effective and respectful. By combining
              grassroots knowledge with professional expertise, we are able to
              deliver programs that truly make a difference.
            </p>
          </div>

          <h2 className="mt-16 text-3xl font-bold tracking-tight">
            Our Mission
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Our mission is to empower individuals and strengthen communities
              through education, resources, and compassionate support. We envision
              a world where every person has access to the tools and opportunities
              they need to lead a fulfilling life.
            </p>
            <p>
              We pursue this mission through a range of programs and initiatives,
              all guided by evidence-based practices and a deep commitment to
              equity. Every decision we make is informed by the communities we
              serve, ensuring our work remains relevant, responsive, and
              impactful.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="border-t bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-4 text-muted-foreground">
              These core values shape our culture, guide our decisions, and define
              who we are as an organization.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {values.map((value) => (
              <Card key={value.title}>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="mt-4 text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
