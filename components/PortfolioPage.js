"use client";

import { useState } from "react";
import { Button, Modal, Form, Input, Upload, Table, message } from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

const PortfolioPage = () => {
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const handleCreate = (values) => {
    setPortfolios([
      ...portfolios,
      {
        key: uuidv4(),
        image: values.image[0].originFileObj,
        portfolioName: values.portfolioName,
        details: values.details,
      },
    ]);
    form.resetFields();
    setVisible(false);
    message.success("Portfolio item added successfully!");
  };

  const handleUpdate = (values) => {
    setPortfolios(
      portfolios.map((portfolio) =>
        portfolio.key === editingKey
          ? {
              ...portfolio,
              image: values.image[0].originFileObj,
              portfolioName: values.portfolioName,
              details: values.details,
            }
          : portfolio
      )
    );
    setEditingKey(null);
    setVisible(false);
    message.success("Portfolio item updated successfully!");
  };

  const handleDelete = (key) => {
    setPortfolios(portfolios.filter((portfolio) => portfolio.key !== key));
    message.success("Portfolio item deleted successfully!");
  };

  const handleEdit = (record) => {
    setEditingKey(record.key);
    form.setFieldsValue({
      image: [record.image],
      portfolioName: record.portfolioName,
      details: record.details,
    });
    setVisible(true);
    setIsEditing(true);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <img
          src={URL.createObjectURL(text)}
          alt="Portfolio"
          style={{ width: 100, height: 60, objectFit: 'cover' }}
        />
      ),
    },
    {
      title: "Portfolio Name",
      dataIndex: "portfolioName",
      key: "portfolioName",
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
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

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <Button
        type="primary"
        onClick={() => {
          setIsEditing(false);
          form.resetFields();
          setVisible(true);
        }}
        className="mb-4 bg-[#8ABF55] hover:bg-[#7DA54E] text-white">
        Add New Portfolio
      </Button>
      <Table
        columns={columns}
        dataSource={portfolios}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: portfolios.length,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
        scroll={{ x: true }} // Enables horizontal scrolling for tables with many columns
      />
      <Modal
        title={isEditing ? "Edit Portfolio" : "Create Portfolio"}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        className="p-4 md:p-6 lg:p-8">
        <Form form={form} onFinish={isEditing ? handleUpdate : handleCreate}>
          <Form.Item
            name="image"
            label="Image"
            rules={[{ required: true, message: "Please upload an image!" }]}>
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false} // Prevent automatic upload
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="portfolioName"
            label="Portfolio Name"
            rules={[
              { required: true, message: "Please enter a portfolio name!" },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="details"
            label="Details"
            rules={[{ required: true, message: "Please enter details!" }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-[#8ABF55] hover:bg-[#7DA54E] text-white">
              {isEditing ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PortfolioPage;
