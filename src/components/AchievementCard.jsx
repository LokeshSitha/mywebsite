import { motion } from 'framer-motion'
import { Award } from 'lucide-react'

function AchievementCard({ achievement, index }) {
  return (
    <motion.div
      className="achievement-card"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="achievement-icon">
        <Award size={28} />
      </div>
      <h3 className="achievement-title">{achievement.title}</h3>
      <p className="achievement-description">{achievement.description}</p>
    </motion.div>
  )
}

export default AchievementCard