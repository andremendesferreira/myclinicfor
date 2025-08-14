import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface ActivitiesSelectorProps {
  activities: string[];
  selectedActivities: string[];
  onToggleActivity: (activity: string) => void;
}

export function ActivitiesSelector({ 
  activities, 
  selectedActivities, 
  onToggleActivity 
}: ActivitiesSelectorProps) {
  return (
    <div className='space-y-2'>
      <Label className='font-semibold'>
        Atividades da clínica
      </Label>
      <Card className="p-4">
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          {activities.map((activity) => (
            <div key={activity} className="flex items-center space-x-2">
              <Checkbox
                id={`activity-${activity}`}
                className='cursor-pointer data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700'
                checked={selectedActivities.includes(activity)}
                onCheckedChange={() => onToggleActivity(activity)}
              />
              <label
                htmlFor={`activity-${activity}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {activity}
              </label>
            </div>
          ))}
        </div>
        
        {selectedActivities.length > 0 && (
          <div className="mt-4 p-3 bg-emerald-50 rounded-md border border-emerald-200">
            <p className="text-sm font-medium text-emerald-700">
              Atividades selecionadas ({selectedActivities.length}):
            </p>
            <p className="text-sm text-emerald-600 mt-1">
              {selectedActivities.join(' • ')}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}