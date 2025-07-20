import React from "react";

interface SlideProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bg?: string;
}

const Slide: React.FC<SlideProps> = ({ icon, title, description, bg }) => (
  <div className="flex flex-col items-center justify-center gap-6 py-10">
    <div className={`rounded-2xl p-6 shadow-lg mb-4 ${bg ? bg : 'bg-gradient-to-br from-orange-400 to-red-500'}`}>
      {icon}
    </div>
    <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
    <p className="text-xl text-gray-500 text-center max-w-md">{description}</p>
  </div>
);

export default Slide;
