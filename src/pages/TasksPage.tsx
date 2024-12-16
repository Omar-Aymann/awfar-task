import React, { useState } from 'react';
import { List, Input, Button, Form, Space, message, Checkbox } from 'antd';
import TaskItem from '../components/TaskItem';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {createTask, fetchTasks, updateTask as updateTaskToServer, deleteTask as dropTask} from '../utils/tasks.ts';
interface Task {
  _id: string;
  name: string;
  isCompleted: boolean;
}

const TasksPage: React.FC = () => {
  const [newTask, setNewTask] = useState<string>('');
  const [deletedTask, setDeletedTask] = useState<string | null>(null);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]); // Track selected task IDs

  const queryClient = useQueryClient();
  const {data: tasks = [],isLoading, isError} = useQuery('tasks', fetchTasks, {
    retry: false, 
    onError: (error) => {
        // Handle the error gracefully
        if (error instanceof Error) {
          message.error('Failed to fetch tasks: ' + error.message);
        } else {
          message.error('An unknown error occurred');
        }
      },
    });

  const addTask = () => {
    if (newTask.trim()) {
        addTaskMutation.mutate();
    }
  };
  const addTaskMutation = useMutation( async () => {
    return createTask(newTask);
  },
  {
    onSuccess: (data : Task[]) => {
        queryClient.setQueryData('tasks', data);
        message.success('task created')
      
      setNewTask('');
    },
    onError: () => {
        message.error("something wrong happened while adding your task")
    }
  }
);


  const toggleTask = (id: string, isCompleted : boolean) => {
      updateTaskMutation.mutate({id, data:{isCompleted}});
  }




  const deleteTaskMutation = useMutation(async (taskId: string) => {
     return dropTask(taskId);
  },
  {
    onSuccess: () => {
        queryClient.invalidateQueries('tasks');
        message.success('task deleted');
    }, 
    onMutate: (id: string) => {
        setDeletedTask(id);
    },
    onError: () => {
        setDeletedTask(null);
        message.error("failed to delete this task")
        
    }
  })

  const editTask = (id: string) => {
    setEditTaskId(id);
  };
  const updateTaskMutation = useMutation(async ({id, data} : {id: string, data: Partial<Task>}) => {
    return updateTaskToServer(id, data)
  }, {
    onSuccess:  (updatedTask) => {
        queryClient.setQueryData<Task[]>('tasks', (oldTasks = []) =>
            oldTasks?.map((task : Task) =>
              task._id === updatedTask._id ? { ...task, ...updatedTask } : task
            )
            )
        setEditTaskId(null);
        message.success('task updated');

    },
    onError: () => {
        message.error("failed to update this task")

    }
  })
  const updateTask = (id: string, data: Partial<Task>) => {
    updateTaskMutation.mutate({id, data});
  }
  const deleteTask = (id: string) => {
    console.log(`Delete task: ${id}`);
    deleteTaskMutation.mutate(id);
  };





  const bulkUpdateMutation = useMutation(
    async ({ ids, isCompleted }: { ids: string[]; isCompleted: boolean }) => {
      // Bulk update tasks on the server
      return Promise.all(ids.map((id) => updateTaskToServer(id, { isCompleted })));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
        setSelectedTasks([]);
        message.success('Tasks updated successfully!');
      },
      onError: () => {
        message.error("failed to Update your tasks")

      }
    }
  );

  const bulkDeleteMutation = useMutation(
    async (ids: string[]) => {
      // Bulk delete tasks on the server
      return Promise.all(ids.map((id) => dropTask(id)));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
        setSelectedTasks([]);
        message.success('Tasks deleted successfully!');
      },
      onError: () => {
        message.error("failed to delete your tasks")

      }
    }
  );



  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(tasks.map((task) => task._id)); // Select all task IDs
    } else {
      setSelectedTasks([]); // Deselect all
    }
  };

  const handleToggleSelection = (taskId: string, checked: boolean) => {
    setSelectedTasks((prevSelected) =>
      checked ? [...prevSelected, taskId] : prevSelected.filter((id) => id !== taskId)
    );
  };

  const handleBulkDelete = () => {
    bulkDeleteMutation.mutate(selectedTasks);
  };

  const handleBulkUpdate = (isCompleted: boolean) => {
    bulkUpdateMutation.mutate({ ids: selectedTasks, isCompleted });
  };
  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      <h1>My Tasks</h1>

      {/* Input for adding a new task */}
      <Form
        layout="inline"
        onFinish={addTask}
        style={{ marginBottom: '20px', justifyContent: 'center'}}
        className='w-full'
      >
        <Form.Item>
          <Input
            placeholder="Enter a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
        

          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={addTaskMutation.isLoading}>
            Add Task
          </Button>
        </Form.Item>
      </Form>

        <div>

        </div>

{/* Select All and Bulk Actions */}
<div style={{ marginBottom: '10px' }}>
    
        <Checkbox
          checked={selectedTasks.length === tasks.length && tasks.length > 0}
          indeterminate={selectedTasks.length > 0 && selectedTasks.length < tasks.length}
          onChange={(e) => handleSelectAll(e.target.checked)}
        >
          Select All
        </Checkbox>
        <Space style={{ marginLeft: '10px' }}>
          <Button
            type="default"
            onClick={() => handleBulkUpdate(true)}
            disabled={selectedTasks.length === 0}
          >
            Mark as Complete
          </Button>
          <Button
            type="default"
            onClick={() => handleBulkUpdate(false)}
            disabled={selectedTasks.length === 0}
          >
            Mark as Incomplete
          </Button>
          <Button
            type="primary"
            danger
            onClick={handleBulkDelete}
            disabled={selectedTasks.length === 0}
          >
            Delete Selected
          </Button>
        </Space>
      </div>

      {/* Task List */}

      {!isError && <List
        bordered
        dataSource={tasks}
        loading={isLoading}
        renderItem={(task) => (
          <TaskItem
            task={task}
            onToggle={toggleTask}
            onEdit={editTask}
            onDelete={deleteTask}
            deleteLoading={task._id == deletedTask && deleteTaskMutation.isLoading}
            updateLoading={task._id == editTaskId && updateTaskMutation.isLoading}
            isEdited={task._id == editTaskId}
            onUpdate={updateTask}
            selectCheck={selectedTasks.includes(task._id)}
            onSelect={(checked) => handleToggleSelection(task._id, checked)}
          />
        )}
      /> }
    </div>
  );
};

export default TasksPage;
