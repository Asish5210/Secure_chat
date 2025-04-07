import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const LoadingOverlay = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex flex-col items-center justify-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"
      />
      {message && (
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-white font-medium"
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
};

LoadingOverlay.propTypes = {
  message: PropTypes.string
};

LoadingOverlay.defaultProps = {
  message: null
};

export default LoadingOverlay;