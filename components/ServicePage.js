"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Table,
  message,
  Spin,
  Collapse,
  InputNumber,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  useFormik,
  FieldArray,
  FormikProvider,
  Form as FormikForm,
  Field,
} from "formik";
import axios from "axios";

const { Panel } = Collapse;

const ServicePage = () => {
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const imgbbAPIKey = "0d928e97225b72fcd198fa40d99a15d5"; // Replace with your actual API key

  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://archilawn-server.onrender.com/api/services",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setServices(response.data);
    } catch (error) {
      message.error("Failed to fetch services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const formik = useFormik({
    initialValues: {
      image: null,
      title: "",
      packages: [
        // Updated field name
        { name: "", details: [{ subDetails: "" }], price: "", discount: "" },
      ],
    },
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("image", values.image);

        const imgbbResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`,
          formData
        );

        const imageUrl = imgbbResponse.data.data.url;

        const serviceData = {
          image: imageUrl,
          title: values.title,
          packages: values.packages, // Updated field name
        };

        const token = localStorage.getItem("token");

        if (isEditing) {
          await axios.put(
            `https://archilawn-server.onrender.com/api/service/${editingKey}`,
            serviceData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          message.success("Service updated successfully!");
        } else {
          await axios.post(
            "https://archilawn-server.onrender.com/api/service",
            serviceData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          message.success("Service added successfully!");
        }

        fetchServices();
        resetForm();
        setVisible(false);
        setIsEditing(false);
        setEditingKey(null);
      } catch (error) {
        message.error("Failed to save service. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleDelete = async (key) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://archilawn-server.onrender.com/api/service/${key}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Service deleted successfully!");
      fetchServices();
    } catch (error) {
      message.error("Failed to delete service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    formik.setValues({
      image: null,
      title: record.title,
      packages: record.packages, // Updated field name
    });
    setEditingKey(record?._id);
    setVisible(true);
    setIsEditing(true);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <img src={text} alt="Service" style={{ width: 100, height: 60 }} />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Packages",
      key: "packages", // Updated field name
      render: (_, record) => (
        <div>
          {record?.packages?.map(
            (
              pkg,
              index // Updated field name
            ) => (
              <Collapse key={index}>
                <Panel header={pkg.name} key={index}>
                  <div>
                    <strong>Details:</strong>
                  </div>
                  {pkg.details.map((detail, idx) => (
                    <div key={idx}>- {detail.subDetails}</div>
                  ))}
                  <div>
                    <strong>Price:</strong> ${pkg.price}
                  </div>
                  <div>
                    <strong>Discount:</strong> ${pkg.discount}
                  </div>
                </Panel>
              </Collapse>
            )
          )}
        </div>
      ),
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
            onClick={() => handleDelete(record._id)}
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
          formik.resetForm();
          setVisible(true);
        }}
        className="mb-4 bg-[#8ABF55] hover:bg-[#7DA54E] text-white">
        Add New Service
      </Button>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={services}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Spin>
      <Modal
        title={isEditing ? "Edit Service" : "Create Service"}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        className="p-4 md:p-6 lg:p-8">
        <FormikProvider value={formik}>
          <FormikForm onSubmit={formik.handleSubmit}>
            <Form.Item
              label="Image"
              rules={[{ required: true, message: "Please upload an image!" }]}>
              <Upload
                listType="picture"
                maxCount={1}
                beforeUpload={(file) => {
                  formik.setFieldValue("image", file);
                  return false;
                }}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              label="Title"
              rules={[{ required: true, message: "Please enter a title!" }]}>
              <Input
                name="title"
                onChange={formik.handleChange}
                value={formik.values.title}
              />
            </Form.Item>
            <FieldArray
              name="packages" // Updated field name
              render={(arrayHelpers) => (
                <div>
                  {formik.values.packages?.map(
                    (
                      pkg,
                      index // Updated field name
                    ) => (
                      <div key={index} className="mb-4 border p-4 rounded">
                        <Form.Item
                          label={`Package Name ${index + 1}`}
                          rules={[
                            {
                              required: true,
                              message: "Please enter a package name!",
                            },
                          ]}>
                          <Input
                            name={`packages.${index}.name`} // Updated field name
                            onChange={formik.handleChange}
                            value={pkg.name}
                          />
                        </Form.Item>
                        <FieldArray
                          name={`packages.${index}.details`} // Updated field name
                          render={(detailsArrayHelpers) => (
                            <div>
                              <Button
                                type="dashed"
                                onClick={() =>
                                  detailsArrayHelpers.push({ subDetails: "" })
                                }
                                icon={<PlusOutlined />}
                                className="mb-2">
                                Add Detail
                              </Button>
                              {pkg.details.map((detail, idx) => (
                                <div key={idx} className="mb-2">
                                  <Form.Item
                                    label={`Detail ${idx + 1}`}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please enter detail!",
                                      },
                                    ]}>
                                    <Input
                                      name={`packages.${index}.details.${idx}.subDetails`} // Updated field name
                                      onChange={formik.handleChange}
                                      value={detail.subDetails}
                                    />
                                  </Form.Item>
                                  <Button
                                    type="link"
                                    onClick={() =>
                                      detailsArrayHelpers.remove(idx)
                                    }
                                    className="text-red-500">
                                    Remove
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        />
                        <Form.Item
                          label={`Price ${index + 1}`}
                          rules={[
                            {
                              required: true,
                              message: "Please enter the price!",
                            },
                          ]}>
                          <InputNumber
                            name={`packages.${index}.price`} // Updated field name
                            onChange={
                              (value) =>
                                formik.setFieldValue(
                                  `packages.${index}.price`,
                                  value
                                ) // Updated field name
                            }
                            value={pkg.price}
                          />
                        </Form.Item>
                        <Form.Item
                          label={`Discount ${index + 1}`}
                          rules={[
                            {
                              required: true,
                              message: "Please enter the discount!",
                            },
                          ]}>
                          <InputNumber
                            name={`packages.${index}.discount`} // Updated field name
                            onChange={
                              (value) =>
                                formik.setFieldValue(
                                  `packages.${index}.discount`,
                                  value
                                ) // Updated field name
                            }
                            value={pkg.discount}
                          />
                        </Form.Item>
                        <Button
                          type="link"
                          onClick={() => arrayHelpers.remove(index)}
                          className="text-red-500">
                          Remove Package
                        </Button>
                      </div>
                    )
                  )}
                  <Button
                    type="dashed"
                    onClick={() =>
                      arrayHelpers.push({
                        name: "",
                        details: [{ subDetails: "" }],
                        price: "",
                        discount: "",
                      })
                    }
                    icon={<PlusOutlined />}
                    className="mb-2">
                    Add Package
                  </Button>
                </div>
              )}
            />
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="bg-[#8ABF55] hover:bg-[#7DA54E] text-white">
                {isEditing ? "Update Service" : "Create Service"}
              </Button>
            </Form.Item>
          </FormikForm>
        </FormikProvider>
      </Modal>
    </div>
  );
};

export default ServicePage;
