"use client";

import { useState } from "react";
import { Button, Modal, Form, Input, Upload, Table, message } from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

const ServicePage = () => {
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [services, setServices] = useState([]);
  const [form] = Form.useForm();

  const handleCreate = (values) => {
    setServices([
      ...services,
      {
        key: uuidv4(),
        image: values.image[0].originFileObj,
        serviceName: values.serviceName,
        serviceDetails: values.serviceDetails,
        price: values.price,
      },
    ]);
    form.resetFields();
    setVisible(false);
    message.success("Service added successfully!");
  };

  const handleUpdate = (values) => {
    setServices(
      services.map((service) =>
        service.key === editingKey
          ? {
              ...service,
              image: values.image[0].originFileObj,
              serviceName: values.serviceName,
              serviceDetails: values.serviceDetails,
              price: values.price,
            }
          : service
      )
    );
    setEditingKey(null);
    setVisible(false);
    message.success("Service updated successfully!");
  };

  const handleDelete = (key) => {
    setServices(services.filter((service) => service.key !== key));
    message.success("Service deleted successfully!");
  };

  const handleEdit = (record) => {
    setEditingKey(record.key);
    form.setFieldsValue({
      image: [record.image],
      serviceName: record.serviceName,
      serviceDetails: record.serviceDetails,
      price: record.price,
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
          alt="Service"
          style={{ width: 100, height: 60 }}
        />
      ),
    },
    {
      title: "Service Name",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Service Details",
      dataIndex: "serviceDetails",
      key: "serviceDetails",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
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
    <div className="p-4 md:p-6 lg:p-8">
      <Button
        type="primary"
        onClick={() => {
          setIsEditing(false);
          form.resetFields();
          setVisible(true);
        }}
        className="mb-4 bg-[#8ABF55] hover:bg-[#7DA54E] text-white">
        Add New Service
      </Button>
      <Table
        columns={columns}
        dataSource={services}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }} // Enables horizontal scrolling for tables with many columns
      />
      <Modal
        title={isEditing ? "Edit Service" : "Create Service"}
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
            name="serviceName"
            label="Service Name"
            rules={[
              { required: true, message: "Please enter a service name!" },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="serviceDetails"
            label="Service Details"
            rules={[
              { required: true, message: "Please enter service details!" },
            ]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter the price!" }]}>
            <Input prefix="$" />
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

export default ServicePage;
