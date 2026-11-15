import Link from 'next/link';
import { pageMeta } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Contact VolcanoAtlas',
  description: 'How to reach VolcanoAtlas with a question, a correction or feedback.',
  path: '/contact',
});

const linkClass = 'text-lava hover:text-lava-light underline';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-volcanic-950">
      <section className="bg-gradient-to-b from-volcanic-900 to-volcanic-950 py-16 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-sm text-volcanic-400 mb-6">
            <Link href="/" className="hover:text-lava">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Contact</span>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Contact VolcanoAtlas</h1>
          <p className="text-xl text-volcanic-300">Questions, corrections and feedback are welcome.</p>
        </div>
      </section>

      <section className="py-12 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-10 text-lg text-volcanic-200 leading-relaxed">
          <div className="bg-volcanic-900 border border-volcanic-700 rounded-xl p-6">
            <h2 className="font-display text-2xl font-bold text-white mb-2">Email</h2>
            <a href="mailto:info@volcanosatlas.com" className={`${linkClass} text-xl break-all`}>
              info@volcanosatlas.com
            </a>
          </div>

          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">Reporting a mistake</h2>
            <p>
              Send the address of the page and say what is wrong. A link to a source that shows the right figure helps us
              fix it faster.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">Volcano emergencies</h2>
            <p>
              VolcanoAtlas cannot help in an emergency and does not issue warnings. Contact your local emergency services
              and follow your volcano observatory and civil protection authority.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">Your privacy</h2>
            <p>
              When you write to us, we use your email address only to answer you. We do not share it with third parties or
              use it for marketing. Details are in the <Link href="/privacy" className={linkClass}>privacy policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
