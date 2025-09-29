import React from 'react';
import { ArrowLeft, HelpCircle, Music, Target, Heart, ThumbsDown, ThumbsUp, Clock, Shuffle, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ResponsiveContainer } from '@/components/layout/ResponsiveContainer';
import { WebAppWrapper } from '@/components/layout/WebAppWrapper';

const FAQ = () => {
  const navigate = useNavigate();

  const faqSections = [
    {
      title: "Getting Started",
      icon: Music,
      questions: [
        {
          question: "How do I start using the therapeutic music app?",
          answer: "Simply select a therapeutic goal that matches your current needs (like Focus, Relaxation, or Sleep). The app will curate personalized music sessions designed to help you achieve that specific mental state."
        },
        {
          question: "What are therapeutic goals and how do they work?",
          answer: "Therapeutic goals are scientifically-backed categories like Focus Enhancement, Stress Reduction, Sleep Support, and Mood Boost. Each goal uses specific types of music, frequencies, and rhythms that have been shown to positively influence brain activity and emotional states."
        },
        {
          question: "Do I need to create an account?",
          answer: "Yes, an account is required to personalize your experience, save your preferences, track your progress, and ensure your therapeutic sessions are tailored to your specific needs over time."
        }
      ]
    },
    {
      title: "Using the Music Player",
      icon: Heart,
      questions: [
        {
          question: "How do the thumbs up/down buttons work?",
          answer: "Use thumbs up ❤️ to save tracks you love to your favorites. Use thumbs down 👎 to permanently block tracks you don't enjoy - they won't play again in future sessions. This helps the app learn your preferences."
        },
        {
          question: "What happens when I block a track?",
          answer: "When you thumbs down a track, it's immediately skipped and added to your blocked list. That specific track will never play in any of your future sessions, helping personalize your experience over time."
        },
        {
          question: "Can I control playback like a regular music player?",
          answer: "Yes! You can play, pause, skip forward/backward, and see the current track progress. The player works both in minimized mode (small bar at bottom) and full-screen mode for an immersive experience."
        },
        {
          question: "What's the difference between minimized and full player modes?",
          answer: "The minimized player appears as a small bar at the bottom of your screen so you can navigate the app while music plays. The full player provides an immersive, distraction-free experience with larger controls and visual elements."
        }
      ]
    },
    {
      title: "Therapeutic Sessions",
      icon: Target,
      questions: [
        {
          question: "How long should my therapeutic sessions be?",
          answer: "Session length depends on your goal: Focus sessions work well at 25-45 minutes, relaxation sessions at 15-30 minutes, and sleep sessions can run 30-60 minutes. The app will suggest optimal durations for each goal."
        },
        {
          question: "Can I customize the intensity of my sessions?",
          answer: "Yes! You can adjust session intensity from gentle to energizing. Lower intensity uses softer, more ambient sounds, while higher intensity includes more structured, rhythmic elements to boost alertness and focus."
        },
        {
          question: "What's the difference between the various therapeutic goals?",
          answer: "Each goal targets different brain states: Focus uses structured classical music and binaural beats, Relaxation features gentle ambient sounds, Sleep includes slow-tempo compositions and nature sounds, while Mood Boost incorporates uplifting melodies and positive frequencies."
        },
        {
          question: "How does the app know what music to play?",
          answer: "The app uses a combination of music psychology research, your past preferences (likes/dislikes), and real-time feedback to curate each session. It learns from your interactions to provide increasingly personalized recommendations."
        }
      ]
    },
    {
      title: "Personalization & Progress",
      icon: Shuffle,
      questions: [
        {
          question: "How does the app learn my preferences?",
          answer: "Every time you like, dislike, or skip a track, the app learns about your musical preferences. It also considers which therapeutic goals you use most often and adjusts future recommendations accordingly."
        },
        {
          question: "Can I see my listening history and progress?",
          answer: "Yes! In your profile, you can view your session history, favorite tracks, most-used therapeutic goals, and insights about your listening patterns to understand how music therapy is benefiting you."
        },
        {
          question: "Will my blocked tracks ever play again?",
          answer: "No, once you thumbs down a track, it's permanently blocked from all future sessions. However, you can manage your blocked tracks list in your profile settings if you want to unblock something later."
        }
      ]
    },
    {
      title: "Voice Commands",
      icon: Headphones,
      questions: [
        {
          question: "How do I use voice commands?",
          answer: "Enable voice commands on the main page, then say 'Hello NeuroTunes' followed by your request. The app is designed especially for elderly patients who may find it easier to speak than navigate touch interfaces."
        },
        {
          question: "What voice commands are available for health support?",
          answer: "You can say: 'I need anxiety support', 'Help with stress', 'I'm in pain', or 'I need sleep help'. The app will automatically start appropriate therapeutic music sessions."
        },
        {
          question: "What voice commands help with enhancement and mood?",
          answer: "Try: 'I need energy boost', 'Help me focus', 'Start meditation', or 'Improve my mood'. Each command will curate specific music designed for that mental state."
        },
        {
          question: "What navigation voice commands can I use?",
          answer: "You can say: 'Go home', 'Show me goals', 'Stop music', or 'Help' to navigate the app hands-free. Perfect for users who prefer voice control over touch navigation."
        },
        {
          question: "How do I get started with voice commands?",
          answer: "1. Enable voice commands on the main page, 2. Say 'Hello NeuroTunes' and wait for the response, 3. Tell the app what you need, 4. The app will respond and take action automatically."
        }
      ]
    },
    {
      title: "Technical Support",
      icon: HelpCircle,
      questions: [
        {
          question: "What should I do if music won't play?",
          answer: "First, check your internet connection and browser audio permissions. Try refreshing the page or restarting your browser. If problems persist, the app includes connectivity diagnostics to help troubleshoot playback issues."
        },
        {
          question: "Can I use the app on mobile devices?",
          answer: "Yes! The app is fully responsive and works on phones, tablets, and desktop computers. The player controls are optimized for touch screens and work seamlessly across all device types."
        },
        {
          question: "Does the app work offline?",
          answer: "The app requires an internet connection to stream therapeutic music and sync your preferences. However, once a session starts playing, brief connectivity interruptions won't stop your current track."
        },
        {
          question: "How much data does music streaming use?",
          answer: "High-quality therapeutic audio typically uses about 1-2 MB per minute of playback. A 30-minute session would use approximately 30-60 MB of data, similar to other music streaming services."
        }
      ]
    }
  ];

  return (
    <WebAppWrapper>
      <ResponsiveContainer className="py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h1>
            <p className="text-muted-foreground">Learn how to get the most out of your therapeutic music experience</p>
          </div>
        </div>

        {/* Quick Tips Card */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Quick Start Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Choose Your Goal</h3>
                  <p className="text-sm text-muted-foreground">Select what you want to achieve: focus, relaxation, better sleep, or mood boost</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Rate Your Music</h3>
                  <p className="text-sm text-muted-foreground">Use ❤️ and 👎 to teach the app your preferences for better recommendations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Set Session Length</h3>
                  <p className="text-sm text-muted-foreground">Customize duration and intensity to match your schedule and needs</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Music className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Enjoy Your Session</h3>
                  <p className="text-sm text-muted-foreground">Relax and let the scientifically-curated music work its therapeutic magic</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Sections */}
        <div className="space-y-6">
          {faqSections.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className="h-5 w-5" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`${sectionIndex}-${faqIndex}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Need More Help */}
        <Card className="mt-8 text-center">
          <CardContent className="py-6">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for? Try exploring the app's features hands-on, or check your profile settings for more options.
            </p>
            <Button onClick={() => navigate('/')} className="mr-2">
              Explore the App
            </Button>
            <Button variant="outline" onClick={() => navigate('/profile')}>
              View Profile Settings
            </Button>
          </CardContent>
        </Card>
      </ResponsiveContainer>
    </WebAppWrapper>
  );
};

export default FAQ;