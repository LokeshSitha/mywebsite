import { Shield } from 'lucide-react'

function Navigation({ scrollTo, refs }) {
  return (
    <nav className="navigation">
      <div className="nav-content">
        <a href="#" className="nav-logo">
          <Shield size={24} />
          <span>LOKESH</span>
        </a>
        <div className="nav-links">
          <span className="nav-link" onClick={() => scrollTo(refs.aboutRef)}>About</span>
          <span className="nav-link" onClick={() => scrollTo(refs.skillsRef)}>Skills</span>
          <span className="nav-link" onClick={() => scrollTo(refs.experienceRef)}>Experience</span>
          <span className="nav-link" onClick={() => scrollTo(refs.achievementsRef)}>Achievements</span>
          <span className="nav-link" onClick={() => scrollTo(refs.certificationsRef)}>Certifications</span>
          <span className="nav-link" onClick={() => scrollTo(refs.contactRef)}>Contact</span>
        </div>
      </div>
    </nav>
  )
}

export default Navigation