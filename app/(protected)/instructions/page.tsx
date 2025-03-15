"use client"

import { useRouter } from 'next/navigation';

const InstructionPage = () => {
  const router = useRouter();

  return (
    <div className='flex flex-col h-full w-full pl-[20vw] px-24 py-16 overflow-auto text-white space-y-8'>
      <div>
        <h2 className="text-4xl font-semibold mb-1">Instructions</h2>
        <p className='text-sm opacity-70 mb-6'>Welcome to the online test. Please read the instructions carefully before proceeding.</p>
      </div>
      <div className='space-y-8 text-lg'>

        <div>
          <h3 className='text-2xl font-semibold mb-2 underline decoration-green-500'>✅ What You Should Do</h3>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Ensure a stable internet connection before starting the test. 🛜</li>
            <li>Read each question carefully before answering. 👀</li>
            <li>Manage your time wisely; you cannot pause the test. ⏸️</li>
            <li>Submit your answers before the time runs out. ⏲️</li>
          </ul>
        </div>

        <div>
          <h3 className='text-2xl font-semibold mb-2 underline decoration-red-500'>❌ What You Should NOT Do</h3>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Do not switch tabs or minimize the test window. 🔄</li>
            <li>Do not use any external help, books, or internet searches. 🔍</li>
            <li>Do not communicate with others during the test. 🗣️</li>
            <li>Do not attempt to take the test on multiple devices. 💻</li>
          </ul>
        </div>

        <div>
          <h3 className='text-2xl font-semibold mb-2'>⚖ Ethical Guidelines</h3>
          <ul className='list-disc pl-6 space-y-2'>
            <li>Honesty and integrity are crucial. Do not engage in any form of cheating. 🙊</li>
            <li>Respect the rules and ensure a fair testing environment for everyone. 🫡</li>
            <li>Your performance should reflect your own knowledge and effort. 🧠</li>
          </ul>
        </div>

        <div className='bg-orange-400/20 rounded-xl p-4 mt-6 flex flex-col gap-3'>
          <h3 className='text-2xl font-semibold text-orange-500 mb-2'>⚠️ Important Warning</h3>
          <p className='text-base'>We will be tracking ⌨️ keystrokes, 🖱️ mouse movements, and other activity to ensure compliance with the test guidelines. Any suspicious behavior may lead to disqualification.</p>
        </div>
      </div>

      <button
        onClick={() => router.push('/questions')}
        className='mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg'>
        Accept & Start
      </button>
    </div>
  );
};

export default InstructionPage;
