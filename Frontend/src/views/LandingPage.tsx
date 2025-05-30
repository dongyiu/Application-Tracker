// src/pages/LandingPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  LayoutDashboard,
  Mail,
  Clock,
  CheckCircle
} from 'lucide-react';
import { motion, MotionProps } from 'framer-motion';

// Custom Hook to detect media query
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    } else {
      return false;
    }
  });

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    mediaQueryList.addEventListener('change', listener);

    return () => mediaQueryList.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

// WaitlistModal Component
const WaitlistModal = ({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md transform rounded-2xl bg-gradient-to-b from-gray-900 to-gray-950 p-6 shadow-2xl transition-all">
        {/* Gradient Border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 -z-10" />

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Thank you for joining!
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Please check your email/spam folder. You should be notified within
            24 hours after requesting access. If you have any issues, join our
            Discord server at{' '}
            <a
              href="https://discord.gg/bC52tZzQ86"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              discord.gg/bC52tZzQ86
            </a>
          </p>

          {/* Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-sm font-medium rounded-lg transition-transform hover:scale-105 active:scale-95"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EnhancedFAB = () => {

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-center">
      {/* Call-to-action label - Moved up and adjusted positioning */}
      {(
        <motion.div
          className="absolute -top-12 whitespace-nowrap text-sm text-white/80 font-medium px-4 mr-6 py-1.5 rounded-full bg-gray-900/50 backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: [0, 1, 0],
            y: [10, 0, 10]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        >
          Go to Dashboard
        </motion.div>
      )}

      {/* Pulsing background effect */}
      {(
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 opacity-75 blur-lg"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}

      {/* Rotating gradient border */}
      {(
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/50 via-blue-400/50 to-emerald-400/50"
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}

      {/* Main button */}
      <motion.button
        onClick={() => (window.location.href = '/dashboard')}
        className="relative p-4 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg"
        whileHover={
          {
            scale: 1.1,
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }
        }
        whileTap={{ scale: 0.95 }}
        animate={
          {
            y: [0, -6, 0]
          }
        }
        transition={
          {
            y: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          }
        }
      >
        <LayoutDashboard className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
};

// Custom Hook for Intersection Observer
const useIntersectionObserver = (options: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (observer && observer.disconnect) observer.disconnect();
    };
  }, [ref, options]);

  return [ref, isVisible];
};

// Updated AnimatedCheckItem Component
const AnimatedCheckItem = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const initial = { opacity: 0, x: -20 };
  const animate = { opacity: 1, x: 0 };
  const noAnimationState = { opacity: 1, x: 0 };

  return (
    <motion.div
      initial={isMobile ? noAnimationState : initial}
      animate={isMobile ? noAnimationState : animate}
      transition={isMobile ? { duration: 0 } : { duration: 0.5 }}
      className="flex items-center gap-2 text-sm text-gray-300"
    >
      <motion.div
        whileHover={isMobile ? undefined : { scale: 1.2 }}
        className="flex-shrink-0"
      >
        <CheckCircle className="w-4 h-4 text-emerald-400" />
      </motion.div>
      <span>{children}</span>
    </motion.div>
  );
};

// Staggered Container for Multiple Elements
const StaggerContainer = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// Animated Hero Text
const AnimatedHeroText = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const initial = { opacity: 0, y: 20 };
  const animate = { opacity: 1, y: 0 };
  const noAnimationState = { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={isMobile ? noAnimationState : initial}
      animate={isMobile ? noAnimationState : animate}
      transition={
        isMobile
          ? { duration: 0 }
          : {
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1]
            }
      }
      className="fade-in-up"
    >
      <h1 className="text-center text-6xl sm:text-7xl lg:text-8xl font-cabinet-grotesk font-bold text-white mb-6 leading-tight">
        Track Your
        <motion.span
          initial={isMobile ? noAnimationState : initial}
          animate={isMobile ? noAnimationState : animate}
          transition={
            isMobile
              ? { duration: 0 }
              : { delay: 0.3, duration: 0.8 }
          }
          className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 mt-2"
        >
          Career Journey
        </motion.span>
      </h1>
    </motion.div>
  );
};

// Updated AnimatedStatsCard Component
type AnimatedStatsCardProps = Omit<MotionProps, 'onAnimationStart'> & {
  children: React.ReactNode;
};

const AnimatedStatsCard = React.forwardRef<
  HTMLDivElement,
  AnimatedStatsCardProps
>(({ children, ...props }, ref) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const initial = { opacity: 0, scale: 0.95 };
  const animate = { opacity: 1, scale: 1 };
  const noAnimationState = { opacity: 1, scale: 1 };

  return (
    <motion.div
      ref={ref}
      initial={isMobile ? noAnimationState : initial}
      animate={isMobile ? noAnimationState : animate}
      transition={
        isMobile
          ? { duration: 0 }
          : { type: 'spring', stiffness: 100, damping: 20 }
      }
      whileHover={
        isMobile
          ? undefined
          : {
              y: -8,
              transition: { duration: 0.2 }
            }
      }
      {...props}
    >
      {children}
    </motion.div>
  );
});

AnimatedStatsCard.displayName = 'AnimatedStatsCard';

// Updated AnimatedFeatureCard Component
const AnimatedFeatureCard = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const initial = { opacity: 0, y: 20 };
  const animate = { opacity: 1, y: 0 };
  const noAnimationState = { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={isMobile ? noAnimationState : initial}
      animate={isMobile ? noAnimationState : animate}
      transition={isMobile ? { duration: 0 } : { duration: 0.5 }}
      whileHover={
        isMobile
          ? undefined
          : {
              scale: 1.02,
              transition: { duration: 0.2 }
            }
      }
    >
      {children}
    </motion.div>
  );
};

// Animated Grid Background
const GridBackground = () => (
  <motion.div
    className="absolute inset-0 bg-grid-white/5"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.5 }}
    transition={{ duration: 1.5 }}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.9 }}
      transition={{ duration: 1.5, delay: 0.5 }}
    />
  </motion.div>
);

// Scroll Progress Indicator
const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateScrollProgress = () => {
    const scrollTop =
      window.pageYOffset || document.documentElement.scrollTop;
    const winHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (scrollTop / winHeight) * 100;
    setScrollProgress(scrolled);
  };

  useEffect(() => {
    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 transform origin-left z-50"
      style={{ scaleX: scrollProgress / 100 }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: scrollProgress / 100 }}
      transition={{ ease: 'linear', duration: 0.2 }}
    />
  );
};

// Gradient Border Animation
const GradientBorderCard = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <motion.div
      className="relative rounded-3xl p-[1px] overflow-hidden"
      initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
      whileInView={isMobile ? undefined : { opacity: 1 }}
      viewport={{ once: true }}
      transition={isMobile ? { duration: 0 } : undefined}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500"
        animate={
          isMobile
            ? undefined
            : {
                rotate: [0, 360]
              }
        }
        transition={
          isMobile
            ? undefined
            : {
                duration: 8,
                repeat: Infinity,
                ease: 'linear'
              }
        }
        style={{ borderRadius: 'inherit' }}
      />
      <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-3xl p-4">
        {children}
      </div>
    </motion.div>
  );
};

// Enhanced FeatureCard Component with Animated Checklist
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  features: string[];
}

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  features
}: FeatureCardProps) => {
  return (
    <AnimatedFeatureCard>
      <GradientBorderCard>
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 group-hover:from-emerald-500/20 group-hover:to-blue-500/20 transition-colors">
            <Icon
              className="w-6 h-6 text-emerald-400"
              strokeWidth={1.5}
              aria-label={`${title} Icon`}
            />
          </div>
          <h3 className="font-semibold text-white ml-4 text-lg">{title}</h3>
        </div>

        {/* Main Description */}
        <p className="text-gray-400 text-sm mb-6">{description}</p>

        {/* Feature List */}
        <div className="space-y-3">
          {features.map((feature, index) => (
            <AnimatedCheckItem key={index}>{feature}</AnimatedCheckItem>
          ))}
        </div>
      </GradientBorderCard>
    </AnimatedFeatureCard>
  );
};

// Enhanced Feature Section Component
const EnhancedFeatureSection = () => {
  const features = [
    {
      title: 'Smart Dashboard',
      description:
        'Organize and visualize your job search journey with our intuitive Kanban board',
      icon: LayoutDashboard,
      features: [
        'Custom workflow stages for application tracking',
        'Kanban-style organization board',
        'Detailed company and position tracking',
        'Comprehensive activity history'
      ]
    },
    {
      title: 'Email Integration',
      description:
        'Seamlessly import and manage applications directly from your Gmail',
      icon: Mail,
      features: [
        'Filter applications by keywords and tags',
        'Paginated email browsing',
        'Selective application import',
        'Smart Gmail label management'
      ]
    },
    {
      title: 'Progress Analytics',
      description:
        'Track and analyze your application journey with powerful insights',
      icon: Clock,
      features: [
        'Application status analytics',
        'Progress tracking dashboard',
        'Advanced search and filtering',
        'Total applications counter'
      ]
    }
  ];

  return (
    <StaggerContainer>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-full px-4 sm:px-3">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </StaggerContainer>
  );
};

// Reusable StatsCard Component
interface DataPoint {
  name?: string;
  value: number;
}

interface StatsCardProps {
  title: string;
  description: string;
  data: DataPoint[];
  type: 'line' | 'pie' | 'bar';
  isVisible: boolean;
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ title, description, data, type, isVisible }, ref) => {
    let ChartComponent: React.ReactElement = <div />;

    if (type === 'line') {
      ChartComponent = (
        <LineChart data={data}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#lineGradient)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      );
    } else if (type === 'pie') {
      ChartComponent = (
        <PieChart>
          <defs>
            <linearGradient id="pieGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={25}
            outerRadius={40}
            fill="url(#pieGradient)"
            stroke="none"
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill="url(#pieGradient)"
                fillOpacity={1 - index * 0.2}
              />
            ))}
          </Pie>
        </PieChart>
      );
    } else if (type === 'bar') {
      ChartComponent = (
        <BarChart data={data}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <Bar
            dataKey="value"
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      );
    }

    return (
      <AnimatedStatsCard ref={ref}>
        <motion.div
          className="relative w-full fade-in-up stats-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/50 to-blue-500/50 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
          <div className="relative p-4 backdrop-blur-xl bg-gray-900/80 rounded-3xl border border-gray-800/50 transition duration-300 hover:translate-y-[-2px] w-full">
            <div className="flex flex-col space-y-2 mb-2">
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="text-gray-400 text-sm">{description}</p>
            </div>

            <div className="w-full h-[100px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                {ChartComponent}
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </AnimatedStatsCard>
    );
  }
);

StatsCard.displayName = 'StatsCard';

// Main LandingPage Component
const LandingPage = () => {
  const [animatedLineData, setAnimatedLineData] = useState<{ value: number }[]>(
    []
  );
  const [animatedPieData, setAnimatedPieData] = useState<
    { name: string; value: number }[]
  >([]);
  const [animatedBarData, setAnimatedBarData] = useState<{ value: number }[]>(
    []
  );
  const [showModal, setShowModal] = useState(false);

  // Intersection Observer for StatsCard
  const [statsRef, statsVisible] = useIntersectionObserver({
    threshold: 0.1
  }) as [React.MutableRefObject<HTMLDivElement | null>, boolean];

  // Initial Data Sets
  const lineData = [
    { value: 10 },
    { value: 40 },
    { value: 30 },
    { value: 50 },
    { value: 45 },
    { value: 60 }
  ];

  const pieData = [
    { name: 'Applied', value: 50 },
    { name: 'Interview', value: 30 },
    { name: 'Offer', value: 20 }
  ];

  const barData = [
    { value: 15 },
    { value: 35 },
    { value: 25 },
    { value: 45 },
    { value: 35 },
    { value: 55 }
  ];

  // Animation effect for all chart data
  useEffect(() => {
    const animateData = () => {
      // Update line data
      const newLineData = lineData.map((item) => ({
        value: Math.max(0, Math.min(100, item.value + Math.random() * 10 - 5))
      }));
      setAnimatedLineData(newLineData);

      // Update pie data
      const newPieData = pieData.map((item) => ({
        name: item.name,
        value: Math.max(0, item.value + Math.random() * 10 - 5)
      }));
      // Normalize pie data to sum to 100
      const totalPieValue = newPieData.reduce(
        (sum, item) => sum + item.value,
        0
      );
      const normalizedPieData = newPieData.map((item) => ({
        name: item.name,
        value: (item.value / totalPieValue) * 100
      }));
      setAnimatedPieData(normalizedPieData);

      // Update bar data
      const newBarData = barData.map((item) => ({
        value: Math.max(0, Math.min(100, item.value + Math.random() * 10 - 5))
      }));
      setAnimatedBarData(newBarData);
    };

    // Initial animation
    animateData();

    const interval = setInterval(animateData, 1000);
    return () => clearInterval(interval);
  }, []);

  // Custom Cursor Effect (Optional, you can disable this on mobile as well)
  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) return; // Disable custom cursor on mobile devices

    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    const moveCursor = (e: { clientX: number; clientY: number }) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      cursor.remove();
    };
  }, []);

  return (
    <>
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Main Container */}
      <div
        className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 bg-grid-white relative overflow-hidden"
        onTouchStart={() => {
          /* Handle touch start */
        }}
        onTouchMove={() => {
          /* Handle touch move */
        }}
      >
        {/* Grain Overlay */}
        <GridBackground />

        {/* Navbar with Glassmorphism */}
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-gray-950/60 border-b border-gray-800/50">
          <div className="w-full mx-auto px-0 sm:px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="w-full mx-auto pb-6 pt-2 relative">
                <img
                  src="/logo2.png"
                  alt="TrackWise"
                  className="h-8 w-auto object-contain object-left"
                  style={{
                    position: 'absolute',
                    transform: 'scale(4)',
                    transformOrigin: 'left',
                    imageRendering: 'auto'
                  }}
                />
              </div>
              {/* Additional Navbar Items (if any) can be added here */}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="relative max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center justify-center">
          {/* Hero Section with Bold Typography */}
          <StaggerContainer>
            <AnimatedHeroText />
            <motion.p
              className="text-center text-base sm:text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed mx-auto max-w-2xl font-cabinet-grotesk fade-in-up"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Intelligent tracking and analytics to help you land your dream job
              faster
            </motion.p>

            {/* Simple 'Get Started' Button */}
            <motion.div
              className="max-w-md mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <button
                onClick={() => (window.location.href = '/dashboard')}
                className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-medium rounded-md transition-transform hover:scale-105 active:scale-95"
              >
                Get Started
              </button>
            </motion.div>
          </StaggerContainer>

          {/* Stats Grid with Different Chart Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mt-24 px-2 sm:px-6 mx-auto w-full max-w-6xl">
            <StatsCard
              title="Application Trends"
              description="Real-time view of your application progress"
              data={animatedLineData.length ? animatedLineData : lineData}
              type="line"
              ref={statsRef}
              isVisible={statsVisible}
            />
            <StatsCard
              title="Success Rate"
              description="Track your application success over time"
              data={animatedPieData.length ? animatedPieData : pieData}
              type="pie"
              ref={statsRef}
              isVisible={statsVisible}
            />
            <StatsCard
              title="Weekly Progress"
              description="Applications submitted per week"
              data={animatedBarData.length ? animatedBarData : barData}
              type="bar"
              ref={statsRef}
              isVisible={statsVisible}
            />
          </div>

          {/* Enhanced Feature Section with Animated Checklist */}
          <EnhancedFeatureSection />
        </div>

        {/* Video Demo Section */}
        <div className="mt-3 w-full max-w-5xl mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-white">
              See TrackWise in Action
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              Watch how TrackWise helps streamline your job application process
            </p>
          </motion.div>

          <motion.div
            className="relative rounded-2xl overflow-hidden bg-gray-900/80 border border-gray-800/50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="aspect-video">
              <iframe
                src="https://www.youtube.com/embed/CvvAR9vE7wo"
                title="TrackWise Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </div>

        {/* Floating Action Button */}
        <EnhancedFAB />

        {/* Footer */}
        <footer className="mt-24 py-8 border-t border-gray-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400">
                © 2024 TrackWise. All rights reserved.
              </div>
              <div className="flex items-center gap-6 text-sm">
                <a
                  href="/privacy"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="https://discord.gg/bC52tZzQ86"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Discord Support
                </a>
                <a
                  href="mailto:admin@trackwise.pro"
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Email Support
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* Waitlist Modal */}
        <WaitlistModal open={showModal} onOpenChange={setShowModal} />
      </div>
    </>
  );
};

export default LandingPage;
