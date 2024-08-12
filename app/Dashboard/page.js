/* eslint-disable @next/next/no-img-element */
"use client";

import { Layout, Menu, Button, Spin } from "antd";
import {
  DashboardOutlined, // Dashboard
  UsergroupAddOutlined, // Users
  SettingOutlined, // Settings
  LogoutOutlined, // Logout
  PictureOutlined, // Sliders
  AppstoreAddOutlined, // Services
  FolderOpenOutlined, // Portfolio
} from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SliderPage from "@/components/SliderPage";
import DashboardHome from "@/components/DashboardHome";
import ServicePage from "@/components/ServicePage";
import PortfolioPage from "@/components/PortfolioPage";
import UserPage from "@/components/UserPage";

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("1");
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    router.push("/login");
  };

  useEffect(() => {
    // Simulate a content load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the timeout as needed

    return () => clearTimeout(timer);
  }, [selectedMenu]);

  const renderContent = () => {
    switch (selectedMenu) {
      case "1":
        return <DashboardHome />;
      case "2":
        return <SliderPage />;
      case "3":
        return <ServicePage />;
      case "4":
        return <UserPage />;
      case "5":
        return <PortfolioPage />;
      default:
        return (
          <div className="text-gray-900 text-lg font-medium">
            Welcome to your dashboard! This is the main content area where you
            can add your dashboard widgets, charts, and more.
          </div>
        );
    }
  };

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className="site-layout-background">
        <div className="logo-container pt-4 pb-3 flex items-center justify-center">
          <Image
            src="/images/logo.png" // Update with the path to your logo image
            alt="Logo"
            width={collapsed ? 50 : 90}
            height={collapsed ? 25 : 30}
            className="pt-2"
          />
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[selectedMenu]}
          onClick={(e) => setSelectedMenu(e.key)}>
          <Menu.Item
            key="1"
            icon={<DashboardOutlined style={{ color: "#8ABF55" }} />}>
            <span className="text-[#8ABF55] font-medium">Dashboard</span>
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<PictureOutlined style={{ color: "#8ABF55" }} />}>
            <span className="text-[#8ABF55] font-medium">Sliders</span>
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<AppstoreAddOutlined style={{ color: "#8ABF55" }} />}>
            <span className="text-[#8ABF55] font-medium">Services</span>
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<UsergroupAddOutlined style={{ color: "#8ABF55" }} />}>
            <span className="text-[#8ABF55] font-medium">Users</span>
          </Menu.Item>
          <Menu.Item
            key="5"
            icon={<FolderOpenOutlined style={{ color: "#8ABF55" }} />}>
            <span className="text-[#8ABF55] font-medium">Portfolio</span>
          </Menu.Item>
          <Menu.Item
            key="6"
            icon={<SettingOutlined style={{ color: "#8ABF55" }} />}>
            <span className="text-[#8ABF55] font-medium">Settings</span>
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Layout */}
      <Layout className="site-layout">
        {/* Header */}
        <Header
          className="bg-white flex justify-between items-center px-8 py-4 shadow-md"
          style={{ padding: 0 }}>
          <h1 className="text-2xl font-bold text-[#8ABF55]">Dashboard</h1>
          <Button
            icon={<LogoutOutlined />}
            type="primary"
            className="bg-[#8ABF55] text-white border-none hover:bg-[#7DA54E]"
            onClick={handleLogout}>
            Logout
          </Button>
        </Header>

        {/* Content */}
        <Content className="m-6 p-6 bg-white rounded-lg shadow-lg">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Spin size="large" />
            </div>
          ) : (
            renderContent()
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
