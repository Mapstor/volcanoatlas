import Link from 'next/link';

export const metadata = {
  title: 'Terms of Use | VolcanoAtlas',
  description: 'Terms of use for VolcanoAtlas - The comprehensive encyclopedia of Earth\'s volcanoes.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-volcanic-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-volcanic-900 to-volcanic-950 py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-volcanic-400 mb-6">
            <Link href="/" className="hover:text-lava">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Terms of Use</span>
          </nav>
          
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Terms of Use
          </h1>
          <p className="text-xl text-volcanic-400">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 text-volcanic-300">
          <div className="prose prose-invert max-w-none">
            <h2 className="font-display text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4 leading-relaxed">
              By accessing and using VolcanoAtlas ("the Website"), you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="font-display text-2xl font-bold text-white mb-4 mt-8">2. Use License</h2>
            <p className="mb-4 leading-relaxed">
              Permission is granted to temporarily access the materials on VolcanoAtlas for personal, non-commercial transitory viewing only. 
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Modify or copy the materials without proper attribution</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on VolcanoAtlas</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-white mb-4 mt-8">3. Educational Use</h2>
            <p className="mb-4 leading-relaxed">
              VolcanoAtlas is designed for educational purposes. Teachers, students, and researchers are encouraged to use our content for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Classroom presentations and educational materials</li>
              <li>Academic research and papers (with proper citation)</li>
              <li>Personal learning and exploration</li>
              <li>Non-commercial educational projects</li>
            </ul>
            <p className="mb-4 leading-relaxed">
              When using our content for educational purposes, please cite VolcanoAtlas and include a link to the relevant page.
            </p>

            <h2 className="font-display text-2xl font-bold text-white mb-4 mt-8">4. Data Sources and Accuracy</h2>
            <p className="mb-4 leading-relaxed">
              The volcanic data presented on VolcanoAtlas is sourced from the Smithsonian Institution's Global Volcanism Program and other 
              reputable scientific sources. While we strive for accuracy, volcanic science is constantly evolving, and information may change. 
              We make no warranties about the completeness, reliability, or accuracy of this information.
            </p>

            <h2 className="font-display text-2xl font-bold text-white mb-4 mt-8">5. Third-Party Content</h2>
            <p className="mb-4 leading-relaxed">
              VolcanoAtlas may contain links to third-party websites and content from external sources including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Images from Unsplash and other photo services</li>
              <li>Scientific data from research institutions</li>
              <li>Links to external educational resources</li>
            </ul>
            <p className="mb-4 leading-relaxed">
              We are not responsible for the content, privacy policies, or practices of third-party sites or services.
            </p>

            <h2 className="font-display text-2xl font-bold text-white mb-4 mt-8">6. User Conduct</h2>
            <p className="mb-4 leading-relaxed">
              Users of VolcanoAtlas agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Use the website for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any portion of the website</li>
              <li>Interfere with or disrupt the website or servers</li>
              <li>Scrape or harvest data using automated means without permission</li>
              <li>Misrepresent the source or ownership of content from VolcanoAtlas</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-white mb-4 mt-8">7. Disclaimer</h2>
            <p className="mb-4 leading-relaxed">
              The materials on VolcanoAtlas are provided on an 'as is' basis. VolcanoAtlas makes no warranties, expressed or implied, 
              and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of 
              merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2 className="font-display text-2xl font-bold text-white mb-4 mt-8">8. Limitations</h2>
            <p className="mb-4 leading-relaxed">
              In no event shall VolcanoAtlas or its suppliers be liable for any damages (including, without limitation, damages for loss of 
              data or profit, or due to business interruption) arising out of the use or inability to use the materials on VolcanoAtlas, 
              even if VolcanoAtlas or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>

            <h2 className="font-display text-2xl font-bold text-white mb-4 mt-8">9. Modifications</h2>
            <p className="mb-4 leading-relaxed">
              VolcanoAtlas may revise these terms of use at any time without notice. By using this website, you are agreeing to be bound 
              by the then current version of these terms of service. We will indicate the date of last update at the top of this page.
            </p>

            <h2 className="font-display text-2xl font-bold text-white mb-4 mt-8">10. Contact Information</h2>
            <p className="mb-4 leading-relaxed">
              If you have any questions about these Terms of Use, please contact us at:
            </p>
            <p className="mb-4">
              Email: <a href="mailto:info@volcanosatlas.com" className="text-lava hover:text-lava-dark">info@volcanosatlas.com</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}