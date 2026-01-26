import { useState } from 'react';
import { 
  Dumbbell, 
  Calculator, 
  History, 
  TrendingUp, 
  Target, 
  Zap,
  ArrowRight,
  Sparkles,
  Link,
  ChevronRight,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import coachLogo from '@/assets/coach-logo.svg';

interface OnboardingFlowProps {
  onComplete: (userName?: string, goToCalculator?: boolean) => void;
  onSkip: () => void;
}

type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalSteps = 7;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = (nextStep: OnboardingStep) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(nextStep);
      setIsTransitioning(false);
    }, 200);
  };

  const handlePathSelect = (path: 'calculator' | 'setup') => {
    if (path === 'calculator') {
      onComplete(undefined, true);
    } else {
      handleNext(5);
    }
  };

  const handleNameSubmit = () => {
    if (userName.trim()) {
      handleNext(6);
    }
  };

  const handleEmailSubmit = () => {
    handleNext(7);
  };

  const handleFirstExerciseComplete = () => {
    onComplete(userName.trim() || undefined, false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={() => handleNext(2)} onSkip={onSkip} />;
      case 2:
        return <HowItWorksStep onNext={() => handleNext(3)} onSkip={onSkip} />;
      case 3:
        return <FeaturesStep onNext={() => handleNext(4)} onSkip={onSkip} />;
      case 4:
        return <ChoosePathStep onSelectPath={handlePathSelect} onSkip={onSkip} />;
      case 5:
        return (
          <NameInputStep 
            userName={userName} 
            setUserName={setUserName} 
            onNext={handleNameSubmit}
            onSkip={onSkip}
          />
        );
      case 6:
        return (
          <EmailInputStep
            userEmail={userEmail}
            setUserEmail={setUserEmail}
            userName={userName}
            onNext={handleEmailSubmit}
            onSkip={onSkip}
          />
        );
      case 7:
        return (
          <FirstExerciseStep
            exerciseName={exerciseName}
            setExerciseName={setExerciseName}
            userName={userName}
            onComplete={handleFirstExerciseComplete}
            onSkip={onSkip}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header with progress */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <img src={coachLogo} alt="Coach" className="w-8 h-8 object-contain" />
            <span className="font-semibold">Coach AI</span>
          </div>
        </div>
        <Progress value={progress} className="h-1" />
      </header>

      {/* Content */}
      <div 
        className={`flex-1 flex flex-col transition-opacity duration-200 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {renderStep()}
      </div>
    </div>
  );
}

// Skip Setup Link Component
function SkipSetupLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-muted-foreground hover:text-foreground text-sm transition-colors mt-4"
    >
      Skip Setup
    </button>
  );
}

// Step 1: Welcome
function WelcomeStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-12 animate-fade-in">
      <div className="max-w-md mx-auto w-full text-center flex flex-col items-center">
        <div className="inline-flex items-center justify-center w-32 h-32 mb-8">
          <img 
            src={coachLogo} 
            alt="Coach mascot" 
            className="w-32 h-32 object-contain drop-shadow-lg animate-scale-in" 
          />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          Welcome to Coach AI
        </h1>
        <p className="text-xl text-muted-foreground mb-12">
          Your personal workout tracking assistant
        </p>
        <Button
          size="lg"
          onClick={onNext}
          className="w-full h-14 text-lg font-semibold"
        >
          Get Started
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        <SkipSetupLink onClick={onSkip} />
      </div>
    </div>
  );
}

// Step 2: How It Works
function HowItWorksStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const steps = [
    {
      icon: Dumbbell,
      title: 'Log your workouts with AI assistance',
      description: 'Smart tracking that learns from your progress',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: TrendingUp,
      title: 'Track progress over time',
      description: 'Visualize your gains and improvements',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      icon: Link,
      title: 'Access your data anywhere with a magic link',
      description: 'No password needed - secure and simple',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  return (
    <div className="flex-1 flex flex-col px-6 py-8 animate-fade-in">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        <h2 className="text-3xl font-bold mb-2">How Coach Works</h2>
        <p className="text-muted-foreground mb-8">
          Simple, powerful, and designed for your gains
        </p>
        
        <div className="space-y-4 flex-1">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex gap-4 p-4 rounded-xl bg-card border"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${step.bgColor} flex items-center justify-center`}>
                <step.icon className={`w-6 h-6 ${step.color}`} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center mt-8">
          <Button
            size="lg"
            onClick={onNext}
            className="w-full h-14 text-lg font-semibold"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
          <SkipSetupLink onClick={onSkip} />
        </div>
      </div>
    </div>
  );
}

// Step 3: Features Overview
function FeaturesStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const features = [
    {
      icon: Calculator,
      title: 'Smart Calculator',
      description: 'Calculate 1RM, plates, and more',
      color: 'text-success',
      bgColor: 'bg-success/10',
      isLarge: true
    },
    {
      icon: Dumbbell,
      title: 'Log Workouts',
      description: 'Track sets, reps, and weight with ease',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      isLarge: false
    },
    {
      icon: History,
      title: 'Progress History',
      description: 'See your gains over time',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      isLarge: false
    }
  ];

  return (
    <div className="flex-1 flex flex-col px-6 py-8 animate-fade-in">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        <h2 className="text-3xl font-bold mb-2">What You Can Do</h2>
        <p className="text-muted-foreground mb-8">
          Everything you need to level up
        </p>
        
        <div className="space-y-4 flex-1">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={`flex flex-col items-center text-center ${
                feature.isLarge ? 'p-8 border-2 border-success/30 bg-success/5' : 'p-5'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`rounded-2xl ${feature.bgColor} flex items-center justify-center mb-3 ${
                feature.isLarge ? 'w-20 h-20' : 'w-14 h-14'
              }`}>
                <feature.icon className={`${feature.color} ${feature.isLarge ? 'w-10 h-10' : 'w-7 h-7'}`} />
              </div>
              <h3 className={`font-semibold mb-1 ${feature.isLarge ? 'text-xl' : 'text-lg'}`}>
                {feature.title}
              </h3>
              <p className={`text-muted-foreground ${feature.isLarge ? 'text-base' : 'text-sm'}`}>
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="flex flex-col items-center mt-8">
          <Button
            size="lg"
            onClick={onNext}
            className="w-full h-14 text-lg font-semibold"
          >
            Continue
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
          <SkipSetupLink onClick={onSkip} />
        </div>
      </div>
    </div>
  );
}

// Step 4: Choose Your Path
function ChoosePathStep({ onSelectPath, onSkip }: { onSelectPath: (path: 'calculator' | 'setup') => void; onSkip: () => void }) {
  return (
    <div className="flex-1 flex flex-col px-6 py-8 animate-fade-in">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        <h2 className="text-3xl font-bold mb-2">Ready to start?</h2>
        <p className="text-muted-foreground mb-8">
          Choose how you'd like to begin
        </p>
        
        <div className="space-y-4 flex-1">
          {/* Primary CTA - Calculator */}
          <Button
            onClick={() => onSelectPath('calculator')}
            size="lg"
            className="w-full h-16 text-lg font-semibold bg-success hover:bg-success/90 text-success-foreground"
          >
            <Calculator className="w-6 h-6 mr-3" />
            Try the Calculator First
          </Button>

          {/* Secondary CTA - Setup */}
          <Button
            onClick={() => onSelectPath('setup')}
            size="lg"
            variant="outline"
            className="w-full h-14 text-lg font-semibold"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Set Up My Profile
          </Button>
        </div>

        <div className="flex flex-col items-center mt-8">
          <button
            onClick={onSkip}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Skip - Take me to the app
          </button>
        </div>
      </div>
    </div>
  );
}

// Step 5: Name Input
function NameInputStep({ 
  userName, 
  setUserName, 
  onNext,
  onSkip
}: { 
  userName: string; 
  setUserName: (name: string) => void; 
  onNext: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col px-6 py-8 animate-fade-in">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Target className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2">What should we call you?</h2>
          <p className="text-muted-foreground">
            Personalize your coaching experience
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="userName" className="text-base font-medium">
              Your Name
            </Label>
            <Input
              id="userName"
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="h-14 text-lg mt-2"
              autoFocus
            />
          </div>

          <Button
            size="lg"
            onClick={onNext}
            disabled={!userName.trim()}
            className="w-full h-14 text-lg font-semibold"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        <div className="flex justify-center">
          <SkipSetupLink onClick={onSkip} />
        </div>
      </div>
    </div>
  );
}

// Step 6: Email Input
function EmailInputStep({ 
  userEmail, 
  setUserEmail,
  userName,
  onNext,
  onSkip
}: { 
  userEmail: string; 
  setUserEmail: (email: string) => void;
  userName: string;
  onNext: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col px-6 py-8 animate-fade-in">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-warning/10 mb-6">
            <Link className="w-10 h-10 text-warning" />
          </div>
          <h2 className="text-3xl font-bold mb-2">
            {userName ? `Hey ${userName}!` : 'Almost there!'}
          </h2>
          <p className="text-muted-foreground">
            Add your email for a magic link to access your data anywhere
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="userEmail" className="text-base font-medium">
              Email Address (optional)
            </Label>
            <Input
              id="userEmail"
              type="email"
              placeholder="you@example.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="h-14 text-lg mt-2"
              autoFocus
            />
            <p className="text-xs text-muted-foreground mt-2">
              We'll send you a magic link - no password needed
            </p>
          </div>

          <Button
            size="lg"
            onClick={onNext}
            className="w-full h-14 text-lg font-semibold"
          >
            {userEmail.trim() ? 'Continue' : 'Skip for now'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        <div className="flex justify-center">
          <SkipSetupLink onClick={onSkip} />
        </div>
      </div>
    </div>
  );
}

// Step 7: First Exercise
function FirstExerciseStep({ 
  exerciseName, 
  setExerciseName,
  userName,
  onComplete,
  onSkip
}: { 
  exerciseName: string;
  setExerciseName: (name: string) => void;
  userName: string;
  onComplete: () => void;
  onSkip: () => void;
}) {
  const [isSuccess, setIsSuccess] = useState(false);

  const popularExercises = [
    'Bench Press',
    'Squat',
    'Deadlift',
    'Overhead Press',
    'Barbell Row'
  ];

  const handleComplete = () => {
    if (exerciseName.trim()) {
      setIsSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 animate-fade-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/10 mb-6 animate-scale-in">
            <Check className="w-12 h-12 text-success" />
          </div>
          <h2 className="text-3xl font-bold mb-2">You're all set{userName ? `, ${userName}` : ''}!</h2>
          <p className="text-muted-foreground">
            Taking you to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-6 py-8 animate-fade-in">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">
            Let's log your first exercise{userName ? `, ${userName}` : ''}
          </h2>
          <p className="text-muted-foreground">
            What exercise do you want to track?
          </p>
        </div>
        
        <div className="space-y-4 flex-1">
          <div>
            <Label htmlFor="exercise" className="text-base font-medium">
              Exercise Name
            </Label>
            <Input
              id="exercise"
              type="text"
              placeholder="e.g., Bench Press"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              className="h-14 text-lg mt-2"
              autoFocus
            />
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-3">Popular choices:</p>
            <div className="flex flex-wrap gap-2">
              {popularExercises.map((exercise) => (
                <button
                  key={exercise}
                  type="button"
                  onClick={() => setExerciseName(exercise)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    exerciseName === exercise
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {exercise}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mt-8">
          <Button
            size="lg"
            onClick={handleComplete}
            disabled={!exerciseName.trim()}
            className="w-full h-14 text-lg font-semibold"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Tracking
          </Button>
          <SkipSetupLink onClick={onSkip} />
        </div>
      </div>
    </div>
  );
}
