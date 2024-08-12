"use client";

import { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Table,
  message,
  Popconfirm,
  Pagination,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";

const SliderPage = () => {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [sliders, setSliders] = useState([]);
  const [editingSlider, setEditingSlider] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const handleCreate = (values) => {
    setSliders([
      ...sliders,
      {
        key: uuidv4(),
        image: values.image[0].originFileObj,
        title: values.title,
        subtitle: values.subtitle,
      },
    ]);
    form.resetFields();
    setVisible(false);
    message.success("Slider added successfully!");
  };

  const handleUpdate = (values) => {
    setSliders(
      sliders.map((slider) =>
        slider.key === editingSlider.key
          ? { ...slider, title: values.title, subtitle: values.subtitle }
          : slider
      )
    );
    setEditingSlider(null);
    form.resetFields();
    setEditVisible(false);
    message.success("Slider updated successfully!");
  };

  const handleDelete = (key) => {
    setSliders(sliders.filter((slider) => slider.key !== key));
    message.success("Slider deleted successfully!");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <img
          src={URL.createObjectURL(text)}
          alt="Slider"
          style={{ width: 100, height: 60 }}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Subtitle",
      dataIndex: "subtitle",
      key: "subtitle",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingSlider(record);
              form.setFieldsValue({
                title: record.title,
                subtitle: record.subtitle,
              });
              setEditVisible(true);
            }}
            className="text-[#8ABF55]"
          />
          <Popconfirm
            title="Are you sure you want to delete this slider?"
            onConfirm={() => handleDelete(record.key)}>
            <Button icon={<DeleteOutlined />} className="text-red-500" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const paginatedData = sliders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-6">
      <Button
        type="primary"
        onClick={() => setVisible(true)}
        className="mb-4 bg-[#8ABF55] hover:bg-[#7DA54E] text-white">
        Add New Slider
      </Button>
      <Table
        columns={columns}
        dataSource={paginatedData}
        pagination={false} // Disable default pagination
        rowKey="key"
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={sliders.length}
        onChange={handlePageChange}
        className="mt-4"
      />
      <Modal
        title="Create Slider"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        className="p-6">
        <Form form={form} onFinish={handleCreate}>
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
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title!" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="subtitle"
            label="Subtitle"
            rules={[{ required: true, message: "Please enter a subtitle!" }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-[#8ABF55] hover:bg-[#7DA54E] text-white">
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Update Slider"
        visible={editVisible}
        onCancel={() => setEditVisible(false)}
        footer={null}
        className="p-6">
        <Form form={form} onFinish={handleUpdate}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title!" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="subtitle"
            label="Subtitle"
            rules={[{ required: true, message: "Please enter a subtitle!" }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-[#8ABF55] hover:bg-[#7DA54E] text-white">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SliderPage;
