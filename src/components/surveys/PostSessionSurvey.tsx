import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Heart, DollarSign } from 'lucide-react';

interface PostSessionSurveyProps {
  open: boolean;
  onClose: () => void;
}

interface SurveyResponses {
  emotionalExperience: string;
  feelBetter: string;
  paymentWillingness: string;
}

export const PostSessionSurvey: React.FC<PostSessionSurveyProps> = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState<SurveyResponses>({
    emotionalExperience: '',
    feelBetter: '',
    paymentWillingness: '',
  });

  const handleSubmit = () => {
    // Store responses
    const surveyData = {
      ...responses,
      timestamp: new Date().toISOString(),
      completed: true,
    };
    
    localStorage.setItem('neurotunes_first_session_survey', JSON.stringify(surveyData));
    console.log('📊 Survey completed:', surveyData);
    
    onClose();
  };

  const canProceed = () => {
    if (step === 1) return responses.emotionalExperience !== '';
    if (step === 2) return responses.feelBetter !== '';
    if (step === 3) return responses.paymentWillingness !== '';
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headers bg-gradient-to-r from-white to-teal-300 bg-clip-text text-transparent">
            Your Feedback Matters
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Help us improve your therapeutic music experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress indicator */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  s <= step ? 'bg-teal-500' : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Emotional Experience */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-teal-400" />
                <h3 className="text-lg font-headers text-white">
                  Rate your emotional experience
                </h3>
              </div>
              <RadioGroup
                value={responses.emotionalExperience}
                onValueChange={(value) =>
                  setResponses({ ...responses, emotionalExperience: value })
                }
                className="space-y-3"
              >
                {['1', '2', '3', '4', '5'].map((rating) => (
                  <div
                    key={rating}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <RadioGroupItem value={rating} id={`emotion-${rating}`} />
                    <Label
                      htmlFor={`emotion-${rating}`}
                      className="flex-1 cursor-pointer text-white font-body"
                    >
                      {rating} - {rating === '1' ? 'Poor' : rating === '2' ? 'Fair' : rating === '3' ? 'Good' : rating === '4' ? 'Very Good' : 'Excellent'}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Feel Better */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-teal-400" />
                <h3 className="text-lg font-headers text-white">
                  "I feel better" after listening
                </h3>
              </div>
              <RadioGroup
                value={responses.feelBetter}
                onValueChange={(value) =>
                  setResponses({ ...responses, feelBetter: value })
                }
                className="space-y-3"
              >
                {['1', '2', '3', '4', '5'].map((rating) => (
                  <div
                    key={rating}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <RadioGroupItem value={rating} id={`better-${rating}`} />
                    <Label
                      htmlFor={`better-${rating}`}
                      className="flex-1 cursor-pointer text-white font-body"
                    >
                      {rating} - {rating === '1' ? 'Strongly Disagree' : rating === '2' ? 'Disagree' : rating === '3' ? 'Neutral' : rating === '4' ? 'Agree' : 'Strongly Agree'}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Payment Willingness */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-teal-400" />
                <h3 className="text-lg font-headers text-white">
                  What would you pay for this service?
                </h3>
              </div>
              <p className="text-sm text-gray-300 font-body mb-4">
                If you received this as an App Store app from a recommending clinician:
              </p>
              <RadioGroup
                value={responses.paymentWillingness}
                onValueChange={(value) =>
                  setResponses({ ...responses, paymentWillingness: value })
                }
                className="space-y-3"
              >
                <div className="flex items-start space-x-3 p-4 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer">
                  <RadioGroupItem value="free" id="payment-free" className="mt-1" />
                  <Label
                    htmlFor="payment-free"
                    className="flex-1 cursor-pointer text-white font-body leading-relaxed"
                  >
                    I wouldn't be able or willing to pay, but I would use it if my clinician gave it free
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer">
                  <RadioGroupItem value="6usd" id="payment-6" className="mt-1" />
                  <Label
                    htmlFor="payment-6"
                    className="flex-1 cursor-pointer text-white font-body leading-relaxed"
                  >
                    I would pay $6 USD a month if I could use it for an hour a week
                  </Label>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer">
                  <RadioGroupItem value="15usd" id="payment-15" className="mt-1" />
                  <Label
                    htmlFor="payment-15"
                    className="flex-1 cursor-pointer text-white font-body leading-relaxed"
                  >
                    I would pay $15 a month if I could have unlimited anytime use
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Back
              </Button>
            )}
            <Button
              onClick={() => {
                if (step < 3) {
                  setStep(step + 1);
                } else {
                  handleSubmit();
                }
              }}
              disabled={!canProceed()}
              className="ml-auto bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700"
            >
              {step < 3 ? 'Next' : 'Submit'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
