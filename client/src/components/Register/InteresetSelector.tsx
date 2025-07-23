import {
    Coffee, Plane, Monitor, Laptop, Dog, Cat, Music, BookOpen,
    Dumbbell, ChefHat, Palette, Camera, Gamepad2, Mountain, Waves,
    TreePine, Theater, Pizza, FolderRoot as Football, Sprout, Guitar,
    Flame, ShoppingBasket as Basketball, Target, Home, Wine, Beer,
    Umbrella, Snowflake, Car, Tent, Film, Globe, Piano
} from 'lucide-react';

interface InterestSelectorProps {
    selectedInterests: string[];
    onToggleInterest: (interest: string) => void;
}

function InterestSelector({ selectedInterests, onToggleInterest }: InterestSelectorProps) {
    const interests = [
        { name: 'Coffee', icon: Coffee },
        { name: 'Travel', icon: Plane },
        { name: 'Netflix', icon: Monitor },
        { name: 'Coding', icon: Laptop },
        { name: 'Dogs', icon: Dog },
        { name: 'Cats', icon: Cat },
        { name: 'Music', icon: Music },
        { name: 'Reading', icon: BookOpen },
        { name: 'Fitness', icon: Dumbbell },
        { name: 'Cooking', icon: ChefHat },
        { name: 'Art', icon: Palette },
        { name: 'Photo', icon: Camera },
        { name: 'Gaming', icon: Gamepad2 },
        { name: 'Hiking', icon: Mountain },
        { name: 'Swimming', icon: Waves },
        { name: 'Yoga', icon: TreePine },
        { name: 'Theater', icon: Theater },
        { name: 'Food', icon: Pizza },
        { name: 'Sports', icon: Football },
        { name: 'Garden', icon: Sprout },
        { name: 'Guitar', icon: Guitar },
        { name: 'Dancing', icon: Flame },
        { name: 'Basketball', icon: Basketball },
        { name: 'Soccer', icon: Target },
        { name: 'Darts', icon: Target },
        { name: 'Games', icon: Home },
        { name: 'Wine', icon: Wine },
        { name: 'Beer', icon: Beer },
        { name: 'Beach', icon: Umbrella },
        { name: 'Winter', icon: Snowflake },
        { name: 'Cars', icon: Car },
        { name: 'Comedy', icon: Tent },
        { name: 'Movies', icon: Film },
        { name: 'Tech', icon: Globe },
        { name: 'Nature', icon: Globe },
        { name: 'Piano', icon: Piano }
    ];

    const remainingCount = 5 - selectedInterests.length;

    return (
        <>
            <div className="grid grid-cols-6 gap-3 mb-6">
                {interests.map((interest) => {
                    const IconComponent = interest.icon;
                    const isSelected = selectedInterests.includes(interest.name);
                    return (
                        <button
                            key={interest.name}
                            type="button"
                            onClick={() => onToggleInterest(interest.name)}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${isSelected
                                    ? 'bg-[#00B878] border-[#00B878] text-white shadow-lg'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-[#00B878] hover:text-[#00B878]'
                                }`}
                            disabled={selectedInterests.length >= 5 && !isSelected}
                        >
                            <IconComponent className="w-6 h-6 mb-2" />
                            <span className="text-xs font-medium">{interest.name}</span>
                        </button>
                    );
                })}
            </div>

            <div className="text-center mb-6">
                <p className="text-sm text-gray-500">
                    Selected: {selectedInterests.length}/5 (minimum 3 required)
                </p>
                <p className="text-xs text-gray-400">
                    {remainingCount > 0
                        ? `Select ${remainingCount} more interest${remainingCount === 1 ? '' : 's'}`
                        : 'You have selected the maximum number of interests.'}
                </p>
            </div>
        </>
    );
}


export default InterestSelector;