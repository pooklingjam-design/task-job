import { useRef } from 'react';

interface Task {
  id: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  photo: string | null;
  createdAt: string;
}

interface WorkerPanelProps {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
}

export default function WorkerPanel({ tasks, onUpdateTasks }: WorkerPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pending টাস্কগুলো
  const pendingTasks = tasks.filter(task => task.status === 'pending');

  // টাস্ক আপডেট করুন
  const updateTaskStatus = (taskId: string, status: 'approved' | 'rejected', photo: string | null = null) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status, photo } : task
    );
    onUpdateTasks(updatedTasks);
  };

  // ফটো আপলোড হ্যান্ডলার
  const handlePhotoUpload = (taskId: string, file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          updateTaskStatus(taskId, 'approved', e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ফটো বাটন ক্লিক হ্যান্ডলার
  const handlePhotoButtonClick = (taskId: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-task-id', taskId);
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => {
          const taskId = e.target.getAttribute('data-task-id');
          if (taskId && e.target.files && e.target.files[0]) {
            handlePhotoUpload(taskId, e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {pendingTasks.length === 0 ? (
        <p className="text-gray-500 text-center py-4">কোনো পেন্ডিং টাস্ক নেই</p>
      ) : (
        pendingTasks.map(task => (
          <div key={task.id} className="border border-gray-200 p-4 rounded mb-3 bg-white">
            <p className="font-medium mb-3 text-gray-800">{task.email}</p>
            
            <div className="flex gap-2 flex-wrap">
              {/* ফটো আপলোড বাটন */}
              <button
                onClick={() => handlePhotoButtonClick(task.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors flex-1 min-w-[120px]"
              >
                📷 ফটো আপলোড
              </button>

              {/* Approved বাটন */}
              <button
                onClick={() => updateTaskStatus(task.id, 'approved')}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm transition-colors flex-1 min-w-[100px]"
              >
                ✅ Approved
              </button>

              {/* Rejected বাটন */}
              <button
                onClick={() => updateTaskStatus(task.id, 'rejected')}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors flex-1 min-w-[100px]"
              >
                ❌ Rejected
              </button>
            </div>
          </div>
        ))
      )}

      {/* Approved টাস্ক প্রিভিউ */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Completed Tasks:</h3>
        {tasks.filter(t => t.status !== 'pending').length === 0 ? (
          <p className="text-gray-500 text-sm">কোনো কমপ্লিটেড টাস্ক নেই</p>
        ) : (
          tasks
            .filter(t => t.status !== 'pending')
            .map(task => (
              <div key={task.id} className={`p-2 mb-1 rounded text-sm ${
                task.status === 'approved' ? 'bg-green-50' : 'bg-red-50'
              }`}>
                {task.email} - {task.status} {task.photo && '📷'}
              </div>
            ))
        )}
      </div>
    </div>
  );
}
