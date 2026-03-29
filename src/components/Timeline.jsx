import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

function Timeline({ experiences }) {
  return (
    <div className="timeline">
      {experiences.map((exp, index) => (
        <motion.div
          key={exp.company}
          className="timeline-item"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2, duration: 0.5 }}
        >
          <div className="timeline-card">
            <div className="timeline-header">
              <div>
                <h3 className="timeline-title">{exp.title}</h3>
                <p className="timeline-company">{exp.company}</p>
                <p className="timeline-location">
                  <MapPin size={14} /> {exp.location}
                </p>
              </div>
              <span className="timeline-period">{exp.period}</span>
            </div>
            <ul className="timeline-points">
              {exp.points.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + i * 0.05 }}
                >
                  {point}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default Timeline