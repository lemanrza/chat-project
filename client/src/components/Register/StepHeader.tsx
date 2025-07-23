import { type LucideIcon } from "lucide-react";

interface StepHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

function StepHeader({ icon: Icon, title, subtitle }: StepHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E5F8F1] rounded-full mb-4">
        <Icon className="w-8 h-8 text-[#00B878]" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500">{subtitle}</p>
    </div>
  );
}

export default StepHeader;
