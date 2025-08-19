'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, MessageCircle, Calendar, Trophy, Star, Crown, 
  ChevronRight, Play, ArrowRight, CheckCircle, Zap,
  Heart, Globe, BookOpen, Music, Camera, Code,
  Gamepad2, Palette, Mountain, Coffee, Quote,
  TrendingUp, Shield, Clock, Award, Target,
  Sparkles, UserCheck, Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/navbar';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, variant = "primary", size = "md", className = "", onClick }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500",
    secondary: "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500"
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

interface ClubCategory {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  count: number;
  color: string;
}

interface Testimonial {
  name: string;
  role: string;
  college: string;
  quote: string;
  avatar: string;
}

interface SuccessStory {
  club: string;
  college: string;
  achievement: string;
  members: number;
  icon: React.ComponentType<{ className?: string }>;
}

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState({ clubs: 0, students: 0, events: 0, colleges: 0 });

  useEffect(() => {
    if (!loading && user) {
      switch (user.role) {
        case 'super_admin':
          router.push('/super-admin');
          break;
        case 'college_admin':
          router.push('/college-admin');
          break;
        case 'club_admin':
          router.push('/club-admin');
          break;
        case 'student':
          router.push('/dashboard');
          break;
        default:
          break;
      }
    }
  }, [user, loading, router]);

  // Animate statistics
  useEffect(() => {
    const targetStats = { clubs: 500, students: 15000, events: 2500, colleges: 150 };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setStats({
        clubs: Math.floor(targetStats.clubs * progress),
        students: Math.floor(targetStats.students * progress),
        events: Math.floor(targetStats.events * progress),
        colleges: Math.floor(targetStats.colleges * progress)
      });
      
      if (step >= steps) clearInterval(timer);
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, []);

  // Rotate testimonials
   const testimonials: Testimonial[] = [
    {
      name: "Sarah Chen",
      role: "Computer Science Student",
      college: "Tech University",
      quote: "Joining the Coding Club through this platform changed my college experience completely. I've made lifelong friends and landed my dream internship!",
      avatar: "SC"
    },
    {
      name: "Marcus Johnson",
      role: "Photography Club President",
      college: "Arts College",
      quote: "Managing our club has never been easier. The event organization tools helped us triple our membership this year.",
      avatar: "MJ"
    },
    {
      name: "Priya Patel",
      role: "Business Student",
      college: "Commerce University",
      quote: "I discovered clubs I never knew existed. The real-time chat feature keeps our debate team connected 24/7.",
      avatar: "PP"
    }
  ];
   useEffect(() => {
    if (testimonials.length === 0) return;

    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    
    return () => clearInterval(testimonialTimer);
  }, [testimonials.length]);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  const clubCategories: ClubCategory[] = [
    { icon: Code, name: "Tech & Programming", count: 45, color: "text-blue-600" },
    { icon: Palette, name: "Arts & Creative", count: 38, color: "text-purple-600" },
    { icon: Music, name: "Music & Performance", count: 32, color: "text-green-600" },
    { icon: Mountain, name: "Sports & Adventure", count: 41, color: "text-orange-600" },
    { icon: BookOpen, name: "Academic & Research", count: 29, color: "text-red-600" },
    { icon: Globe, name: "Cultural & International", count: 25, color: "text-indigo-600" }
  ];

 

  const successStories: SuccessStory[] = [
    {
      club: "Robotics Club",
      college: "Engineering Institute",
      achievement: "Won National Championship",
      members: 45,
      icon: Zap
    },
    {
      club: "Debate Society",
      college: "Liberal Arts College",
      achievement: "Inter-college Tournament Winners",
      members: 32,
      icon: Trophy
    },
    {
      club: "Environmental Club",
      college: "Green University",
      achievement: "Planted 1000+ Trees",
      members: 67,
      icon: Heart
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 mt-14">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            Connect • Discover • Lead • Grow
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Your College's
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Universe of Clubs
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Connect with like-minded students, discover amazing clubs, participate in events, and
            build lasting relationships in your college community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="group">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="secondary" size="lg" className="group">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Live Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.clubs.toLocaleString()}+</div>
            <div className="text-gray-600 font-medium">Active Clubs</div>
          </div>
          <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.students.toLocaleString()}+</div>
            <div className="text-gray-600 font-medium">Students Connected</div>
          </div>
          <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.events.toLocaleString()}+</div>
            <div className="text-gray-600 font-medium">Events Hosted</div>
          </div>
          <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="text-3xl font-bold text-orange-600 mb-2">{stats.colleges.toLocaleString()}+</div>
            <div className="text-gray-600 font-medium">Partner Colleges</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Join Clubs</CardTitle>
              <CardDescription>
                Discover and join clubs that match your interests from your college
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Real-time Chat</CardTitle>
              <CardDescription>
                Connect with club members through dedicated chat rooms
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <Calendar className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Events & Activities</CardTitle>
              <CardDescription>
                Stay updated with club events and participate in activities
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <Crown className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <CardTitle>Leadership Roles</CardTitle>
              <CardDescription>
                Take on leadership roles like President, Vice President, or Lead
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Club Categories */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Club Categories</h2>
            <p className="text-xl text-gray-600">Find your passion among hundreds of diverse clubs</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubCategories.map((category, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <category.icon className={`h-8 w-8 ${category.color} mr-4 group-hover:scale-110 transition-transform`} />
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.count} clubs</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">See how clubs are making a difference</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-xl transition-shadow duration-300">
                <story.icon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{story.club}</h3>
                <p className="text-gray-600 mb-2">{story.college}</p>
                <p className="text-green-600 font-semibold mb-2">{story.achievement}</p>
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  {story.members} members
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Students Say</h2>
            <p className="text-xl text-gray-600">Real experiences from our community</p>
          </div>
          <Card className="max-w-4xl mx-auto p-8">
            <div className="text-center">
              <Quote className="h-12 w-12 text-blue-600 mx-auto mb-6" />
              <blockquote className="text-xl text-gray-700 mb-6 italic">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</p>
                  <p className="text-gray-600 text-sm">{testimonials[currentTestimonial].role}</p>
                  <p className="text-gray-500 text-xs">{testimonials[currentTestimonial].college}</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Role-based Features */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Everyone</h2>
            <p className="text-xl text-gray-600">Tailored features for every role in your college community</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <Trophy className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>For Students</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Browse clubs from your college</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Join clubs and participate in activities</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Chat with club members in real-time</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Get leadership roles in clubs</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Stay updated with events</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <Star className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>For Club Admins</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Manage club members and activities</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Assign leadership roles to members</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Create and manage events</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Moderate club chat rooms</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Track member engagement</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <Crown className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>For College Admins</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Manage all college clubs</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Oversee student registrations</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Create new clubs and assign admins</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Monitor college-wide activities</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Generate reports and analytics</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600">The features that make us the best choice for college communities</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600 text-sm">Your data is protected with enterprise-grade security</p>
            </div>
            <div className="text-center p-6">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">24/7 Available</h3>
              <p className="text-gray-600 text-sm">Access your clubs and events anytime, anywhere</p>
            </div>
            <div className="text-center p-6">
              <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Growing Network</h3>
              <p className="text-gray-600 text-sm">Join thousands of students across multiple colleges</p>
            </div>
            <div className="text-center p-6">
              <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Award Winning</h3>
              <p className="text-gray-600 text-sm">Recognized for excellence in student engagement</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 px-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your College Experience?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of students who have already discovered their perfect club community</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
              Contact Us
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}