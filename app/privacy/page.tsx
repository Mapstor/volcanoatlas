import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | VolcanoAtlas',
  description: 'Privacy policy for VolcanoAtlas - How we collect, use, and protect your information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-volcanic-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-volcanic-900 to-volcanic-950 py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-volcanic-400 mb-6">
            <Link href="/" className="hover:text-lava">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Privacy Policy</span>
          </nav>
          
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
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
            <div className="bg-volcanic-900 border-l-4 border-lava p-6 rounded-r-xl mb-8">
              <p className="text-white font-semibold mb-2">Our Commitment</p>
              <p className="leading-relaxed">
                VolcanoAtlas is committed to protecting your privacy. We believe in transparency about how we collect and use data, 
                and we are dedicated to keeping your information safe.
              </p>
            </div>

            <h2 className="font-display text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            
            <h3 className="font-display text-xl font-semibold text-white mb-3 mt-6">1.1 Information You Provide</h3>
            <p className="mb-4 leading-relaxed">
              VolcanoAtlas is primarily an informational website that does not require user registration. We may collect information when you:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Contact us via email</li>
              <li>Subscribe to updates (if available)</li>
              <li>Report issues or provide feedback</li>
            </ul>

            <h3 className="font-display text-xl font-semibold text-white mb-3 mt-6">1.2 Automatically Collected Information</h3>
            <p className="mb-4 leading-relaxed">
              When you visit VolcanoAtlas, we may automatically collect certain information about your device and browsing behavior:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>IP address and general location (country/region level)</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website</li>
              <li>Date and time of visit</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-white mb-4 mt-8">2. How We Use Information</h2>
            <p className="mb-4 leading-relaxed">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>To provide and maintain our website</li>
              <li>To improve user experience and website functionality</li>
              <li>To analyze website usage and optimize content</li>
              <li>To respond to user inquiries and support requests</li>
              <li>To detect and prevent technical issues</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-white mb-4 mt-8">3. Analytics and Cookies</h2>
            <p className="mb-4 leading-relaxed">
              VolcanoAtlas may use analytics services to understand how visitors use our website. These services may use cookies and similar technologies to collect and analyze information such as:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Pages viewed and navigation patterns</li>
              <li>Time spent on the website</li>
              <li>Technical information about your device</li>
              <li>General geographic location</li>
            </ul>
            <p className="mb-4 leading-relaxed">
              You can control cookie settings through your browser preferences. Note that disabling cookies may affect some website functionality.
            </p>

            <h2 className="font-display text-2xl font-bold text-white mb-4 mt-8">4. Third-Party Services</h2>
            <p className="mb-4 leading-relaxed">
              VolcanoAtlas integrates with third-party services that may collect information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Unsplash API:</strong> For volcano images (does not collect personal data)</li>
              <li><strong>OpenStreetMap:</strong> For interactive maps (may log IP addresses)</li>
              <li><strong>External Links:</strong> Links to scientific sources and references</li>
            </ul>
            <p className="mb-4 leading-relaxed">
              These third-party services have their own privacy policies, and we encourage you to review them.
            </p>

            <h2 className="font-display text-2xl font-bold text-white mb-4 mt-8">5. Data Security</h2>
            <p className="mb-4 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your information against unauthorized access, 
              alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 
              100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="font-display text-2xl font-bold text-white mb-4 mt-8">6. Data Retention</h2>
            <p className="mb-4 leading-relaxed">
              We retain collected information for as long as necessary to fulfill the purposes outlined in this privacy policy, 
              unless a longer retention period is required by law. Analytics data is typically retained for 26 months.
            </p>

            <h2 className="font-display text-2xl font-bold text-white mb-4 mt-8">7. Children's Privacy</h2>
            <p className="mb-4 leading-relaxed">
              VolcanoAtlas is intended for general audiences and does not knowingly collect personal information from children under 13. 
              The website is designed to be educational and appropriate for all ages. If you believe we have inadvertently collected 
              information from a child under 13, please contact us immediately.
            </p>

            <h2 className="font-display text-2xl font-bold text-white mb-4 mt-8">8. Your Rights</h2>
            <p className="mb-4 leading-relaxed">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Right to access your personal information</li>
              <li>Right to correct inaccurate information</li>
              <li>Right to request deletion of your information</li>
              <li>Right to object to processing</li>
              <li>Right to data portability</li>
            </ul>
            <p className="mb-4 leading-relaxed">
              To exercise these rights, please contact us using the information provided below.
            </p>

            <h2 className="font-display text-2xl font-bold text-white mb-4 mt-8">9. International Data Transfers</h2>
            <p className="mb-4 leading-relaxed">
              VolcanoAtlas is accessible worldwide. If you access our website from outside the United States, please be aware that 
              your information may be transferred to, stored, and processed in the United States or other countries.
            </p>

            <h2 className="font-display text-2xl font-bold text-white mb-4 mt-8">10. Changes to This Policy</h2>
            <p className="mb-4 leading-relaxed">
              We may update this privacy policy from time to time to reflect changes in our practices or for legal, operational, 
              or regulatory reasons. We will notify you of any material changes by posting the new privacy policy on this page 
              and updating the "Last updated" date.
            </p>

            <h2 className="font-display text-2xl font-bold text-white mb-4 mt-8">11. Contact Us</h2>
            <p className="mb-4 leading-relaxed">
              If you have questions, concerns, or requests regarding this privacy policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-volcanic-900 p-6 rounded-xl">
              <p className="mb-2">
                <strong className="text-white">Email:</strong>{' '}
                <a href="mailto:info@volcanoatlas.com" className="text-lava hover:text-lava-dark">info@volcanoatlas.com</a>
              </p>
              <p className="mb-2">
                <strong className="text-white">Website:</strong>{' '}
                <Link href="/" className="text-lava hover:text-lava-dark">www.volcanoatlas.com</Link>
              </p>
            </div>

            <div className="mt-8 p-4 bg-volcanic-900 border border-volcanic-700 rounded-lg">
              <p className="text-sm text-volcanic-400">
                This privacy policy is effective as of the date stated at the top of this page. We encourage you to review this 
                policy periodically to stay informed about how we protect your information.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}