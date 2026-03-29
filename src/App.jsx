import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { useState, useRef, Suspense } from 'react'
import { Shield, Award, GraduationCap, Mail, ChevronDown, Terminal, Database, Network, Lock, Cloud, Server, FileText } from 'lucide-react'
import { LinkedIn, GitHub } from './components/Icons'
import CyberGrid from './components/CyberGrid'
import FloatingNodes from './components/FloatingNodes'
import RotatingEarth from './components/ui/wireframe-dotted-globe'
import SkillCard from './components/SkillCard'
import Timeline from './components/Timeline'
import AchievementCard from './components/AchievementCard'
import CertificationCard from './components/CertificationCard'
import Navigation from './components/Navigation'
import './App.css'

const skills = [
  { icon: Shield, title: 'Network Security', items: ['Palo Alto', 'Check Point', 'Cisco Firewalls', 'Firewall Administration'], color: '#00ff88' },
  { icon: Network, title: 'Security Operations', items: ['Cisco ISE', 'NAC', 'VPN', 'IPSEC', 'GlobalProtect'], color: '#0ea5e9' },
  { icon: Database, title: 'Networking', items: ['LAN, WAN, WLAN', 'TCP/IP', 'Routing & Switching', 'VLANs, NAT'], color: '#06b6d4' },
  { icon: Lock, title: 'Incident Management', items: ['L1-L3 Support', 'Change Management', 'Tufin Policy Reviews', 'AlgoSec Compliance'], color: '#8b5cf6' },
  { icon: Server, title: 'Certificates & PKI', items: ['OpenSSL', 'Certificate Lifecycle', 'Public Certificates', 'CSR Generation'], color: '#f59e0b' },
  { icon: Cloud, title: 'Cloud Platforms', items: ['AWS Infrastructure', 'Cloud Security', 'Multi-Cloud Networks', 'Cloud Migration'], color: '#ec4899' },
]

const experiences = [
  {
    title: 'IT Analyst / Network Security Engineer',
    company: 'Tata Consultancy Services (TCS) / Global Foundries',
    location: 'Germany',
    period: 'May 2023 – Present',
    points: [
      'Managed enterprise firewalls (Palo Alto, Check Point, Cisco)',
      'Implemented IPSEC VPN & GlobalProtect',
      'Cisco ISE policy management (NAC)',
      'Firewall upgrades with minimal downtime',
      'PKI & certificate management using OpenSSL',
      'Multi-level incident support (L1–L3)'
    ]
  },
  {
    title: 'System Engineer',
    company: 'Tata Consultancy Services (TCS)',
    location: 'India',
    period: 'Sep 2016 – March 2023',
    points: [
      'Managed Cisco switches, routers, FTD & Palo Alto firewalls',
      'VLAN, routing, switching & ISP coordination',
      'Firewall policies, NAT, VPN implementations',
      'Tufin & AlgoSec compliance checks'
    ]
  }
]

const achievements = [
  { title: 'Commissioned ODC Environments', description: 'Designed secure ODC environments with VLAN segmentation' },
  { title: 'Security Transitions', description: 'Led multiple successful security transitions' },
  { title: 'Incident Resolution Excellence', description: 'Recognized for exceptional incident resolution' },
  { title: 'Multi-Region Management', description: 'Managed networks across India, US, Germany, Singapore' }
]

const certifications = [
  { title: 'CCNA', subtitle: 'Cisco Certified Network Associate' },
  { title: 'Cisco NGFW', subtitle: 'Next-Generation Firewall Security' },
  { title: 'Palo Alto', subtitle: 'Firewall Administrator Training' },
  { title: 'AWS Cloud', subtitle: 'Infrastructure Fundamentals' }
]

function App() {
  const [activeSkill, setActiveSkill] = useState(null)
  const aboutRef = useRef(null)
  const skillsRef = useRef(null)
  const experienceRef = useRef(null)
  const achievementsRef = useRef(null)
  const certificationsRef = useRef(null)
  const educationRef = useRef(null)
  const contactRef = useRef(null)

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app">
      <Navigation scrollTo={scrollTo} refs={{ aboutRef, skillsRef, experienceRef, achievementsRef, certificationsRef, educationRef, contactRef }} />

      <section className="hero">
        <div className="hero-bg">
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
            <Suspense fallback={null}>
              <CyberGrid />
              <FloatingNodes />
            </Suspense>
          </Canvas>
        </div>
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              <span className="title-line">Network Security Engineer</span>
              <span className="title-sub">Firewall & Cloud Security Specialist</span>
            </h1>
            <p className="hero-tagline">Securing Global Infrastructure Across Multi-Cloud & Enterprise Networks</p>
            <div className="hero-buttons">
              <motion.button
                className="cyber-button primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollTo(experienceRef)}
              >
                View Projects
              </motion.button>
              <motion.button
                className="cyber-button secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FileText size={18} /> Download Resume
              </motion.button>
              <motion.button
                className="cyber-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollTo(contactRef)}
              >
                <Mail size={18} /> Contact Me
              </motion.button>
            </div>
          </motion.div>
        </div>
        <div className="scroll-indicator" onClick={() => scrollTo(aboutRef)}>
          <ChevronDown className="animate-bounce" size={32} />
        </div>
      </section>

      <section ref={aboutRef} className="about">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">
              <span className="title-accent">//</span> About Me
            </h2>
            <div className="about-content">
              <div className="about-card cyber-border">
                <div className="card-glow" />
                <p className="about-text">
                  Network Security Engineer with 8+ years of experience designing, operating, and securing enterprise network infrastructures in global IT environments.
                  Expert in firewall administration, VPN technologies, network security operations, and incident/change management.
                  Proven ability to manage multi-region environments and ensure high availability and compliance.
                </p>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-number">8+</span>
                    <span className="stat-label">Years Experience</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">4</span>
                    <span className="stat-label">Regions Managed</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">1000+</span>
                    <span className="stat-label">Firewall Policies</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">99.9%</span>
                    <span className="stat-label">Uptime Achieved</span>
                  </div>
                </div>
              </div>
              <div className="globe-container">
                <RotatingEarth width={460} height={460} className="globe-visual" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section ref={skillsRef} className="skills">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">
              <span className="title-accent">//</span> Skills & Expertise
            </h2>
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <SkillCard
                  key={skill.title}
                  skill={skill}
                  index={index}
                  isActive={activeSkill === index}
                  onHover={() => setActiveSkill(index)}
                  onLeave={() => setActiveSkill(null)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section ref={experienceRef} className="experience">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">
              <span className="title-accent">//</span> Experience
            </h2>
            <Timeline experiences={experiences} />
          </motion.div>
        </div>
      </section>

      <section ref={achievementsRef} className="achievements">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">
              <span className="title-accent">//</span> Achievements
            </h2>
            <div className="achievements-grid">
              {achievements.map((achievement, index) => (
                <AchievementCard key={achievement.title} achievement={achievement} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section ref={certificationsRef} className="certifications">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">
              <span className="title-accent">//</span> Certifications
            </h2>
            <div className="certifications-grid">
              {certifications.map((cert, index) => (
                <CertificationCard key={cert.title} certification={cert} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section ref={educationRef} className="education">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">
              <span className="title-accent">//</span> Education
            </h2>
            <div className="education-card cyber-border">
              <GraduationCap size={40} className="text-cyber-green" />
              <div className="education-info">
                <h3>Bachelor of Science (Electronics)</h3>
                <p className="education-school">Srikrishna Devaraya University, India</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section ref={contactRef} className="contact">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title">
              <span className="title-accent">//</span> Get In Touch
            </h2>
            <div className="contact-content">
              <div className="contact-links">
                <a href="mailto:lk.s@tcs.com" className="contact-link cyber-border">
                  <Mail size={24} />
                  <span>lk.s@tcs.com</span>
                </a>
                <a href="mailto:s.lokeshkumar786@gmail.com" className="contact-link cyber-border">
                  <Mail size={24} />
                  <span>s.lokeshkumar786@gmail.com</span>
                </a>
                <a href="https://linkedin.com/in/lokesh-kumar-sitha" target="_blank" rel="noopener noreferrer" className="contact-link cyber-border">
                  <LinkedIn size={24} />
                  <span>LinkedIn</span>
                </a>
                <a href="https://github.com/LokeshSitha" target="_blank" rel="noopener noreferrer" className="contact-link cyber-border">
                  <GitHub size={24} />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2024 Lokesh | Network Security Engineer</p>
        <p className="footer-tagline">Securing the digital frontier</p>
      </footer>
    </div>
  )
}

export default App
