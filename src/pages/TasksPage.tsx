import React, { useState } from 'react';
import { List, Input, Button, Form, Spin } from 'antd';
import TaskItem from '../components/TaskItem';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {createTask, fetchTasks, updateTask, deleteTask as dropTask} from '../utils/tasks.ts';
interface Task {
  _id: string;
  name: string;
  isCompleted: boolean;
}

const TasksPage: React.FC = () => {
  const [newTask, setNewTask] = useState<string>('');
  const [deletedTask, setDeletedTask] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const {data: tasks = [],isLoading, isError, error} = useQuery('tasks', fetchTasks)
  const addTaskMutation = useMutation( async () => {
    return createTask(newTask);
  },
  {
    onSuccess: (data : Array<Task>) => {
        queryClient.setQueryData('tasks', data);
      
      setNewTask('');
    }
  }
);

  // Handlers for task actions
  const addTask = () => {
    if (newTask.trim()) {
        addTaskMutation.mutate();
    }
  };
  const toggleTaskMutation = useMutation(async (task: Task) => {
        return updateTask(task._id, { isCompleted: !task.isCompleted });
  });
  const deleteTaskMutation = useMutation(async (taskId: string) => {
     return dropTask(taskId);
  },
  {
    onSuccess: (data : {tasks: Task[], message: string}) => {
        queryClient.setQueryData('tasks', data.tasks);
    }, 
    onMutate: (id: string) => {
        setDeletedTask(id);
    },
    onError: () => {
        setDeletedTask(null);
        
    }
  })
  const toggleTask = (id: string) => {
    const taskToUpdate = tasks.find((task) => task._id === id);
    if (taskToUpdate) {
      toggleTaskMutation.mutate(taskToUpdate);
    }
  };
  const editTask = (id: string) => {
    console.log(`Edit task: ${id}`); // Placeholder for edit functionality
  };

  const deleteTask = (id: string) => {
    console.log(`Delete task: ${id}`);
    deleteTaskMutation.mutate(id);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h1>My Tasks</h1>

      {/* Input for adding a new task */}
      <Form
        layout="inline"
        onFinish={addTask}
        style={{ marginBottom: '20px', justifyContent: 'center' }}
      >
        <Form.Item>
          <Input
            placeholder="Enter a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Task
          </Button>
        </Form.Item>
      </Form>

      {/* Task List */}
      <div className='flex items-center justify-center py-3'>
        {(addTaskMutation.isLoading || isLoading) && <Spin size="large" />}
      </div>
      <List
        bordered
        dataSource={tasks}
        renderItem={(task) => (
          <TaskItem
            task={task}
            onToggle={toggleTask}
            onEdit={editTask}
            onDelete={deleteTask}
            deleteLoading={task._id == deletedTask && deleteTaskMutation.isLoading}
          />
        )}
      />
    </div>
  );
};

export default TasksPage;
