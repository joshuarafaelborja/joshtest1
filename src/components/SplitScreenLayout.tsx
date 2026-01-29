import { useState } from 'react';
import { Dumbbell, Calculator } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkoutPanel } from './WorkoutPanel';
import { CalculatorPanel } from './CalculatorPanel';
import { AccountMenu } from './AccountMenu';
import { AppData, Exercise } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import coachLogo from '@/assets/coach-logo.svg';

interface SplitScreenLayoutProps {
  data: AppData;
  onLogNew: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  onOpenAuth: () => void;
}

export function SplitScreenLayout({ data, onLogNew, onSelectExercise, onOpenAuth }: SplitScreenLayoutProps) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('workout');

  const handleOpenCalculator = () => {
    setActiveTab('calculator');
  };

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {/* Unified Header for Mobile */}
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={coachLogo} alt="Coach" className="w-8 h-8 object-contain" />
              <h1 className="text-xl font-bold">Coach</h1>
            </div>
            <AccountMenu onCreateAccount={onOpenAuth} />
          </div>
        </header>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-3 max-w-[calc(100%-2rem)] rounded-full h-12 p-1 bg-secondary">
            <TabsTrigger 
              value="workout" 
              className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background font-semibold gap-2"
            >
              <Dumbbell className="w-4 h-4" />
              Workout
            </TabsTrigger>
            <TabsTrigger 
              value="calculator" 
              className="rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background font-semibold gap-2"
            >
              <Calculator className="w-4 h-4" />
              Calculator
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="workout" className="flex-1 mt-0">
            <WorkoutPanel 
              data={data}
              onLogNew={onLogNew}
              onSelectExercise={onSelectExercise}
              onOpenAuth={onOpenAuth}
              onOpenCalculator={handleOpenCalculator}
              showHeader={false}
            />
          </TabsContent>
          
          <TabsContent value="calculator" className="flex-1 mt-0">
            <CalculatorPanel showHeader={false} />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Desktop: 50/50 split
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Workout Logging */}
      <div className="w-1/2 border-r border-border flex flex-col">
        <WorkoutPanel 
          data={data}
          onLogNew={onLogNew}
          onSelectExercise={onSelectExercise}
          onOpenAuth={onOpenAuth}
        />
      </div>

      {/* Divider */}
      <div className="w-px bg-border relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-12 bg-muted rounded-full flex items-center justify-center">
          <div className="w-1 h-6 bg-border rounded-full" />
        </div>
      </div>

      {/* Right Panel - Calculator */}
      <div className="w-1/2 flex flex-col">
        <CalculatorPanel />
      </div>
    </div>
  );
}
