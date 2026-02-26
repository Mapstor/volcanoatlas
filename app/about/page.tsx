import Link from 'next/link';

export const metadata = {
  title: 'About Us | VolcanoAtlas',
  description: 'Learn about VolcanoAtlas - Our mission to make volcanic science accessible through comprehensive education and exploration.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-volcanic-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-volcanic-900 to-volcanic-950 py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-volcanic-400 mb-6">
            <Link href="/" className="hover:text-lava">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">About Us</span>
          </nav>
          
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">
            About VolcanoAtlas
          </h1>
          <p className="text-2xl text-lava font-display">
            Bringing the Power and Beauty of Earth's Volcanoes to Everyone
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-lava/20 to-transparent border-l-4 border-lava p-8 rounded-r-xl mb-12">
            <h2 className="font-display text-3xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-lg text-volcanic-200 leading-relaxed">
              We are on a mission to bring attention to volcanoes for educational purposes, making volcanic science 
              accessible, engaging, and comprehensible to students, educators, researchers, and enthusiasts worldwide. 
              Through comprehensive data, interactive visualizations, and detailed profiles, we transform complex 
              geological information into an educational journey of discovery.
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-white mb-6">Why VolcanoAtlas Exists</h2>
              <p className="text-volcanic-300 leading-relaxed mb-4">
                Volcanoes are among Earth's most powerful and fascinating natural phenomena. They shape our planet's landscape, 
                influence climate patterns, create new land, and have profoundly impacted human civilization throughout history. 
                Yet, comprehensive and accessible information about these geological wonders has traditionally been scattered 
                across academic papers, government databases, and specialized publications.
              </p>
              <p className="text-volcanic-300 leading-relaxed mb-4">
                VolcanoAtlas bridges this gap by consolidating volcanic knowledge into a single, user-friendly platform. 
                We believe that understanding volcanoes is crucial not just for scientific advancement, but for public safety, 
                environmental awareness, and appreciating the dynamic nature of our planet.
              </p>
            </div>

            <div>
              <h2 className="font-display text-3xl font-bold text-white mb-6">What We Offer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-volcanic-900 border border-volcanic-700 rounded-xl p-6">
                  <h3 className="font-display text-xl font-semibold text-lava mb-3">Comprehensive Profiles</h3>
                  <p className="text-volcanic-300 text-sm leading-relaxed">
                    Detailed information on 150 volcanoes across 46 countries, including eruption histories, 
                    geological characteristics, hazard assessments, and cultural significance.
                  </p>
                </div>
                <div className="bg-volcanic-900 border border-volcanic-700 rounded-xl p-6">
                  <h3 className="font-display text-xl font-semibold text-lava mb-3">Interactive Exploration</h3>
                  <p className="text-volcanic-300 text-sm leading-relaxed">
                    Dynamic maps, photo galleries, and data visualizations that bring volcanic science to life, 
                    making complex information accessible and engaging.
                  </p>
                </div>
                <div className="bg-volcanic-900 border border-volcanic-700 rounded-xl p-6">
                  <h3 className="font-display text-xl font-semibold text-lava mb-3">Educational Resources</h3>
                  <p className="text-volcanic-300 text-sm leading-relaxed">
                    Curated content designed for students, teachers, and lifelong learners, with clear explanations 
                    of volcanic processes, terminology, and impacts.
                  </p>
                </div>
                <div className="bg-volcanic-900 border border-volcanic-700 rounded-xl p-6">
                  <h3 className="font-display text-xl font-semibold text-lava mb-3">Scientific Accuracy</h3>
                  <p className="text-volcanic-300 text-sm leading-relaxed">
                    Data sourced from the Smithsonian Institution's Global Volcanism Program and other authoritative 
                    scientific institutions, ensuring reliability and credibility.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl font-bold text-white mb-6">Our Educational Impact</h2>
              <p className="text-volcanic-300 leading-relaxed mb-4">
                Education is at the heart of everything we do at VolcanoAtlas. We believe that fostering understanding 
                of volcanic processes contributes to:
              </p>
              <ul className="list-disc list-inside space-y-3 ml-4 text-volcanic-300">
                <li>
                  <strong className="text-white">Scientific Literacy:</strong> Helping people understand the geological 
                  forces that shape our planet and the scientific methods used to study them.
                </li>
                <li>
                  <strong className="text-white">Risk Awareness:</strong> Educating communities about volcanic hazards 
                  and the importance of monitoring and preparedness.
                </li>
                <li>
                  <strong className="text-white">Environmental Understanding:</strong> Illustrating the role volcanoes 
                  play in Earth's climate system, ecosystem development, and resource formation.
                </li>
                <li>
                  <strong className="text-white">Cultural Appreciation:</strong> Highlighting the deep connections between 
                  volcanoes and human societies, from mythology to modern tourism.
                </li>
                <li>
                  <strong className="text-white">Career Inspiration:</strong> Introducing students to volcanology, geology, 
                  and related scientific fields as potential career paths.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl font-bold text-white mb-6">Who We Serve</h2>
              <div className="space-y-4">
                <div className="bg-volcanic-900/50 border-l-4 border-lava/50 p-6 rounded-r-lg">
                  <h3 className="font-semibold text-white mb-2">Students & Educators</h3>
                  <p className="text-volcanic-300 text-sm leading-relaxed">
                    From elementary school projects to university research, we provide reliable, 
                    age-appropriate information that supports learning at all levels.
                  </p>
                </div>
                <div className="bg-volcanic-900/50 border-l-4 border-lava/50 p-6 rounded-r-lg">
                  <h3 className="font-semibold text-white mb-2">Researchers & Academics</h3>
                  <p className="text-volcanic-300 text-sm leading-relaxed">
                    Quick access to volcanic data, eruption histories, and comprehensive references 
                    to support scientific research and analysis.
                  </p>
                </div>
                <div className="bg-volcanic-900/50 border-l-4 border-lava/50 p-6 rounded-r-lg">
                  <h3 className="font-semibold text-white mb-2">Travelers & Adventure Seekers</h3>
                  <p className="text-volcanic-300 text-sm leading-relaxed">
                    Essential information for those planning to visit volcanic regions, including 
                    safety considerations and visitor information.
                  </p>
                </div>
                <div className="bg-volcanic-900/50 border-l-4 border-lava/50 p-6 rounded-r-lg">
                  <h3 className="font-semibold text-white mb-2">Curious Minds</h3>
                  <p className="text-volcanic-300 text-sm leading-relaxed">
                    Anyone fascinated by the natural world and eager to learn about the powerful 
                    forces that continue to shape our planet.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl font-bold text-white mb-6">Our Commitment to Quality</h2>
              <p className="text-volcanic-300 leading-relaxed mb-4">
                We are committed to maintaining the highest standards of accuracy, accessibility, and educational value:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-volcanic-300">
                <li>Regular updates to reflect the latest volcanic activity and scientific discoveries</li>
                <li>Clear, jargon-free explanations alongside technical details for different audience levels</li>
                <li>Responsive design ensuring access across all devices and platforms</li>
                <li>Free access to all content, supporting our mission of universal education</li>
                <li>Continuous improvement based on user feedback and educational best practices</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl font-bold text-white mb-6">Looking Forward</h2>
              <p className="text-volcanic-300 leading-relaxed mb-4">
                As VolcanoAtlas grows, we envision expanding our educational impact through:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-volcanic-300 mb-6">
                <li>Interactive educational modules and lesson plans for teachers</li>
                <li>Real-time volcanic activity monitoring and alerts</li>
                <li>Virtual field trips to volcanic sites worldwide</li>
                <li>Collaboration with schools and educational institutions</li>
                <li>Multi-language support to reach global audiences</li>
                <li>Community contributions and citizen science initiatives</li>
              </ul>
              <p className="text-volcanic-300 leading-relaxed">
                We believe that by making volcanic science accessible and engaging, we can inspire a new generation 
                of Earth scientists, foster global environmental awareness, and contribute to a more scientifically 
                literate society.
              </p>
            </div>

            <div className="bg-volcanic-900 border border-volcanic-700 rounded-xl p-8 mt-12">
              <h2 className="font-display text-2xl font-bold text-white mb-4">Join Our Mission</h2>
              <p className="text-volcanic-300 leading-relaxed mb-4">
                Whether you're a student, educator, researcher, or simply someone fascinated by volcanoes, 
                you're part of the VolcanoAtlas community. Together, we're building a comprehensive resource 
                that celebrates the power, beauty, and scientific importance of Earth's volcanoes.
              </p>
              <p className="text-volcanic-300 leading-relaxed">
                Thank you for joining us on this educational journey. Every page you explore, every fact you learn, 
                and every moment of wonder you experience brings us closer to our goal of making volcanic science 
                accessible to all.
              </p>
            </div>

            <div className="text-center mt-12">
              <p className="text-volcanic-400 text-sm mb-4">
                Have questions, suggestions, or want to contribute to our mission?
              </p>
              <Link href="/contact" className="inline-block bg-lava hover:bg-lava-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}