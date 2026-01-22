import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Languages,
  BookOpen,
  Trophy,
  ShieldCheck,
  Sparkles,
  ArrowRightCircle,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { CourseCard } from '../components/public/CourseCard';
import { SkeletonCard } from '../components/public/SkeletonCard';
import { FeatureCard } from '../components/public/FeatureCard';
export default function Home() {
  return (
    <section className='max-w-2xl'>
      <h1 className='text-3xl font-bold mb-2'>Welcome to LingoFlow</h1>
      <p className='text-gray-700'>
        Log in or create an account to start learning.
      </p>
    </section>
  );
}
