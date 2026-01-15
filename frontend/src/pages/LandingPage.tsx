// src/pages/LandingPage.tsx
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/input');
  };

  const features = [
    {
      icon: "💔",
      title: "Emotional Support",
      description: "Get compassionate guidance through your healing journey"
    },
    {
      icon: "🧠",
      title: "AI-Powered Advice",
      description: "Four specialized AI agents analyze your situation"
    },
    {
      icon: "📋",
      title: "Personalized Plan",
      description: "Receive a customized recovery plan just for you"
    },
    {
      icon: "🛡️",
      title: "Safe Space",
      description: "Share your feelings in a completely private environment"
    }
  ];

  const testimonials = [
    {
      text: "This helped me through my toughest breakup. The AI agents understood exactly what I needed.",
      author: "Alex, 28"
    },
    {
      text: "The routine planner gave me structure when I felt completely lost. Life-changing.",
      author: "Taylor, 31"
    },
    {
      text: "Finally, a breakup tool that actually helps instead of just giving generic advice.",
      author: "Jordan, 25"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 font-inter overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-orange-200 to-red-200 rounded-full blur-3xl opacity-30"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mb-6 shadow-2xl">
              <span className="text-4xl lg:text-5xl">💔</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              HeartHeal AI
            </h1>
            <p className="text-xl lg:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your compassionate AI companion for breakup recovery and emotional healing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button
                onClick={handleGetStarted}
                className="px-12 py-6 text-lg lg:text-xl font-bold rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Begin Healing Journey →
              </Button>
              <Button
                variant="outline"
                className="px-12 py-6 text-lg lg:text-xl font-bold rounded-2xl border-2 border-rose-300 text-rose-700 hover:bg-rose-50 shadow-xl"
              >
                How It Works
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-12">
            How HeartHeal AI Supports You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-white/50"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Process Section */}
        <div className="py-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-12">
            Your Healing Journey in 3 Steps
          </h2>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
            {[
              { number: "1", title: "Share Your Story", description: "Tell us what you're going through" },
              { number: "2", title: "AI Analysis", description: "Four specialized agents analyze your situation" },
              { number: "3", title: "Receive Your Plan", description: "Get personalized recovery guidance" }
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600 max-w-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-12">
            Healing Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50"
              >
                <div className="text-rose-400 text-2xl mb-4">"</div>
                <p className="text-gray-700 mb-4 italic">{testimonial.text}</p>
                <p className="text-gray-800 font-semibold">— {testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl p-8 lg:p-12 shadow-2xl"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Start Healing?
            </h2>
            <p className="text-rose-100 text-xl mb-8 max-w-2xl mx-auto">
              Join thousands who have found guidance and support through their breakup journey
            </p>
            <Button
              onClick={handleGetStarted}
              className="px-12 py-6 text-lg lg:text-xl font-bold rounded-2xl bg-white text-rose-600 hover:bg-rose-50 shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Begin Your Recovery Now
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;