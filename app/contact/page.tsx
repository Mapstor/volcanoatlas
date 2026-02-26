import Link from 'next/link';

export const metadata = {
  title: 'Contact Us | VolcanoAtlas',
  description: 'Get in touch with VolcanoAtlas - Contact us for questions, feedback, or educational collaborations.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-volcanic-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-volcanic-900 to-volcanic-950 py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-volcanic-400 mb-6">
            <Link href="/" className="hover:text-lava">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Contact</span>
          </nav>
          
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">
            Contact Us
          </h1>
          <p className="text-2xl text-lava font-display">
            We'd Love to Hear From You
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-volcanic-200 leading-relaxed mb-12">
              Whether you have questions about volcanic data, suggestions for improving VolcanoAtlas, 
              or are interested in educational collaborations, we're here to help. Your feedback helps 
              us improve and expand our educational mission.
            </p>

            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-volcanic-900 border border-volcanic-700 rounded-xl p-8">
                <div className="text-lava mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="font-display text-2xl font-bold text-white mb-4">Email Us</h2>
                <p className="text-volcanic-300 mb-4">
                  For general inquiries, feedback, or support:
                </p>
                <a href="mailto:info@volcanoatlas.com" 
                   className="text-lava hover:text-lava-dark font-semibold text-lg transition-colors">
                  info@volcanoatlas.com
                </a>
              </div>

              <div className="bg-volcanic-900 border border-volcanic-700 rounded-xl p-8">
                <div className="text-lava mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="font-display text-2xl font-bold text-white mb-4">Educational Inquiries</h2>
                <p className="text-volcanic-300 mb-4">
                  For educational partnerships and resources:
                </p>
                <a href="mailto:education@volcanoatlas.com" 
                   className="text-lava hover:text-lava-dark font-semibold text-lg transition-colors">
                  education@volcanoatlas.com
                </a>
              </div>
            </div>

            {/* Common Topics */}
            <div className="bg-gradient-to-r from-volcanic-900 to-volcanic-950 border border-volcanic-700 rounded-xl p-8 mb-12">
              <h2 className="font-display text-3xl font-bold text-white mb-6">How Can We Help?</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-semibold text-lava mb-3">General Questions</h3>
                  <p className="text-volcanic-300 leading-relaxed">
                    Have questions about specific volcanoes, our data sources, or how to use VolcanoAtlas? 
                    We're happy to provide additional information and guidance.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-xl font-semibold text-lava mb-3">Educational Resources</h3>
                  <p className="text-volcanic-300 leading-relaxed">
                    Teachers and educators can contact us for guidance on using VolcanoAtlas in the classroom, 
                    including lesson plan ideas and educational materials.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-xl font-semibold text-lava mb-3">Report Issues</h3>
                  <p className="text-volcanic-300 leading-relaxed">
                    Found an error or technical issue? Please let us know so we can investigate and fix it promptly. 
                    Include as much detail as possible about the problem.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-xl font-semibold text-lava mb-3">Suggestions & Feedback</h3>
                  <p className="text-volcanic-300 leading-relaxed">
                    Your feedback helps us improve! Share your ideas for new features, additional volcanoes to cover, 
                    or ways to enhance the educational value of VolcanoAtlas.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-xl font-semibold text-lava mb-3">Research Collaboration</h3>
                  <p className="text-volcanic-300 leading-relaxed">
                    Researchers and academic institutions interested in collaboration or data sharing can reach out 
                    to discuss potential partnerships.
                  </p>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-volcanic-900/50 border-l-4 border-lava p-6 rounded-r-xl mb-12">
              <h3 className="font-display text-xl font-semibold text-white mb-3">Response Time</h3>
              <p className="text-volcanic-300 leading-relaxed">
                We aim to respond to all inquiries within 2-3 business days. For urgent educational needs 
                or time-sensitive requests, please indicate this in your email subject line.
              </p>
            </div>

            {/* Other Ways to Connect */}
            <div className="mb-12">
              <h2 className="font-display text-3xl font-bold text-white mb-6">Stay Connected</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-volcanic-900 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-10 h-10 text-lava" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Accurate Data</h3>
                  <p className="text-volcanic-400 text-sm">
                    Sourced from the Smithsonian Global Volcanism Program
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-volcanic-900 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-10 h-10 text-lava" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Free Access</h3>
                  <p className="text-volcanic-400 text-sm">
                    All content freely available for educational use
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-volcanic-900 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-10 h-10 text-lava" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Regular Updates</h3>
                  <p className="text-volcanic-400 text-sm">
                    Continuously expanding and improving content
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Note */}
            <div className="bg-volcanic-900 border border-volcanic-700 rounded-xl p-6">
              <h3 className="font-display text-lg font-semibold text-white mb-3">Privacy & Data Protection</h3>
              <p className="text-volcanic-400 text-sm leading-relaxed">
                When you contact us, we collect only the information necessary to respond to your inquiry. 
                We never share your contact information with third parties or use it for marketing purposes. 
                For more information, please review our{' '}
                <Link href="/privacy" className="text-lava hover:text-lava-dark">Privacy Policy</Link>.
              </p>
            </div>

            {/* Final CTA */}
            <div className="text-center mt-12 p-8">
              <p className="text-volcanic-300 text-lg mb-6">
                Ready to explore the world of volcanoes?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/map" 
                      className="inline-block bg-lava hover:bg-lava-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                  Explore Interactive Map
                </Link>
                <Link href="/volcanoes" 
                      className="inline-block bg-volcanic-800 hover:bg-volcanic-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors border border-volcanic-600">
                  Browse All Volcanoes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}