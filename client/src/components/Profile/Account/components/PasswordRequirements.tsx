import type { PasswordRequirement } from "../types";

interface PasswordRequirementsProps {
  requirements: PasswordRequirement[];
  className?: string;
}

const PasswordRequirements = ({
  requirements,
  className = "",
}: PasswordRequirementsProps) => {
  const allValid = requirements.every((req) => req.isValid);

  return (
    <div className={`mt-3 p-4 bg-gray-50 rounded-lg border ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
            allValid
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {allValid ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <p
          className={`text-sm font-medium transition-colors ${
            allValid ? "text-green-700" : "text-gray-600"
          }`}
        >
          Password Requirements
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {requirements.map((requirement) => (
          <div
            key={requirement.id}
            className={`flex items-center gap-2 text-sm transition-all duration-200 ${
              requirement.isValid ? "text-green-600" : "text-gray-500"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200 ${
                requirement.isValid
                  ? "bg-green-500 scale-100"
                  : "bg-gray-300 scale-95"
              }`}
            >
              {requirement.isValid ? (
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              )}
            </div>
            <span
              className={`transition-all duration-200 ${
                requirement.isValid ? "font-medium" : "font-normal"
              }`}
            >
              {requirement.label}
            </span>
          </div>
        ))}
      </div>

      {allValid && (
        <div className="mt-3 flex items-center gap-2 text-green-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">
            Password meets all requirements!
          </span>
        </div>
      )}
    </div>
  );
};

export default PasswordRequirements;
