import { useState } from 'react';

interface Task {
  id: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  photo: string | null;
  createdAt: string;
}

interface AdminPanelProps {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
}

export default function AdminPanel({ tasks, onUpdateTasks }: AdminPanelProps) {
  const [emails, setEmails] = useState('');

  // বাল্ক ইমেইল এড করুন
  const addBulkEmails = () => {
    const emailList = emails.split('\n')
      .map(email => email.trim())
      .filter(email => email.includes('@'));
    
    if (emailList.length === 0) {
      alert('দয়া করে সঠিক ইমেইল দিন!');
      return;
    }

    const newTasks = emailList.map(email => ({
      id: Date.now() + Math.random().toString(),
      email,
      status: 'pending' as const,
      photo: null,
      createdAt: new Date().toISOString()
    }));

    onUpdateTasks([...tasks, ...newTasks]);
    setEmails('');
    alert(`${emailList.length}টি ইমেইল যোগ করা হয়েছে!`);
  };

  // Approved টাস্ক এক্সপোর্ট করুন
  const exportApproved = () => {
    const approvedTasks = tasks.filter(task => task.status === 'approved');
    if (approvedTasks.length === 0) {
      alert('কোনো Approved টাস্ক নেই!');
      return;
    }

    const exportData = approvedTasks.map(task => 
      `${task.email} - ${task.photo ? 'Photo Uploaded' : 'No Photo'}`
    ).join('\n');
    
    navigator.clipboard.writeText(exportData);
    alert(`${approvedTasks.length}টি Approved টাস্ক কপি করা হয়েছে!`);
  };

  // টাস্ক ডিলিট করুন
  const deleteTask = (taskId: string) => {
    if (confirm('আপনি কি এই টাস্ক ডিলিট করতে চান?')) {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      onUpdateTasks(updatedTasks);
    }
  };

  // সব টাস্ক ডিলিট করুন
  const deleteAllTasks = () => {
    if (confirm('আপনি কি সব টাস্ক ডিলিট করতে চান?')) {
      onUpdateTasks([]);
    }
  };

  return (
    <div>
      {/* ইমেইল এড ফর্ম */}
      <div className="mb-6">
        <textarea
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          placeholder={`এক লাইনে একটি ইমেইল দিন\nউদাহরণ:\nworker1@email.com\nworker2@email.com`}
          className="w-full p-3 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={5}
        />
        <button 
          onClick={addBulkEmails}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          ইমেইল এড করুন
        </button>
      </div>

      {/* Approved এক্সপোর্ট */}
      <div className="mb-4">
        <button 
          onClick={exportApproved}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors mr-2"
        >
          Approved লিস্ট কপি করুন
        </button>
        
        <button 
          onClick={deleteAllTasks}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
        >
          সব টাস্ক ডিলিট করুন
        </button>
      </div>

      {/* টাস্ক স্ট্যাটাস */}
      <div className="grid grid-cols-3 gap-2 text-center mb-6">
        <div className="bg-yellow-100 p-2 rounded border">
          <div className="font-bold">{tasks.filter(t => t.status === 'pending').length}</div>
          <div className="text-sm">Pending</div>
        </div>
        <div className="bg-green-100 p-2 rounded border">
          <div className="font-bold">{tasks.filter(t => t.status === 'approved').length}</div>
          <div className="text-sm">Approved</div>
        </div>
        <div className="bg-red-100 p-2 rounded border">
          <div className="font-bold">{tasks.filter(t => t.status === 'rejected').length}</div>
          <div className="text-sm">Rejected</div>
        </div>
      </div>

      {/* সব টাস্কের লিস্ট */}
      <div className="max-h-60 overflow-y-auto">
        <h3 className="font-semibold mb-2">সব টাস্ক:</h3>
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-sm">কোনো টাস্ক নেই</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className={`p-2 mb-1 rounded text-sm flex justify-between items-center ${
              task.status === 'approved' ? 'bg-green-50' : 
              task.status === 'rejected' ? 'bg-red-50' : 'bg-yellow-50'
            }`}>
              <span>{task.email}</span>
              <button 
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
