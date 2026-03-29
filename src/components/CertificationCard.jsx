import { motion } from 'framer-motion'
import { Award } from 'lucide-react'

function CertificationCard({ certification, index }) {
  return (
    <motion.div
      className="certification-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <div className="certification-inner">
        <div className="certification-front">
          <Award className="cert-icon" size={40} />
          <h3 className="certification-title">{certification.title}</h3>
          <p className="certification-subtitle">{certification.subtitle}</p>
        </div>
        <div className="certification-back">
          <Award size={40} />
          <h3 className="certification-title">{certification.title}</h3>
          <p className="certification-subtitle">Verified</p>
        </div>
      </div>
    </motion.div>
  )
}

export default CertificationCard