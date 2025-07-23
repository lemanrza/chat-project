import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepNavigationProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  canGoNext?: boolean;
  canGoBack?: boolean;
  isLastStep?: boolean;
  nextButtonText?: string;
  submitButtonText?: string;
}

function StepNavigation({
  onPrevious,
  onNext,
  onSubmit,
  canGoNext = true,
  canGoBack = true,
  isLastStep = false,
  nextButtonText = "Continue",
  submitButtonText = "Create Account"
}: StepNavigationProps) {
  return (
    <div className="flex gap-3">
      {onPrevious && (
        <button
          type="button"
          onClick={onPrevious}
          disabled={!canGoBack}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
      )}
      
      {isLastStep ? (
        <button
          type="submit"
          onClick={onSubmit}
          className="flex-1 bg-[#00B878] hover:bg-[#00a76d] text-white py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg"
        >
          {submitButtonText}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className={`${onPrevious ? 'flex-1' : 'px-8'} py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            canGoNext
              ? 'bg-[#00B878] hover:bg-[#00a76d] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {nextButtonText}
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default StepNavigation;