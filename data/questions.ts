export interface Question {
    id: number;
    type: 'mcq' | 'descriptive';
    question: string;
    options?: string[];
    correctAnswer: string;
    similarityThreshold?: number;
}

export const questions: Question[] = [
    {
        id: 3,
        type: 'mcq',
        question: 'Which planet is known as the Red Planet?',
        options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
        correctAnswer: 'Mars'
    },
    {
        id: 4,
        type: 'mcq',
        question: 'Who wrote "Romeo and Juliet"?',
        options: ['William Shakespeare', 'Charles Dickens', 'Jane Austen', 'Mark Twain'],
        correctAnswer: 'William Shakespeare'
    },
    {
        id: 5,
        type: 'descriptive',
        question: 'Describe the water cycle and its main processes.',
        correctAnswer: 'The water cycle consists of evaporation, condensation, precipitation, and collection. Water evaporates from surfaces, forms clouds through condensation, falls as precipitation, and gathers in bodies of water.',
        similarityThreshold: 0.85
    },
    {
        id: 6,
        type: 'mcq',
        question: 'What is the capital of Japan?',
        options: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'],
        correctAnswer: 'Tokyo'
    },
    {
        id: 7,
        type: 'mcq',
        question: 'Which gas do plants absorb from the atmosphere?',
        options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Helium'],
        correctAnswer: 'Carbon Dioxide'
    },
    {
        id: 8,
        type: 'descriptive',
        question: 'Explain the significance of the Industrial Revolution.',
        correctAnswer: 'The Industrial Revolution marked a shift from agrarian economies to industrialized ones, leading to mass production, urbanization, and technological advancements in the 18th and 19th centuries.',
        similarityThreshold: 0.85
    },
    {
        id: 9,
        type: 'mcq',
        question: 'Which is the longest river in the world?',
        options: ['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River'],
        correctAnswer: 'Nile River'
    },
    {
        id: 10,
        type: 'mcq',
        question: 'Who discovered gravity?',
        options: ['Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Nikola Tesla'],
        correctAnswer: 'Isaac Newton'
    },
    {
        id: 11,
        type: 'descriptive',
        question: 'What is the significance of the Pythagorean theorem in mathematics?',
        correctAnswer: 'The Pythagorean theorem states that in a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides. It is fundamental in geometry and trigonometry.',
        similarityThreshold: 0.9
    },
    {
        id: 12,
        type: 'mcq',
        question: 'Which element is essential for respiration in humans?',
        options: ['Hydrogen', 'Oxygen', 'Carbon', 'Nitrogen'],
        correctAnswer: 'Oxygen'
    },
    {
        id: 13,
        type: 'mcq',
        question: 'Which country is the largest by land area?',
        options: ['China', 'Russia', 'United States', 'Canada'],
        correctAnswer: 'Russia'
    },
    {
        id: 14,
        type: 'descriptive',
        question: 'Explain the concept of democracy.',
        correctAnswer: 'Democracy is a system of government where citizens have the power to elect representatives and participate in decision-making. It is based on principles of freedom, equality, and rule of law.',
        similarityThreshold: 0.85
    },
    {
        id: 15,
        type: 'mcq',
        question: 'What is the chemical symbol for gold?',
        options: ['Au', 'Ag', 'Pb', 'Fe'],
        correctAnswer: 'Au'
    },
    {
        id: 16,
        type: 'descriptive',
        question: 'What are the main causes of climate change?',
        correctAnswer: 'Climate change is mainly caused by human activities like burning fossil fuels, deforestation, and industrial emissions, leading to an increase in greenhouse gases and global warming.',
        similarityThreshold: 0.85
    },
    {
        id: 17,
        type: 'mcq',
        question: 'Which scientist developed the theory of relativity?',
        options: ['Isaac Newton', 'Albert Einstein', 'Stephen Hawking', 'Marie Curie'],
        correctAnswer: 'Albert Einstein'
    }
];
