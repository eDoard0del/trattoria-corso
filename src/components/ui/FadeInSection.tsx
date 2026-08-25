import React, { useEffect, useState } from 'react';
import { motion, Variants, useReducedMotion } from 'motion/react';

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  role?: string;
  'aria-label'?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export default function FadeInSection({
  children,
  className,
  delay = 0,
  id,
  role,
  'aria-label': ariaLabel,
}: FadeInSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <section className={className} id={id} role={role} aria-label={ariaLabel}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      className={className}
      id={id}
      role={role}
      aria-label={ariaLabel}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={containerVariants}
      transition={{ delay }}
    >
      {children}
    </motion.section>
  );
}
