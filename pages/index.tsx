import { useState, useEffect } from 'react';
import AdminPanel from '../components/AdminPanel';
import WorkerPanel from '../components/WorkerPanel';

interface Task {
  id: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  photo: string | null;
  createdAt: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // localStorage থেকে টাস্ক লোড
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // টাস্ক সেভ করুন
  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">টাস্ক ম্যানেজমেন্ট</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* বাম সাইড - এডমিন */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">এডমিন প্যানেল</h2>
          <AdminPanel tasks={tasks} onUpdateTasks={saveTasks} />
        </div>

        {/* ডান সাইড - ওয়ার্কার */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">ওয়ার্কার প্যানেল</h2>
          <WorkerPanel tasks={tasks} onUpdateTasks={saveTasks} />
        </div>
      </div>
    </div>
  );
}
