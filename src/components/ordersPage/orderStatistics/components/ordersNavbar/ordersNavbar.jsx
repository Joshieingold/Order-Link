// components/BottomNavbar.jsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './ordersNavbar.css'

const navItems = [
  { label: 'Overview', path: '/Orders' },
  { label: 'Review', path: '/OrderReview' },
  { label: 'History', path: '/OrderHistory' }
]

export default function OrdersNavbar() {
  return (
    <motion.nav
      className="bottom-navbar"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.8, ease: 'easeOut' }}
    >
      {navItems.map((item, i) => (
        <motion.div
          className="nav-link"
          key={item.path}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.1, duration: 1.8 }}
        >
          <Link to={item.path}>{item.label}</Link>
        </motion.div>
      ))}
    </motion.nav>
  )
}
