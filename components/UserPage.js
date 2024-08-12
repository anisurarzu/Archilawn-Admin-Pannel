"use client";

import { useState } from "react";
import { Button, Modal, Form, Input, Upload, Table, message } from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

const UserPage = () => {
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const handleCreate = (values) => {
    setUsers([
      ...users,
      {
        key: uuidv4(),
        profilePicture: values.profilePicture[0].originFileObj,
        username: values.username,
        email: values.email,
        role: values.role,
      },
    ]);
    form.resetFields();
    setVisible(false);
    message.success("User added successfully!");
  };

  const handleUpdate = (values) => {
    setUsers(
      users.map((user) =>
        user.key === editingKey
          ? {
              ...user,
              profilePicture: values.profilePicture[0].originFileObj,
              username: values.username,
              email: values.email,
              role: values.role,
            }
          : user
      )
    );
    setEditingKey(null);
    setVisible(false);
    message.success("User updated successfully!");
  };

  const handleDelete = (key) => {
    setUsers(users.filter((user) => user.key !== key));
    message.success("User deleted successfully!");
  };

  const handleEdit = (record) => {
    setEditingKey(record.key);
    form.setFieldsValue({
      profilePicture: [record.profilePicture],
      username: record.username,
      email: record.email,
      role: record.role,
    });
    setVisible(true);
    setIsEditing(true);
  };

  const columns = [
    {
      title: "Profile Picture",
      dataIndex: "profilePicture",
      key: "profilePicture",
      render: (text) => (
        <img
          src={URL.createObjectURL(text)}
          alt="Profile"
          style={{ width: 100, height: 100, objectFit: 'cover' }}
        />
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-blue-500"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
            className="text-red-500"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Button
        type="primary"
        onClick={() => {
          setIsEditing(false);
          form.resetFields();
          setVisible(true);
        }}
        className="mb-4 bg-[#8ABF55] hover:bg-[#7DA54E] text-white"
      >
        Add New User
      </Button>
      <Table
        columns={columns}
        dataSource={users}
        pagination={{ ...pagination, onChange: (page, pageSize) => setPagination({ current: page, pageSize }) }}
        scroll={{ x: 'max-content' }} // Ensures table is scrollable on small screens
      />
      <Modal
        title={isEditing ? "Edit User" : "Create User"}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        className="p-6"
      >
        <Form form={form} onFinish={isEditing ? handleUpdate : handleCreate}>
          <Form.Item
            name="profilePicture"
            label="Profile Picture"
            rules={[{ required: true, message: "Please upload a profile picture!" }]}
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false} // Prevent automatic upload
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter a username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter an email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please enter a role!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-[#8ABF55] hover:bg-[#7DA54E] text-white"
            >
              {isEditing ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserPage;
