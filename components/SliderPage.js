import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Upload,
  Table,
  message,
  Popconfirm,
  Pagination,
  Spin,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useFormik } from "formik";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { coreAxios } from "@/utilities/axios";

const SliderPage = ({ initialSliders }) => {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [sliders, setSliders] = useState(initialSliders);
  const [editingSlider, setEditingSlider] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false); // Loading state

  const imgbbAPIKey = "0d928e97225b72fcd198fa40d99a15d5";

  const fetchSliders = async () => {
    setLoading(true);
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");

      // Perform the GET request with the token included in the headers
      const response = await coreAxios.get("https://archilawn-server.onrender.com/api/sliders");
      // Update the sliders state with the response data
      setSliders(response.data);
    } catch (error) {
      message.error("Failed to fetch sliders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const formik = useFormik({
    initialValues: {
      image: null,
      title: "",
      subtitle: "",
    },
    onSubmit: async (values, { resetForm }) => {
      setLoading(true); // Start loading
      try {
        const formData = new FormData();
        formData.append("image", values.image);

        // Upload the image to Imgbb
        const imgbbResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`,
          formData
        );

        const imageUrl = imgbbResponse.data.data.url;

        const sliderData = {
          image: imageUrl,
          title: values.title,
          subtitle: values.subtitle,
        };

        // Token from local storage (or wherever it's stored)
        const token = localStorage.getItem("token"); // Adjust this if needed

        // Post the slider data with token in the headers
        await axios.post("https://archilawn-server.onrender.com/api/sliders", sliderData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Refetch sliders to update the list
        fetchSliders();

        message.success("Slider added successfully!");
        resetForm();
        setVisible(false);
      } catch (error) {
        message.error("Failed to add slider. Please try again.");
      } finally {
        setLoading(false); // End loading
      }
    },
  });

  const handleUpdate = async (values) => {
    setLoading(true); // Start loading
    try {
      let imageUrl = editingSlider.image;

      if (values.image) {
        const formData = new FormData();
        formData.append("image", values.image);

        const imgbbResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`,
          formData
        );

        imageUrl = imgbbResponse.data.data.url;
      }

      const updatedSlider = {
        ...editingSlider,
        title: values.title,
        subtitle: values.subtitle,
        image: imageUrl,
      };

      const token = localStorage.getItem("token"); // Adjust this if needed

      // Send update request to the server with the updated slider data
      await axios.put(
        `https://archilawn-server.onrender.com/api/sliders/${editingSlider.key}`,
        updatedSlider,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refetch sliders to update the list
      fetchSliders();

      message.success("Slider updated successfully!");
      setEditVisible(false);
      setEditingSlider(null);
      formik.resetForm();
    } catch (error) {
      message.error("Failed to update slider. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleDelete = async (key) => {
    setLoading(true); // Start loading
    try {
      const token = localStorage.getItem("token"); // Adjust this if needed

      // Send delete request to the server
      await axios.delete(`https://archilawn-server.onrender.com/sliders/${key}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refetch sliders to update the list
      fetchSliders();

      message.success("Slider deleted successfully!");
    } catch (error) {
      message.error("Failed to delete slider. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 120,
      render: (image) => (
        <img src={image} alt="Slider" style={{ width: 100, height: 60 }} />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 150,
    },
    {
      title: "Subtitle",
      dataIndex: "subtitle",
      key: "subtitle",
      width: 200,
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingSlider(record);
              formik.setValues({
                title: record.title,
                subtitle: record.subtitle,
                image: null, // Ensure image is reset for editing
              });
              setEditVisible(true);
            }}
            className="text-[#8ABF55]"
          />
          <Popconfirm
            title="Are you sure you want to delete this slider?"
            onConfirm={() => handleDelete(record?._id)}>
            <Button icon={<DeleteOutlined />} className="text-red-500" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const paginatedData = sliders?.slice(
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
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={paginatedData}
          pagination={false}
          rowKey="key"
        />
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={sliders?.length}
          onChange={handlePageChange}
          className="mt-4"
        />
      </Spin>

      <Modal
        title="Create Slider"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}>
        <form onSubmit={formik?.handleSubmit}>
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
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              onChange={formik.handleChange}
              value={formik.values.title}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              onChange={formik.handleChange}
              value={formik.values.subtitle}
              className="border p-2 w-full"
            />
          </div>
          <Button
           loading={loading}
            type="primary"
            htmlType="submit"
            className="bg-[#8ABF55] hover:bg-[#7DA54E] text-white">
            Create
          </Button>
        </form>
      </Modal>

      <Modal
        title="Update Slider"
        visible={editVisible}
        onCancel={() => setEditVisible(false)}
        footer={null}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate(formik.values);
          }}>
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
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              onChange={formik.handleChange}
              value={formik.values.title}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              onChange={formik.handleChange}
              value={formik.values.subtitle}
              className="border p-2 w-full"
            />
          </div>
          <Button
          loading={loading}
            type="primary"
            htmlType="submit"
            className="bg-[#8ABF55] hover:bg-[#7DA54E] text-white">
            Update
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const response = await axios.get("https://archilawn-server.onrender.com/api/sliders");
    return {
      props: {
        initialSliders: response.data,
      },
    };
  } catch (error) {
    return {
      props: {
        initialSliders: [],
      },
    };
  }
}

export default SliderPage;
