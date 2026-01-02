'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function BackButton({ href, label = 'Back', className = '' }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  if (href) {
    return (
      <Link href={href}>
        <motion.button
          whileHover={{ scale: 1.05, x: -3 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-4 py-2 glass rounded-xl hover:bg-white/10 transition-colors text-gray-300 hover:text-white ${className}`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{label}</span>
        </motion.button>
      </Link>
    );
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05, x: -3 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 px-4 py-2 glass rounded-xl hover:bg-white/10 transition-colors text-gray-300 hover:text-white ${className}`}
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </motion.button>
  );
}

