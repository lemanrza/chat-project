import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="flex justify-center items-center mb-6">
      <div className="flex items-center">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    stepNumber === currentStep
                      ? 'bg-[#00B878] text-white shadow-lg shadow-green-200'
                      : stepNumber < currentStep
                        ? 'bg-[#00B878] text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stepNumber < currentStep ? '✓' : stepNumber}
                </div>
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`h-0.5 w-16 mx-2 transition-all duration-300 ${
                    stepNumber < currentStep ? 'bg-[#00B878]' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressBar;