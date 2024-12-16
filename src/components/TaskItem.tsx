import React, { useState } from 'react';
import { List, Checkbox, Button, Space, Spin, Input, Flex } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';

interface Task {
  _id: string;
  name: string;
  isCompleted: boolean;
  
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, data: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, name: Partial<Task>) => void;
  deleteLoading: boolean;
  updateLoading: boolean;
  isEdited: boolean;
  selectCheck: boolean;
  onSelect: (checked: boolean) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onEdit, onDelete, deleteLoading, isEdited, onUpdate, updateLoading, selectCheck, onSelect }) => {
    const [editName, setEditName] = useState<string>(task.name);

    function handleUpdate() {
        if(editName.trim()) {
            onUpdate(task._id, {name: editName});
        }
    }
    function updateTask(e: React.ChangeEvent<HTMLInputElement>) {
        setEditName(e.target.value);
    }
    return (
    <List.Item
      actions={[
        <Button
          icon={<CheckOutlined />}
          color='primary'
          type="link"
          onClick={() => onToggle(task._id, !task.isCompleted)}
          
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
        checked={selectCheck}
        onChange={(e) => onSelect(e.target.checked)}
        />
        {!isEdited && <span
        className={`${task.isCompleted ? 'text-green-600' : 'none'} transition-colors`}
          style={{
            textDecoration: task.isCompleted ? 'line-through' : 'none',
            
          }}
        >
          {task.name}
        </span>}
        {isEdited && <Flex dir='row' gap={5}><Input disabled={updateLoading} onChange={updateTask} value={editName} /><Button color='primary' variant='solid' disabled={updateLoading} loading={updateLoading} onClick={handleUpdate}>Save</Button></Flex>}
      </Space>
    </List.Item>
  );
};

export default TaskItem;
