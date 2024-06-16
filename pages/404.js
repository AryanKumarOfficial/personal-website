import Layout from '../components/layout'
import { motion } from 'framer-motion'

export default function Custom404() {
    return (
        <Layout>
            <motion.div
                key="about"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="px-4"
            >
                <div className="mb-6 text-center text-gray-800 dark:text-white flex justify-center items-center h-full">
                    404 - Page Not Found
                </div>
            </motion.div>
        </Layout>
    )
}
