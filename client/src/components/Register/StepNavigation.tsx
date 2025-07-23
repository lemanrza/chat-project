import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepNavigationProps {
  onPrevious?: () => void;
  onNext?: () => void;
  canGoNext?: boolean;
  canGoBack?: boolean;
  nextButtonText?: string;
}

function StepNavigation({
  onPrevious,
  onNext,
  canGoNext = true,
  canGoBack = true,
  nextButtonText = "Continue",
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

      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className={`${onPrevious ? 'flex-1' : 'px-8'} py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${canGoNext
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