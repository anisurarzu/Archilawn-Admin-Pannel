"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Upload,
  Table,
  message,
  Popconfirm,
  Spin,
  Pagination,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useFormik } from "formik";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const PortfolioPage = () => {
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token"); // Retrieve the token from localStorage

  // Fetch portfolios from API
  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://archilawn-server.onrender.com/api/portfolios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolios(response.data);
    } catch (error) {
      message.error("Failed to fetch portfolios. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const formik = useFormik({
    initialValues: {
      image: null,
      title: "",
      details: "",
    },
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("image", values.image);

        const imageUploadResponse = await axios.post(
          "https://api.imgbb.com/1/upload?key=0d928e97225b72fcd198fa40d99a15d5",
          formData
        );

        const newPortfolio = {
          key: uuidv4(),
          image: imageUploadResponse.data.data.url,
          title: values.title,
          details: values.details,
        };

        if (isEditing) {
          await axios.put(`https://archilawn-server.onrender.com/api/portfolio/${editingKey}`, newPortfolio, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPortfolios((prev) =>
            prev.map((portfolio) =>
              portfolio.key === editingKey ? newPortfolio : portfolio
            )
          );
          message.success("Portfolio updated successfully!");
        } else {
          await axios.post("https://archilawn-server.onrender.com/api/portfolio", newPortfolio, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPortfolios((prev) => [...prev, newPortfolio]);
          message.success("Portfolio added successfully!");
        }

        resetForm();
        setVisible(false);
        setIsEditing(false);
        setEditingKey(null);
      } catch (error) {
        message.error("Failed to add/update portfolio. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleEdit = (record) => {
    setEditingKey(record.key);
    formik.setValues({
      image: null,
      title: record.title,
      details: record.details,
    });
    setVisible(true);
    setIsEditing(true);
  };

  const handleDelete = async (key) => {
    setLoading(true);
    try {
      await axios.delete(`https://archilawn-server.onrender.com/api/portfolio/${key}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolios((prev) =>
        prev.filter((portfolio) => portfolio.key !== key)
      );
      message.success("Portfolio item deleted successfully!");
    } catch (error) {
      message.error("Failed to delete portfolio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img src={image} alt="Portfolio" style={{ width: 100, height: 60 }} />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
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
          <Popconfirm
            title="Are you sure you want to delete this portfolio?"
            onConfirm={() => handleDelete(record.key)}>
            <Button icon={<DeleteOutlined />} className="text-red-500" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  return (
    <div className="p-6">
      <Button
        type="primary"
        onClick={() => {
          formik.resetForm();
          setVisible(true);
          setIsEditing(false);
        }}
        className="mb-4 bg-[#8ABF55] hover:bg-[#7DA54E] text-white">
        Add New Portfolio
      </Button>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={portfolios}
          pagination={false}
          rowKey="key"
          onChange={handleTableChange}
          scroll={{ x: true }}
        />
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={portfolios.length}
          onChange={(page) => setPagination({ ...pagination, current: page })}
          className="mt-4"
        />
      </Spin>

      <Modal
        title={isEditing ? "Edit Portfolio" : "Create Portfolio"}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Image</label>
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={(file) => {
                formik.setFieldValue("image", file);
                return false;
              }}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Portfolio Name</label>
            <input
              type="text"
              name="title"
              onChange={formik.handleChange}
              value={formik.values.title}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Details</label>
            <textarea
              name="details"
              onChange={formik.handleChange}
              value={formik.values.details}
              rows={4}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <Button
            loading={loading}
              type="primary"
              htmlType="submit"
              className="bg-[#8ABF55] hover:bg-[#7DA54E] text-white">
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PortfolioPage;
