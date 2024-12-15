import React from 'react';
import { List, Checkbox, Button, Space, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';

interface Task {
  _id: string;
  name: string;
  isCompleted: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  deleteLoading: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onEdit, onDelete, deleteLoading }) => {
  return (
    <List.Item
      actions={[
        <Button
          icon={<CheckOutlined />}
          color='primary'
          type="link"
          onClick={() => onToggle(task._id)}
          
        />,
        <Button
          icon={<EditOutlined />}
          type="link"
          onClick={() => onEdit(task._id)}
        />,
        <Button
          type="link"
          onClick={() => onDelete(task._id)}
          danger
        >
          {deleteLoading ? <Spin size="small" className=' text-red-600' /> : <DeleteOutlined />}
        </Button>,
      ]}
    >
      <Space>
        <Checkbox
        />
        <span
        className={`${task.isCompleted ? 'text-green-600' : 'none'} transition-colors`}
          style={{
            textDecoration: task.isCompleted ? 'line-through' : 'none',
            
          }}
        >
          {task.name}
        </span>
      </Space>
    </List.Item>
  );
};

export default TaskItem;
