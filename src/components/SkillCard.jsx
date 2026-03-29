import { motion } from 'framer-motion'

function SkillCard({ skill, index, isActive, onHover, onLeave }) {
  const Icon = skill.icon

  return (
    <motion.div
      className={`skill-card ${isActive ? 'active' : ''}`}
      style={{ '--skill-color': skill.color }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="skill-header">
        <div className="skill-icon">
          <Icon size={24} />
        </div>
        <h3 className="skill-title">{skill.title}</h3>
      </div>
      <div className="skill-items">
        {skill.items.map((item, i) => (
          <motion.span
            key={item}
            className="skill-tag"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + i * 0.05 }}
          >
            {item}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

export default SkillCard